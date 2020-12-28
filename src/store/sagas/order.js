import { put } from 'redux-saga/effects'

import * as actions from 'store/actions/index'
import { axiosOrders } from 'axios-burger-builder/axios-firebase-rtdb'

function* orderCreate(orderData, token) {
  try {
    const params = new URLSearchParams({ auth: token })
    const PARAMS_STR = '?' + params.toString()
    // eslint-disable-next-line
    const response = yield axiosOrders.post(PARAMS_STR, orderData)
    return response
  } catch (error) {
    throw error
  }
}

export function* purchaseBurgerSaga(action) {
  try {
    yield put(actions.purchaseBurgerStart())
    const response = yield orderCreate(action.orderData, action.token)
    yield put(actions.purchaseBurgerSuccess(response.data.name, action.orderData))
  } catch (error) {
    yield put(actions.purchaseBurgerFail(error))
  }
}

const orderIndex = async (token, userId) => {
  try {
    const params = { auth: token, orderBy: `"userId"`, equalTo: `"${userId}"` }
    const params_arr = Object.keys(params).map(key => `${key}=${params[key]}`)
    const PARAMS_STR = `?${params_arr.join('&')}`
    const response = await axiosOrders.get(PARAMS_STR)
    const fetchedOrders = []
    for (let key in response.data) {
      fetchedOrders.push({
        ...response.data[key],
        id: key
      })
    }
    return fetchedOrders
  }
  catch (error) {
    throw error
  }
}

export function* fetchOrdersSaga(action) {
  try {
    yield put(actions.fetchOrdersStart())
    const fetchedOrders = yield orderIndex(action.token, action.userId)
    yield put(actions.fetchOrdersSuccess(fetchedOrders))
  } catch (error) {
    yield put(actions.fetchOrdersFail(error))
  }
}