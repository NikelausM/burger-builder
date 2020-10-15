import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'
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
    error: error
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
  const serializedError = SerializeError.serializeError(error)
  dispatch(purchaseBurgerFail(serializedError))
}

export const purchaseBurger = (orderData) => {
  return dispatch => {
    try {
      dispatch(purchaseBurgerStart())
      axios.post('/orders.json', orderData)
        .then(response => {
          console.log(`purchaseBurger orders.json response: `, response.data)
          dispatch(purchaseBurgerSuccess(response.data, orderData))
        })
        .catch(error => {
          purchaseBurgerErrorHandler(error, orderData, dispatch)
        })
    } catch (error) {
      purchaseBurgerErrorHandler(error, orderData, dispatch)
    }
  }
}