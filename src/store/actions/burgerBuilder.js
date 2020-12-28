import * as actionTypes from './actionTypes';

const SerializeError = require('serialize-error')

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

export const fetchIngredientsFailed = (error) => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED,
    error: SerializeError.serializeError(error)
  }
}

export const initIngredients = () => {
  return {
    type: actionTypes.INIT_INGREDIENTS
  }
}