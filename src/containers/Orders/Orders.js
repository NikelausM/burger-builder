import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import Order from 'components/Order/Order'
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler'
import { axiosOrders } from '../../axios-burger-builder/axios-firebase-rtdb'
import * as actions from 'store/actions/index'
import Spinner from 'components/UI/Spinner/Spinner'

const Orders = props => {

  const { onFetchOrders, token, userId } = props

  useEffect(() => {
    onFetchOrders(token, userId)
  }, [onFetchOrders, token, userId])

  let orders = <Spinner />
  if (!props.loading) {
    orders = props.orders
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(order => (
        <Order
          key={order.id}
          id={order.id}
          ingredients={order.ingredients}
          price={+order.price}
          date={order.date} />
      ))
  }
  return (
    <div>
      {orders}
    </div >
  )
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(withErrorHandler(
    Orders,
    axiosOrders))