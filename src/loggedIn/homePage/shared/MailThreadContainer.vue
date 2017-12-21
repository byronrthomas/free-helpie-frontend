<template>
  <div>
    <div v-if="!waitingForReply">
      <textarea name="messageContents" id="messageContents" cols="30" rows="10" v-model="newMailText"></textarea>
      <button :disabled="!newMailText" class="btn btn-primary" @click="sendMail">Send</button>
    </div>
    <mail-item 
      v-for="mail in mailItems" 
      :key="mail.id" 
      :mail="mail"
      :avatar="avatarImage(mail)"/>
  </div>
</template>

<script>
function setupState (mails) {
  const dict = {}
  for (const mail in mails) {
    dict[mail.id] = {content: mail}
  }
  return dict
}

const PERMANENT_MARK = 'permanentMark'
const TEMPORARY_MARK = 'temporaryMark'
function visit(output, allState, current) {
  if (current[PERMANENT_MARK]) return
  if (current[TEMPORARY_MARK]) {
    throw new Error("Cycle detected!")
  }
  current[TEMPORARY_MARK] = true
  const nextLink = current.content.replayToMailId
  if (allState.hasOwnProperty(nextLink)) {
    visit(output, allState, allState[nextLink])
  }
  current[PERMANENT_MARK] = true
  output.unshift(current.content)
}

function reverseTopological(mails) {
  const state = setupState(mails)
  const sorted = []
  for (const mail of mails) {
    const mailState = state[mail.id]
    if (!mailState[PERMANENT_MARK] && !mailState[TEMPORARY_MARK]) {
      visit(sorted, state, mailState)
    }
  }
  console.log("reverseTop, sorted:")
  console.log(sorted)
  return sorted
}

function compareDates(aDate, bDate) {
  return aDate.getTime() - bDate.getTime()
}

import MailItem from './MailItem.vue'
export default {
  props: {
    mailItems: Array,
    username: String,
    myAvatar: Object,
    otherAvatar: Object
  },
  data () {
    const sortedMailItems = [...this.mailItems]
    sortedMailItems.sort((a, b) => compareDates(b.sent, a.sent))
    
    return {
      fudge: 'AWESOME',
      newMailText: '',
      sortedMailItems: sortedMailItems
    }
  },
  computed: {
    waitingForReply () {
      return this.sortedMailItems.length > 0 &&
        this.sentByCurrentUser(this.sortedMailItems[0])
    }
  },
  methods: {
    sentByCurrentUser (mail) {
      return this.username === mail.sender
    },
    avatarImage (mail) {
      return this.sentByCurrentUser(mail)
        ? this.myAvatar
        : this.otherAvatar
    },
    sendMail () {
      if (this.newMailText) {
        console.log('Sending mail:')
        console.log(this.newMailText)
      }
    }
  },
  components: {
    'mail-item': MailItem
  }
}
</script>

