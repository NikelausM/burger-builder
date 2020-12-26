import * as actionTypes from './actionTypes'
import { axiosOrders } from 'axios-burger-builder/axios-firebase-rtdb'

const SerializeError = require('serialize-error')

export const purchaseBurgerSuccess = (id, orderData) => {
  console.log("purchase burger success")
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
  console.error(error)
  console.log(orderData)
  dispatch(purchaseBurgerFail(error))
}

const orderCreate = async (dispatch, orderData, token) => {
  try {
    const PARAMS = new URLSearchParams({ auth: token })
    const PARAMS_STR = '?' + PARAMS.toString()
    console.log("orderCreate: ", orderData, PARAMS_STR)
    const RESPONSE = await axiosOrders.post(PARAMS_STR, orderData)
    console.log(`purchaseBurger orders.json response: `, RESPONSE.data)
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

const orderIndex = async token => {
  try {
    const PARAMS = new URLSearchParams({ auth: token })
    const PARAMS_STR = '?' + PARAMS.toString()
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

export const fetchOrders = token => {
  return async dispatch => {
    try {
      dispatch(fetchOrdersStart())
      const FETCHED_ORDERS = await orderIndex(token)
      dispatch(fetchOrdersSuccess(FETCHED_ORDERS))
    } catch (error) {
      console.error(error)
      dispatch(fetchOrdersFail(error))
      throw error
    }
  }
}