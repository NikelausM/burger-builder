import { put, delay, call } from 'redux-saga/effects'

import * as actions from 'store/actions/index'
import { axiosSignup, axiosSignin } from 'axios-burger-builder/axios-firebase-rtdb'

/**
 * Executes side effects on dispatch of this saga's action.
 * Side effects include: 
 * * Removing local storage authentication variables.
 * @param {*} action 
 */
export function* logoutSaga(action) {
  const itemsToRemove = ['token', 'expirationDate', 'userId']
  // itemsToRemove.forEach(item => localStorage.removeItem(item))
  // use call to make code more testable (able to create mocks)
  itemsToRemove.forEach(item => call([localStorage, 'removeItem'], item))
  yield put(actions.logoutSuccess())
}

/**
 * Executes side effects on dispatch of this saga's action.
 * Side effects include: 
 * * Waiting for expirationTime in ms before executing action.
 * @param {*} action 
 */
export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000)
  yield put(actions.logout())
}

function* authReq(action) {
  try {
    const authData = {
      email: action.email,
      password: action.password,
      returnSecureToken: true
    }
    const axiosAuth = action.isSignup ? axiosSignup : axiosSignin
    const response = yield axiosAuth.post('', authData)
    // access local storage
    const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
    const itemsToSet = {
      token: response.data.idToken,
      expirationDate: expirationDate,
      userId: response.data.localId
    }
    // Object.keys(itemsToSet).forEach(key => localStorage.setItem(key, itemsToSet[key]))
    // use call to make code more testable (able to create mocks)
    Object.keys(itemsToSet).forEach(key => call([localStorage, 'setItem'], key, itemsToSet[key]))

    return response

  } catch (error) {
    throw error
  }
}

/**
 * Executes side effects on dispatch of this saga's action.
 * Side effects include: 
 * * Sending authentication request to back-end.
 * @param {*} action 
 */
export function* authSaga(action) {
  try {
    yield put(actions.authStart())
    const response = yield authReq(action)
    yield put(actions.authSuccess(response.data.idToken, response.data.localId))
    yield put(actions.checkAuthTimeout(response.data.expiresIn))
  } catch (error) {
    yield put(action.authFail(error))
  }
}

/**
 * Executes side effects on dispatch of this saga's action.
 * Side effects include: 
 * * Checking authentication state.
 * @param {*} action 
 */
export function* authCheckStateSaga(action) {
  const token = localStorage.getItem('token')
  if (!token) {
    yield put(actions.logout())
  } else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'))
    if (expirationDate > new Date()) {
      const userId = localStorage.getItem('userId')
      yield put(actions.authSuccess(token, userId))
      const timeUntilExpirationDate = (expirationDate.getTime() - new Date().getTime()) / 1000
      yield put(actions.checkAuthTimeout(timeUntilExpirationDate))
    } else {
      yield put(actions.logout())
    }
  }
}