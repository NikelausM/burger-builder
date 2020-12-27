import * as actionTypes from './actionTypes';
import { axiosIngredients } from 'axios-burger-builder/axios-firebase-rtdb'

export const addIngredient = (name) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  }
}

export const removeIngredient = (name) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  }
}

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  }
}

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  }
}

export const initIngredients = () => {
  return async dispatch => {
    try {
      const RESPONSE = await axiosIngredients.get()
      dispatch(setIngredients(RESPONSE.data))
    } catch (error) {
      dispatch(fetchIngredientsFailed())
    }
  }
}