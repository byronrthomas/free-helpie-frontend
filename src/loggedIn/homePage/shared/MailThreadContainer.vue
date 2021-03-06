<template>
  <form-segment :header-text="conversationHeaderText">
    <mail-item
      v-for="mail in mailItems"
      :key="mail.id"
      :mail="mail"
      :avatar="avatarImage(mail)"/>
    <div class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">Send a message</h3>
      </div>
      <div class="panel-body">
        <textarea
          name="messageContents" 
          id="messageContents" 
          class="fullsizeTextArea"
          v-model="newMailText"></textarea>
        <button 
          :disabled="!newMailText" 
          class="btn btn-primary" 
          id="submitButton" 
          @click="sendMail">Send</button>
      </div>
    </div>
    <div class="panel panel-warning" v-if="showMakeConnectionButton">
      <div class="panel-heading">
        <h3 class="panel-title">Share contact details with user</h3>
      </div>
      <div class="panel-body">
        <div class="alert alert-warning">
          Warning: Only share contact details with this user if you are confident that they are genuine. You can unshare at any time, but  they might have captured your details already.
          <br>
          <br>
          They have to share their details with you to see your details.
        </div>
        <button 
          class="btn btn-warning"
          id="makeConnection"
          @click="$emit('makeConnection')">
          Offer to share contact details</button>
      </div>
    </div>
    <div class="panel panel-info" v-if="showCancelConnectionButton">
      <div class="panel-heading">
        <h3 class="panel-title">You are sharing contact details</h3>
      </div>
      <div class="panel-body">
        <div class="alert alert-info">
          You have offered to share your contact details with this user, you can cancel this offer (but be aware that the other user may already have read your details).
        </div>
        <button
          class="btn btn-info"
          id="cancelConnection"
          @click="$emit('cancelConnection')">
        Cancel connection with user</button>
      </div>
    </div>
  </form-segment>
</template>

<script>
import MailItem from './MailItem.vue'
import FormSegment from '../../../sharedComponents/FormSegment.vue'

export default {
  name: 'MailThreadContainer',
  props: {
    mailItems: Array,
    userId: Number,
    myAvatar: Object,
    otherAvatar: Object,
    conversationHeaderText: String,
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
    return {
      newMailText: ''
    }
  },
  computed: {
    showMakeConnectionButton () {
      return this.connectOrCancelAllowed === 'connectAllowed'
    },
    showCancelConnectionButton () {
      return this.connectOrCancelAllowed === 'cancelAllowed'
    }
  },
  methods: {
    sentByCurrentUser (mail) {
      return this.userId === mail.sender
    },
    avatarImage (mail) {
      return this.sentByCurrentUser(mail)
        ? this.myAvatar
        : this.otherAvatar
    },
    sendMail () {
      if (this.newMailText) {
        this.$emit('sendMail', this.newMailText)
      }
    }
  },
  watch: {
    mailItems (updatedMails) {
      if (updatedMails.length > 0) {
        const times = updatedMails.map(mail => mail.sent.getTime())
        const maxTime = new Date()
        const maxT = Math.max(...times)
        maxTime.setTime(maxT)
        // console.log('maxTime = ', maxTime)
        // console.log('times = ', times)
        this.$emit('readUpToTimestamp', maxTime)
      }
    }
  },
  components: {
    'mail-item': MailItem,
    'form-segment': FormSegment
  }
}
</script>

<style>
  .fullsizeTextArea {
    width:100%;
    box-sizing: border-box;
  }
</style>
