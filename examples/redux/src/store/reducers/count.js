import {
    handleActions as createReducer
} from 'redux-actions'
import {
    decrement,
    increment
} from '../actions'

const initState = {
    count: 0
}

// export default function countReducer(state = initState, action) {
//     switch (action.type) {
//         case 'decrement':
//             return {
//                 ...state,
//                 count: state.count - (action.payload ? action.payload : 1)
//             };
//         case 'increment':
//             return {
//                 ...state,
//                 count: state.count + (action.payload ? action.payload : 1)
//             };
//         default:
//             return state
//     }
// }
const countReducer = createReducer({
    [increment]: (state, action) => {
        return {
            count: state.count + (action.payload ? action.payload : 1)
        }
    },
    [decrement]: (state, action) => {
        console.log(state)
        return {
            count: state.count - (action.payload ? action.payload : 1)
        }
    }
}, initState)
export default countReducer