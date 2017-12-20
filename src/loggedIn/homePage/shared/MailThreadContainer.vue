<template>
  <div>
    <mail-item 
      v-for="mail in mailItems" 
      :key="mail.id" 
      :mail="mail"
      :avatar="avatarImage(mail)"/>
  </div>
</template>

<script>
import MailItem from './MailItem.vue'
export default {
  props: {
    mailItems: Array,
    username: String,
    myAvatar: Object,
    otherAvatar: Object
  },
  methods: {
    avatarImage (mail) {
      return this.username === mail.sender
        ? this.myAvatar
        : this.otherAvatar
    }
  },
  components: {
    'mail-item': MailItem
  }
}
</script>

