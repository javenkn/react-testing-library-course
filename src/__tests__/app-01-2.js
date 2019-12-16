import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import App from '../app'
import {submitForm as mockSubmitForm} from '../api'

jest.mock('../api')

test('Can fill out a form across multiple pages', async () => {
  mockSubmitForm.mockResolvedValueOnce({success: true})
  const testData = {food: 'test food', drink: 'test drink'}
  const {getByLabelText, getByText, findByText} = render(<App />)

  fireEvent.click(getByText(/fill.*form/i))

  fireEvent.change(getByLabelText(/food/i), {target: {value: testData.food}})
  fireEvent.click(getByText(/next/i))

  fireEvent.change(getByLabelText(/drink/i), {target: {value: testData.drink}})
  fireEvent.click(getByText(/review/i))

  expect(getByLabelText(/food/i)).toHaveTextContent(testData.food)
  expect(getByLabelText(/drink/i)).toHaveTextContent(testData.drink)
  fireEvent.click(getByText(/confirm/i, {selector: 'button'}))

  expect(mockSubmitForm).toHaveBeenCalledWith(testData)
  expect(mockSubmitForm).toHaveBeenCalledTimes(1)

  await wait(() => findByText(/home/i))
  fireEvent.click(getByText(/home/i))

  expect(getByText(/welcome home/i)).toBeInTheDocument()
})
