
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import objectsReducer from './objects' 

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  objects: objectsReducer
})

export default createRootReducer