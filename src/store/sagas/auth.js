import { put } from 'redux-saga/effects'

import * as actionTypes from 'store/actions/actionTypes'

// generator function
export function* logoutSaga(action) {
  const itemsToRemove = ['token', 'expirationDate', 'userId']
  yield itemsToRemove.forEach(item => localStorage.removeItem(item))
  yield put({
    type: actionTypes.AUTH_LOGOUT
  })
}