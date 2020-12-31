import { takeEvery, all, takeLatest } from 'redux-saga/effects'

import * as actionTypes from 'store/actions/actionTypes'
import {
  logoutSaga,
  checkAuthTimeoutSaga,
  authSaga,
  authCheckStateSaga
} from './auth'
import {
  initIngredientsSaga,
} from './burgerBuilder'
import {
  purchaseBurgerSaga,
  fetchOrdersSaga
} from './order'

/**
 * Whenever this generator is executed, 
 * it will set up listener for the actionType, 
 * and then execute provided saga generator function whenever actionType dispatched.
 */
export function* watchAuth() {
  // yield all asynchronously
  yield all([
    takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionTypes.AUTH, authSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga)
  ])
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga)
}

export function* watchOrder() {
  // only take latest action
  yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga)
  yield takeLatest(actionTypes.FETCH_ORDERS, fetchOrdersSaga)
}