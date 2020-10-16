import axios from 'axios'
import SerializeError from 'serialize-error'

import * as actionTypes from './actionTypes'

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (token, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: SerializeError.serializeError(error)
  }
}

export const logout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, expirationTime * 1000)
  }
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart())
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    const SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`
    const SIGN_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=`
    const API_KEY = 'AIzaSyBnexkQdigg9xWXvXYHZQ-omjq_I_GR0aA'
    const URL = isSignup ? `${SIGN_UP_URL}${API_KEY}` : `${SIGN_IN_URL}${API_KEY}`
    axios.post(URL, authData)
      .then(response => {
        console.log(response)
        dispatch(authSuccess(response.data.idToken, response.data.localId))
        dispatch(checkAuthTimeout(response.data.expiresIn))
      })
      .catch(error => {
        console.error(error)
        dispatch(authFail(error.response.data.error))
      })
  }
}