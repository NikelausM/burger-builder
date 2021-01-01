import { put, delay, all, call } from 'redux-saga/effects'

import * as actions from 'store/actions/index'
import { axiosSignup, axiosSignin } from 'axios-burger-builder/axios-firebase-rtdb'

// Not using redux-saga/effects call function DOES work
export function* logoutSagaNotUsingCall(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  for (const item of itemsToRemove) {
    localStorageUsed.removeItem(item)
  }

  yield put(actions.logoutSuccess())
}

export function* logoutSagaNotUsingCallUsingForEach(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  itemsToRemove.forEach(item => localStorageUsed.removeItem(item))

  yield put(actions.logoutSuccess())
}

export function* logoutSagaNotUsingCallUsingMap(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  itemsToRemove.map(item => localStorageUsed.removeItem(item))

  yield put(actions.logoutSuccess())
}

// Using redux-saga/effects call function DOESN'T work
export function* logoutSagaUsingCall(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  for (const item of itemsToRemove) {
    yield call([localStorageUsed, 'removeItem'], item)
  }

  yield put(actions.logoutSuccess())
}

export function* logoutSagaUsingCallUsingForEach(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  itemsToRemove.forEach(function* (item, localStorageUsed) {
    yield call([localStorageUsed, 'removeItem'], item)
  })

  yield put(actions.logoutSuccess())
}

export function* logoutSagaUsingCallUsingMap(action, localStorageUsed = localStorage, itemsToRemove = ['token', 'expirationDate', 'userId']) {

  yield all(itemsToRemove.map(item => call([localStorageUsed, 'removeItem'], item)))

  yield put(actions.logoutSuccess())
}

export const logoutSaga = logoutSagaNotUsingCallUsingMap

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

    yield all(Object.keys(itemsToSet)
      .map(key => localStorage.setItem(key, itemsToSet[key]))
    )

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
    yield put(actions.authFail(error))
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