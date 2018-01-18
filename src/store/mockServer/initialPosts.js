import { HELP_WANTED, HELP_OFFERED } from './postTypes'

export const INITIAL_POSTS = [
  {
    postedBy: 0,
    title: 'Help around Garden',
    interests: ['House'],
    skills: ['Gardening'],
    locations: ['North-west London'],
    remote: false,
    description: 'I just need a few hours a week help around the garden whilst my hip operation heals',
    timings: {
      regularAmount: {
        unit: '2hr',
        frequency: 'Week'
      },
      slots: ['Weekend']
    },
    postType: HELP_WANTED
  },
  {
    postedBy: 1,
    title: 'Please help me get into Executive Coaching',
    interests: ['Work', 'Mentoring'],
    skills: ['Executive coaching'],
    locations: ['South London'],
    remote: true,
    description: `Looking to get into Executive Coaching - could somebody mentor me please?
I am a graduate in History and have been an archivist until now but am looking to change career.
A small amount of time once a week or once a month should be fine. We can do it over Skype or in person.`,
    timings: {
      regularAmount: {
        unit: '4hr',
        frequency: 'Month'
      },
      slots: ['Evening']
    },
    postType: HELP_WANTED
  },
  {
    postedBy: 2,
    title: 'Please could somebody local walk my dog',
    interests: ['Pets'],
    skills: [],
    locations: ['Central London'],
    remote: false,
    description: 'Aaagh, broken my leg! Dog walker required for a few weeks please. ',
    timings: {
      regularAmount: {
        unit: '2hr',
        frequency: 'Week'
      },
      slots: ['Daytime', 'Weekday']
    },
    postType: HELP_WANTED
  },
  {
    postedBy: 0,
    title: 'Cut my hedge',
    interests: ['House'],
    skills: ['Gardening'],
    locations: ['North-west London'],
    remote: false,
    description: 'My hedge really needs cutting and I\'ve just had a hip operation - should only take a days',
    timings: {
      regularAmount: {
        unit: '8hr',
        frequency: 'One-off'
      },
      slots: ['Weekend']
    },
    postType: HELP_WANTED
  },
  {
    postedBy: 3,
    title: 'Can somebody give me some executive coaching please',
    interests: [],
    skills: ['Coaching'],
    locations: ['South-west London'],
    remote: true,
    description: 'Hey looking to improve my leadership skills, could somebody coach me please',
    timings: {
      regularAmount: {
        unit: '1hr',
        frequency: 'Week'
      },
      slots: ['Weekend', 'Evening']
    },
    postType: HELP_WANTED
  },
  {
    postedBy: 5,
    title: 'Some other post',
    interests: [],
    skills: ['Coaching'],
    locations: ['North-west London'],
    remote: true,
    description: 'This is not very interesting',
    timings: {
      regularAmount: {
        unit: '1hr',
        frequency: 'Week'
      },
      slots: ['Weekend', 'Evening']
    },
    postType: HELP_OFFERED
  }
]
