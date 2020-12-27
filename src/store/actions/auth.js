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
  const ITEMS_TO_REMOVE = ['token', 'expirationDate', 'userId']
  ITEMS_TO_REMOVE.forEach(item => localStorage.removeItem(item))
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
    const RESPONSE = await axiosAuth.post('', authData)
    // access local storage
    const expirationDate = new Date(new Date().getTime() + RESPONSE.data.expiresIn * 1000)
    const ITEMS_TO_SET = {
      token: RESPONSE.data.idToken,
      expirationDate: expirationDate,
      userId: RESPONSE.data.localId
    }
    Object.keys(ITEMS_TO_SET).forEach(key => localStorage.setItem(key, ITEMS_TO_SET[key]))

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

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch(logout())
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'))
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem('userId')
        dispatch(authSuccess(token, userId))
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
      } else {
        dispatch(logout())
      }
    }
  }
}