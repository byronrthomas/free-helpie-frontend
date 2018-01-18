import { mount } from 'vue-test-utils'
import PostEditForm from '@/loggedIn/homePage/PostEditForm.vue'
import { HELP_WANTED } from '../../../src/loggedIn/homePage/postTypes';

const CHECKED_DATA_ITEMS = [
  {
    propName: 'skillsAndInterestsMissing',
    fixes: [{
      name: 'some interest is present',
      data: {
        interests: ['anInterest']}},
    {
      name: 'some skill is present',
      data: {
        skills: ['aSkill']}}]},
  {
    propName: 'locationsMissing',
    fixes: [{
      name: 'remote is true',
      data: {
        remote: true}},
    {
      name: 'some location is present',
      data: {
        locations: ['aLocation']}}]},
  {
    propName: 'regularTimeMissing',
    fixes: [{
      name: 'both amount and frequency are non-empty',
      data: {
        timings: {
          regularAmount: {
            unit: 'Something',
            frequency: 'per something'},
          slots: []}}}]},
  {
    propName: 'timeslotsMissing',
    fixes: [{
      name: 'some timeslots are selected',
      data: {
        timings: {
          slots: ['Weekdays'],
          regularAmount: {
            unit: '',
            frequency: ''}}}}]},
  {
    propName: 'titleMissing',
    fixes: [{
      name: 'title is non-empty',
      data: {
        title: 'Help me please'}}]},
  {
    propName: 'descriptionMissing',
    fixes: [{
      name: 'description is non-empty',
      data: {
        description: 'Help me please'}}]}]

const EMPTY_POST =
  {
    postedBy: 'John Doe',
    title: '',
    interests: [],
    skills: [],
    locations: [],
    remote: false,
    description: '',
    timings: {regularAmount: {unit: '', frequency: ''}, slots: []},
    postType: HELP_WANTED
  }

const VALID_POST =
  {
    postedBy: 'John Doe',
    title: 'Help',
    interests: ['Interest'],
    skills: ['Skill'],
    locations: ['Location'],
    remote: false,
    description: 'Help me',
    timings: {regularAmount: {unit: '1h', frequency: 'Week'}, slots: ['Evenings']},
    postType: HELP_WANTED
  }
function makeMountArg (post) {
  const props = {
    initialPostData: post,
    createOrUpdate: 'Create',
    possibleSkills: [],
    possibleInterests: [],
    possibleLocations: []
  }
  return {propsData: props}
}

const getComponent = post => mount(PostEditForm, makeMountArg(post)).vm

describe('post edit form', () => {
  for (const check of CHECKED_DATA_ITEMS) {
    describe(`should report ${check.propName} correctly`, () => {
      it('should be true when they are missing', () => {
        const onTest = getComponent(EMPTY_POST)
        expect(onTest[check.propName]).toBeTruthy()
      })

      for (const fix of check.fixes) {
        it(`should be false when ${fix.name}`, () => {
          const fixedPost = {...EMPTY_POST, ...fix.data}
          const onTest = getComponent(fixedPost)
          expect(onTest[check.propName]).toBeFalsy()
        })
      }
    })
  }

  it(`should report formContentsValid as false whenever any single check is true`, () => {
    let post = EMPTY_POST
    for (const check of CHECKED_DATA_ITEMS.slice(0, CHECKED_DATA_ITEMS.length - 1)) {
      console.log('Fixing check ' + check.propName)
      post = {...post, ...check.fixes[0].data}
      const onTest = getComponent(post)
      expect(onTest.formContentsValid).toBeFalsy()
    }
  })

  it(`should report formContentsValid as true when all single checks are false`, () => {
    const onTest = getComponent(VALID_POST)
    for (const check of CHECKED_DATA_ITEMS) {
      if (onTest[check.propName]) {
        throw new Error(`Precondition failed, property ${check.propName} is true, should all be false`)
      }
    }
    expect(onTest.formContentsValid).toBeTruthy()
  })

  it('has the expected HTML when all checks are triggered (i.e. all data is missing)', () => {
    const onTest = mount(PostEditForm, makeMountArg(EMPTY_POST))
    for (const check of CHECKED_DATA_ITEMS) {
      if (!onTest.vm[check.propName]) {
        throw new Error(`Precondition failed, property ${check.propName} is false, should all be true`)
      }
    }
    expect(onTest.element).toMatchSnapshot()
  })

  it('has the expected HTML when all checks are inactive (i.e. all data is present)', () => {
    const onTest = mount(PostEditForm, makeMountArg(VALID_POST))
    if (!onTest.vm.formContentsValid) {
      throw new Error(`Precondition failed formContentsValid is false should be true`)
    }
    expect(onTest.element).toMatchSnapshot()
  })

  it('emits a postEditSubmitted event when the submit button is clicked', () => {
    const onTest = mount(PostEditForm, makeMountArg(VALID_POST))
    onTest.find('#submitButton').trigger('click')
    expect(onTest.emitted().submitForm).toBeTruthy()
    expect(onTest.emitted().submitForm.length).toBe(1)
    expect(onTest.emitted().submitForm[0]).toEqual([VALID_POST])
  })
})
