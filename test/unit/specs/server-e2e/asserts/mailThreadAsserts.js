import { getThreadInfo } from '../lib/mail.lib'

function arrayContainingLatestThreadId (state, user) {
  return expect.arrayContaining(
    [expect.objectContaining({
      threadId: getThreadInfo(state, user)})])
}

function findMatchingMailThread (data, state, user) {
  const threadInfo = getThreadInfo(state, user)
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

export function assertMatchingMailThread (data, state, mailSender) {
  expect(data).toEqual(arrayContainingLatestThreadId(state, mailSender))
}

export function assertMatchingMailThreadIsRead (data, state, mailSender) {
  const thread = findMatchingMailThread(data, state, mailSender)
  expect(thread.unread).toBe(false)
}

export function assertMatchingMailThreadIsUnread (data, state, mailSender) {
  const thread = findMatchingMailThread(data, state, mailSender)
  expect(thread.unread).toBe(true)
}
