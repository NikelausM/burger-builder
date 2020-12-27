import * as actionTypes from './actionTypes'
import { axiosOrders } from 'axios-burger-builder/axios-firebase-rtdb'

const SerializeError = require('serialize-error')

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_SUCCESS,
    orderId: id,
    orderData: orderData
  }
}

export const purchaseBurgerFail = (error) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: SerializeError.serializeError(error)
  }
}

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  }
}

const purchaseBurgerErrorHandler = (error, orderData, dispatch) => {
  dispatch(purchaseBurgerFail(error))
}

const orderCreate = async (dispatch, orderData, token) => {
  try {
    const PARAMS = new URLSearchParams({ auth: token })
    const PARAMS_STR = '?' + PARAMS.toString()
    // eslint-disable-next-line
    const RESPONSE = await axiosOrders.post(PARAMS_STR, orderData)
    await dispatch(purchaseBurgerSuccess())
  } catch (error) {
    throw error
  }
}

export const purchaseBurger = (orderData, token) => {
  return async dispatch => {
    try {
      await dispatch(purchaseBurgerStart())
      await orderCreate(dispatch, orderData, token)
    } catch (error) {
      purchaseBurgerErrorHandler(error, orderData, dispatch)
    }
  }
}

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT
  }
}

export const fetchOrdersSuccess = (orders) => {
  return {
    type: actionTypes.FETCH_ORDERS_SUCCESS,
    orders: orders
  }
}

export const fetchOrdersFail = error => {
  return {
    type: actionTypes.FETCH_ORDERS_FAIL,
    error: SerializeError.serializeError(error)
  }
}

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  }
}

const orderIndex = async (token, userId) => {
  try {
    const PARAMS = { auth: token, orderBy: `"userId"`, equalTo: `"${userId}"` }
    const PARAMS_ARR = Object.keys(PARAMS).map(key => `${key}=${PARAMS[key]}`)
    const PARAMS_STR = `?${PARAMS_ARR.join('&')}`
    const RESPONSE = await axiosOrders.get(PARAMS_STR)
    const fetchedOrders = []
    for (let key in RESPONSE.data) {
      fetchedOrders.push({
        ...RESPONSE.data[key],
        id: key
      })
    }
    return fetchedOrders
  }
  catch (error) {
    throw error
  }
}

export const fetchOrders = (token, userId) => {
  return async dispatch => {
    try {
      dispatch(fetchOrdersStart())
      const FETCHED_ORDERS = await orderIndex(token, userId)
      dispatch(fetchOrdersSuccess(FETCHED_ORDERS))
    } catch (error) {
      dispatch(fetchOrdersFail(error))
    }
  }
}