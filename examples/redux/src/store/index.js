import {
    createStore
} from 'redux'

import reducer from './reducers'
import {
    applyMiddleware
} from 'redux'
import logger from './middlewares/loggger'
// import thunk from './middlewares/thunk'
// import thunk from 'redux-thunk'

import createSagaMiddleWare from 'redux-saga'
// import CounterSaga from './sagas/couter'
import allSaga from './sagas'

const sageMiddleWare = createSagaMiddleWare()
const store = createStore(reducer, applyMiddleware(logger, sageMiddleWare))
sageMiddleWare.run(allSaga)

export default store