import { takeEvery } from 'redux-saga/effects'

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
  yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga)
  yield takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga)
  yield takeEvery(actionTypes.AUTH, authSaga)
  yield takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga)
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga)
}

export function* watchOrder() {
  yield takeEvery(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga)
  yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga)
}