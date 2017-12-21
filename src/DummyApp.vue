<template>
  <div class="container">
    <mail-thread-container 
      :mail-items="mailItems"
      :username="username"
      :my-avatar="myAvatar"
      :other-avatar="otherAvatar"/>
  </div>
  
</template>


<script>
import MailThreadContainer from './loggedIn/homePage/shared/MailThreadContainer.vue'

const MAIL_ITEMS = [
  {
    sender: 'test@test.com',
    text: 'Hello, I could help you',
    relatedToPostId: 1,
    sent: new Date(),
    replayToMailId: -1,
    id: 0},
  {
    sender: 'otherperson@IneedHelp.com',
    text: 'That would be great, thanks - how far away do you live?',
    relatedToPostId: 1,
    sent: new Date(),
    replayToMailId: 0,
    id: 1},
  {
    sender: 'test@test.com',
    text: 'Bolton. Should we exchange contact details?',
    relatedToPostId: 1,
    sent: new Date(),
    replayToMailId: 1,
    id: 2}
]

export default {
  data () {
    return {
      mailItems: MAIL_ITEMS,
      myAvatar: {altText: 'YOU'},
      otherAvatar: {altText: 'them'},
      username: 'test@test.com'}
  },
  components: {
    'mail-thread-container': MailThreadContainer
  }
}
</script>

