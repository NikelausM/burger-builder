import React, {
  useState,
  useEffect
} from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import Input from 'components/UI/Input/Input'
import Button from 'components/UI/Button/Button'
import Spinner from 'components/UI/Spinner/Spinner'
import classes from './Auth.module.css'
import * as actions from 'store/actions/index'
import withErrorHandler from 'hoc/withErrorHandler/withErrorHandler'
import { axiosBase } from '../../axios-burger-builder/axios-firebase-rtdb'
import {
  updateObject,
  checkValidity
} from 'shared/utility'

const SerializeError = require('serialize-error')

const Auth = props => {
  const [authForm, setAuthForm] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'E-mail Address'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter your email"
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false,
      errorMessage: "Please enter your password"
    },
  })

  const [isSignup, setIsSignup] = useState(true)

  const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props

  useEffect(() => {
    // If auth page is loaded without building a burger, then reset redirect path to home page.
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath()
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath])

  const inputChangedHandler = (event, controlName) => {
    const updatedControls = updateObject(authForm, {
      [controlName]: updateObject(authForm[controlName], {
        value: event.target.value,
        valid: checkValidity(event.target.value, authForm[controlName].validation),
        touched: true
      })
    })
    setAuthForm(updatedControls)
  }

  const submitHandler = (event) => {
    event.preventDefault()
    props.onAuth(authForm.email.value, authForm.password.value, isSignup)
  }

  const switchAuthModeHandler = () => setIsSignup(!isSignup)

  const formElementsArray = []
  for (let key in authForm) {
    formElementsArray.push({
      id: key,
      config: authForm[key]
    })
  }

  let form = formElementsArray.map(formElement => (
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
  ))

  if (props.loading) {
    form = <Spinner />
  }

  let errorMessage = null
  if (props.error) {
    try {
      let errorSerialized = SerializeError.serializeError(props.error)
      // console.log("errorSerialized: ", errorSerialized)
      if (errorSerialized.response.data.error) {
        errorMessage = errorSerialized.response.data.error.message ?
          errorSerialized.response.data.error.message :
          errorSerialized.response.data.error;
      }
    }
    catch (error) {
      errorMessage = "Internal server error."
    }

  }
  // const errorMessage = props.error ? (
  //   <p>{props.error.message}</p>
  // ) : null

  const authRedirect = props.isAuthenticated
    ? (<Redirect to={props.authRedirectPath} />)
    : null

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button
        clicked={switchAuthModeHandler}
        btnType='Danger'>SWITCH TO {isSignup ? 'SIGN IN' : 'SIGN UP'}</Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Auth);
export default connect(
  mapStateToProps,
  mapDispatchToProps)(withErrorHandler(
    Auth,
    axiosBase))