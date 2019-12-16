import React from 'react'
import {render} from '@testing-library/react'
import user from '@testing-library/user-event'
import {FavoriteNumber} from '../favorite-number'

test('entering an invalid value shows an error message', () => {
  const {getByLabelText, getByRole, rerender, queryByRole} = render(
    <FavoriteNumber />,
  )
  const input = getByLabelText(/favorite number/i)
  user.type(input, '10')
  expect(getByRole('alert')).toHaveTextContent(/the number is invalid/i)
  rerender(<FavoriteNumber max={10} />)
  expect(queryByRole('alert')).toBeNull()
})
