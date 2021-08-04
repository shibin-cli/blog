import {
    handleActions as createReducer
} from 'redux-actions'
import {
    showModal
} from '../actions'
const initState = {
    show: false
}

const showReducer = createReducer({
    [showModal]: (state, action) => ({
        show: action.payload
    })
}, initState)

export default showReducer