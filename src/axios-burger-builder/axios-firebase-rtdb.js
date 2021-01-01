import axios from 'axios'

const DB_URLS = {
  BASE: 'https://burger-builder-nikelausm.firebaseio.com/',
  BASE_AUTH: 'https://identitytoolkit.googleapis.com/v1/accounts:',
  INGREDIENTS: 'ingredients.json',
  ORDERS: 'orders.json',
}

const API_KEY = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_GOOGLE_FIREBASE_API_KEY_PRODUCTION
  : process.env.REACT_APP_GOOGLE_FIREBASE_API_KEY_DEVELOPMENT

const AUTH = {
  SIGN_UP_URL: `${DB_URLS.BASE_AUTH}signUp?key=${API_KEY}`,
  SIGN_IN_URL: `${DB_URLS.BASE_AUTH}signInWithPassword?key=${API_KEY}`
}

export const axiosBase = axios.create({ baseURL: DB_URLS.BASE })
export const axiosIngredients = axios.create({ baseURL: `${DB_URLS.BASE}${DB_URLS.INGREDIENTS}` })
export const axiosOrders = axios.create({ baseURL: `${DB_URLS.BASE}${DB_URLS.ORDERS}` })
export const axiosSignup = axios.create({ baseURL: `${AUTH.SIGN_UP_URL}` })
export const axiosSignin = axios.create({ baseURL: `${AUTH.SIGN_IN_URL}` })