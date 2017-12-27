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
    }
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
    }
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
    }
  }
]
