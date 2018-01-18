import {HELP_WANTED, HELP_OFFERED} from './postTypes'

const SEEK_HELP_DESCRIPTION_OUTLINE = `Give details about what you need, things to think about:
- Tell us a bit about the background of why you need help
- Give plenty of detail about the activity
- Dig down into details of any specialist skills / experience needed
- Tell us what kind of person you would like to help out
- Be nice!`

const SEEKING_HELP_TEXT = {
  formTitle: 'What would you like help with?',
  title: {
    alert: 'Give your post a title that will help people understand the outline of what you need',
    label: 'Title'
  },
  description: {
    alert: 'Be descriptive about the details of what you need',
    label: 'Give some more details',
    placeholder: SEEK_HELP_DESCRIPTION_OUTLINE
  },
  locations: {
    alert: `Please let your helpers know the locations you need help at - either add specific locations, or select remote, or both`,
    label: 'Where do you need help?'
  },
  skillsAndInterests: {
    alert: 'Please add some interests or skills - these allow helpers to be matched with you',
    skillCategoryLabel: 'Broad category of skills that your helpers need:',
    skillDetailLabel: 'Skills that your helpers will need:',
    interestsLabel: 'People might want to help if they are interested in:'
  },
  timeAmount: {
    alert: `Please fill this out - it's important for your helpers to be able to match with you and plan their time`,
    label: 'How much time is required?'
  },
  timeslots: {
    alert: 'Please fill this out - helpers need to know what slots you need them',
    label: 'What times of day can people help?'
  }
}

const OFFER_HELP_DESCRIPTION_OUTLINE = `Give the details about what you are offering to help with, things to think about:
- Tell us a bit about your background
- Give plenty of detail about how envisage being able to help
- Dig down into details of any specialist skills / experience you can offer
- Tell us what kind of person you would like to help`

const OFFERING_HELP_TEXT = {
  formTitle: 'How can you help others?',
  title: {
    alert: 'Give your post a title that will help them understand the outline of what you are offering',
    label: 'Title'
  },
  description: {
    alert: 'Be descriptive about the details of what you can offer',
    label: 'Give some more details',
    placeholder: OFFER_HELP_DESCRIPTION_OUTLINE
  },
  locations: {
    alert: `Please let people know the locations where you can offer this help - either add specific locations, or select remote, or both`,
    label: 'Where are you able to help?'
  },
  skillsAndInterests: {
    alert: 'Please add interests or skills you are offering help with - these allow seekers to be matched with you',
    skillCategoryLabel: 'Broad category of skills you can help with:',
    skillDetailLabel: 'Skills that you are offering to help with:',
    interestsLabel: 'Interests that you have that you are offering help with:'
  },
  timeAmount: {
    alert: `Please fill this out - it's important for those seeking help to be able to match with you and plan their time`,
    label: 'How much time can you offer?'
  },
  timeslots: {
    alert: 'Please fill this out - people need to know what times of day you can help them',
    label: 'What times of day can you give this help?'
  }
}

export function getDescriptionsForPostType (postType) {
  if (postType === HELP_WANTED) {
    return SEEKING_HELP_TEXT
  }
  if (postType === HELP_OFFERED) {
    return OFFERING_HELP_TEXT
  }
  throw new Error(`Don't know how to generate text for post type ${postType}`)
}
