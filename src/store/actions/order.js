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
          dispatch(purchaseBurgerSuccess(response.data.name, orderData))
        })
        .catch(error => {
          purchaseBurgerErrorHandler(error, orderData, dispatch)
        })
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
    error: error
  }
}

export const fetchOrdersStart = () => {
  return {
    type: actionTypes.FETCH_ORDERS_START
  }
}

export const fetchOrders = () => {
  return dispatch => {
    dispatch(fetchOrdersStart())
    axios.get('/orders.json')
      .then(res => {
        // do data format changes in action creators
        const fetchedOrders = []
        for (let key in res.data) {
          fetchedOrders.push({
            ...res.data[key],
            id: key
          })
        }
        dispatch(fetchOrdersSuccess(fetchedOrders))
      })
      .catch(error => {
        console.error(error)
        const serializedError = SerializeError.serializeError(error)
        dispatch(fetchOrdersFail(serializedError))
      })
  }
}