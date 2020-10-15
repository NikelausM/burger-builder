import * as actionTypes from '../actions/actionTypes'

const initialState = {
  orders: [],
  loading: false
}

const reducer = (state = initialState, action) => {
  try {
    console.log(action.type)
    switch (action.type) {
      case actionTypes.PURCHASE_BURGER_START:
        return {
          ...state,
          loading: true
        }
      case actionTypes.PURCHASE_BURGER_SUCCESS:
        const newOrder = {
          ...action.orderData,
          id: action.orderId
        }
        return {
          ...state,
          loading: false,
          order: state.orders.concat(newOrder)
        }
      case actionTypes.PURCHASE_BURGER_FAIL:
        return {
          ...state,
          loading: false
        }
      default:
        return state
    }
  } catch (error) {
    throw error
  }
}
export default reducer