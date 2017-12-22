<template>
  <div class="container">
    <div v-for="(config, i) in configs" :key="i">
      <mail-thread-container 
        :mail-items="config.mails"
        :connect-or-cancel-allowed="config.connectCancel"
        :username="username"
        :my-avatar="myAvatar"
        :other-avatar="otherAvatar"/>
      <hr>
      <hr>
      <hr>
    </div>
  </div>
  
</template>


<script>
import MailThreadContainer from './loggedIn/homePage/shared/MailThreadContainer.vue'

const MAIL_ITEMS = [
  {
    sender: 'test@test.com',
    text: 'Hello, I could help you',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 1),
    replayToMailId: -1,
    id: 0},
  {
    sender: 'otherperson@IneedHelp.com',
    text: 'That would be great, thanks - how far away do you live?',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 2),
    replayToMailId: 0,
    id: 1},
  {
    sender: 'test@test.com',
    text: 'Bolton. Should we exchange contact details?',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 3),
    replayToMailId: 1,
    id: 2}
]

const ALL_CONFIGS = [
  {connectCancel: 'disabled', mails: []},
  {connectCancel: 'connectAllowed', mails: []},
  {connectCancel: 'cancelAllowed', mails: []},
  {connectCancel: 'disabled', mails: MAIL_ITEMS},
  {connectCancel: 'connectAllowed', mails: MAIL_ITEMS},
  {connectCancel: 'cancelAllowed', mails: MAIL_ITEMS},
  {connectCancel: 'disabled', mails: MAIL_ITEMS.slice(0, 2)},
  {connectCancel: 'connectAllowed', mails: MAIL_ITEMS.slice(0, 2)},
  {connectCancel: 'cancelAllowed', mails: MAIL_ITEMS.slice(0, 2)},
]

export default {
  data () {
    return {
      configs: ALL_CONFIGS,
      myAvatar: {altText: 'YOU'},
      otherAvatar: {altText: 'them'},
      username: 'test@test.com'}
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>

