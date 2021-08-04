import {
    combineReducers
} from 'redux'
import countReducer from './count'
import showReducer from './show'
export default combineReducers({
    counter: countReducer,
    modal: showReducer
})
