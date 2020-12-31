import React, { useState } from 'react'
import { connect } from 'react-redux'

import Button from 'components/UI/Button/Button'
import Spinner from 'components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import Input from 'components/UI/Input/Input'
import * as actions from 'store/actions/index'
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler'
import { axiosBase } from 'axios-burger-builder/axios-firebase-rtdb'
import { updateObject, checkValidity } from 'shared/utility'

const ContactData = props => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter your name"
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter your street"
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'ZIP/Postal Code'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6,
        maxLength: 6
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid ZIP/Postal Code"
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter your country"
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-mail (e.g., john@gmail.com)'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter a valid email"
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' },
        ]
      },
      value: 'fastest',
      validation: {},
      valid: true
    },
  })
  const [formIsValid, setFormIsValid] = useState(false)

  const orderHandler = (event) => {
    event.preventDefault()
    const formData = {}
    for (let formElementIdentifier in orderForm) {
      formData[formElementIdentifier] = orderForm[formElementIdentifier].value
    }
    const order = {
      ingredients: props.ingredients,
      price: props.totalPrice,
      orderData: formData,
      userId: props.userId,
      date: new Date()
    }

    props.onOrderBurger(order, props.token)
  }

  const inputChangedHandler = (event, inputIdentifier) => {
    const updatedFormElement = updateObject(orderForm[inputIdentifier], {
      value: event.target.value,
      valid: checkValidity(event.target.value, orderForm[inputIdentifier].validation),
      touched: true
    })
    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormElement
    })

    let formIsValid = true
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }

    setOrderForm(updatedOrderForm)
    setFormIsValid(formIsValid)

  }

  const formElementsArray = []
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key]
    })
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map(formElement => (
        <Input
          key={formElement.id}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
          errorMessage={formElement.config.errorMessage}
          changed={(event) => inputChangedHandler(event, formElement.id)} />
      ))}
      <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
    </form>
  )
  if (props.loading) {
    form = <Spinner />
  }
  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  )
}

// redux state to props
const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    totalPrice: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  }
}

// redux dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(withErrorHandler(
    ContactData,
    axiosBase))
