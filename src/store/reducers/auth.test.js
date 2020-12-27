import reducer from './auth'

import * as actionTypes from 'store/actions/actionTypes'

describe('auth reducer', () => {
  let initialState

  beforeEach(() => {
    initialState = {
      token: null,
      userId: null,
      error: null,
      loading: false,
      authRedirectPath: '/'
    }
  })

  it('should return the initial state', () => {
    // undefined state when getting initialized at beginning of app running
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should store the token upon login', () => {

    const tempToken = 'some-token'
    const tempUserId = 'some-user-id'
    const action = {
      type: actionTypes.AUTH_SUCCESS,
      idToken: tempToken,
      userId: tempUserId
    }
    const newState = {
      ...initialState,
      token: tempToken,
      userId: tempUserId
    }
    expect(reducer(initialState, action)).toEqual(newState)
  })
})