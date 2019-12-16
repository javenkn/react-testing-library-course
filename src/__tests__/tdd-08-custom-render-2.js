import React from 'react'
import {render, fireEvent, wait} from '@testing-library/react'
import {build, fake, sequence} from 'test-data-bot'
import {Redirect as MockRedirect} from 'react-router'
import {Editor} from '../post-editor-08-custom-render'
import {savePost as mockSavePost} from '../api'

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})

jest.mock('../api')

afterEach(() => {
  jest.clearAllMocks()
})

const postBuilder = build('Post').fields({
  title: fake(f => f.lorem.words()),
  content: fake(f => f.lorem.paragraphs().replace(/\r/g, '')),
  tags: fake(f => [f.lorem.word(), f.lorem.word(), f.lorem.word()]),
})

const userBuilder = build('User').fields({
  id: sequence(s => `user-${s}`),
})

function renderEditor() {
  const fakeUser = userBuilder()
  const fakePost = postBuilder()
  const utils = render(<Editor user={fakeUser} />)
  utils.getByLabelText(/title/i).value = fakePost.title
  utils.getByLabelText(/content/i).value = fakePost.content
  utils.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = utils.getByText(/submit/i)

  return {
    ...utils,
    submitButton,
    fakeUser,
    fakePost,
  }
}

test('renders a form with title, content, tags, and a submit button', async () => {
  mockSavePost.mockResolvedValueOnce()
  const {submitButton, fakePost, fakeUser} = renderEditor()
  const preDate = new Date().getTime()

  fireEvent.click(submitButton)
  expect(submitButton).toBeDisabled()

  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })
  expect(mockSavePost).toHaveBeenCalledTimes(1)

  const postDate = new Date().getTime()
  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  await wait(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})

test('renders an error message from the server', async () => {
  const testError = 'Test error'
  mockSavePost.mockRejectedValueOnce({data: {error: testError}})
  const {submitButton, findByRole} = renderEditor()

  fireEvent.click(submitButton)

  const postError = await findByRole('alert')
  expect(postError).toHaveTextContent(testError)
  expect(submitButton).not.toBeDisabled()
})
