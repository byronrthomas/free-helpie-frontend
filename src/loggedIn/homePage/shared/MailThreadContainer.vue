<template>
  <div>
    <button 
      v-if="showMakeConnectionButton"
      class="btn btn-primary"
      id="makeConnection"
      @click="$emit('makeConnection')">
    Connect with user</button>
    <button
      v-if="showCancelConnectionButton"
      class="btn btn-primary"
      id="cancelConnection"
      @click="$emit('cancelConnection')">
    Cancel connection with user</button>
    <div v-if="!waitingForReply">
      <textarea 
        name="messageContents" 
        id="messageContents" 
        cols="30" rows="10" 
        v-model="newMailText"></textarea>
      <button 
        :disabled="!newMailText" 
        class="btn btn-primary" 
        id="submitButton" 
        @click="sendMail">Send</button>
    </div>
    <mail-item
      v-for="mail in mailItems"
      :key="mail.id"
      :mail="mail"
      :avatar="avatarImage(mail)"/>
  </div>
</template>

<script>
import MailItem from './MailItem.vue'

function compareDates (aDate, bDate) {
  return aDate.getTime() - bDate.getTime()
}

export default {
  props: {
    mailItems: Array,
    username: String,
    myAvatar: Object,
    otherAvatar: Object,
    connectOrCancelAllowed: {
      type: String,
      default () {
        return 'disabled'
      },
      validator (value) {
        return ['disabled', 'connectAllowed', 'cancelAllowed'].includes(value)
      }
    }
  },
  data () {
    const sortedMailItems = [...this.mailItems]
    sortedMailItems.sort((a, b) => compareDates(b.sent, a.sent))

    return {
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
      console.log('Getting a sendMail click')
      console.log(this.newMailText)
      if (this.newMailText) {
        console.log('Sending mail:')
        console.log(this.newMailText)
        this.$emit('sendMail', this.newMailText)
      }
    },
    showMakeConnectionButton () {
      return this.connectOrCancelAllowed === 'connectAllowed'
    },
    showCancelConnectionButton () {
      return this.connectOrCancelAllowed === 'cancelAllowed'
    }
  },
  components: {
    'mail-item': MailItem
  }
}
</script>

