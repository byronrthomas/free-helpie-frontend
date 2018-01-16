import { getThreadInfo } from '../lib/mail.lib'

function arrayContainingLatestThreadId (state) {
  return expect.arrayContaining(
    [expect.objectContaining({
      threadId: getThreadInfo(state)})])
}

function findMatchingMailThread (data, state) {
  const threadInfo = getThreadInfo(state)
  const isMatching = thrd => {
    return thrd.threadId.threadAuthor === threadInfo.threadAuthor &&
      thrd.threadId.relatedToPostId === threadInfo.relatedToPostId
  }
  const matching = data.find(isMatching)
  if (!matching) {
    throw new Error(`Failed to find matching thread for threadInfo {author: ${threadInfo.threadAuthor}, post: ${threadInfo.relatedToPostId}}`)
  }
  return matching
}

export function assertMatchingMailThread (data, state) {
  expect(data).toEqual(arrayContainingLatestThreadId(state))
}

export function assertMatchingMailThreadIsRead (data, state) {
  const thread = findMatchingMailThread(data, state)
  expect(thread.unread).toBe(false)
}

export function assertMatchingMailThreadIsUnread (data, state) {
  const thread = findMatchingMailThread(data, state)
  expect(thread.unread).toBe(true)
}
