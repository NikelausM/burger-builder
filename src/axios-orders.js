import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://burger-builder-nikelausm.firebaseio.com/'
})

export default instance