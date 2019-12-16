import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {HiddenMessage} from '../hidden-message'

jest.mock('react-transition-group', () => {
  return {
    CSSTransition: props => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  const hiddenMessage = 'hello world'
  const {getByText, queryByText} = render(
    <HiddenMessage>{hiddenMessage}</HiddenMessage>,
  )
  const toggleButton = getByText(/toggle/i)
  expect(queryByText(/hello world/i)).not.toBeInTheDocument()
  fireEvent.click(toggleButton)
  expect(queryByText(/hello world/i)).toBeInTheDocument()
  fireEvent.click(toggleButton)
  expect(queryByText(/hello world/i)).not.toBeInTheDocument()
})
