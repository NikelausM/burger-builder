import { put } from 'redux-saga/effects'

import * as actions from 'store/actions/index'
import { axiosIngredients } from 'axios-burger-builder/axios-firebase-rtdb'

export function* initIngredientsSaga(action) {
  try {
    const response = yield axiosIngredients.get()
    yield put(actions.setIngredients(response.data))
  } catch (error) {
    yield put(actions.fetchIngredientsFailed(error))
  }
}