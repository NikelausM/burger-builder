import SerializeError from 'serialize-error'

import { axiosSignup, axiosSignin } from 'axios-burger-builder/axios-firebase-rtdb'
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

const authReq = async (dispatch, email, password, isSignup) => {
  try {
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    const axiosAuth = isSignup ? axiosSignup : axiosSignin
    console.log('authData: ', authData)
    const RESPONSE = await axiosAuth.post('', authData)
    console.log('store/auth response: ', RESPONSE)
    dispatch(authSuccess(RESPONSE.data.idToken, RESPONSE.data.localId))
    dispatch(checkAuthTimeout(RESPONSE.data.expiresIn))
  } catch (error) {
    throw error
  }
}

export const auth = (email, password, isSignup) => {
  return async dispatch => {
    try {
      dispatch(authStart())
      await authReq(dispatch, email, password, isSignup)
    } catch (error) {
      console.log('action/auth error: ', error)
      dispatch(authFail(error))
    }
  }
}

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}