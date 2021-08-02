import {
    createStore
} from 'redux'

const initState = {
    count: 0
}

function reducer(state = initState, action) {
    switch(action.type){
        case 'decrement':
            return {
                count: state.count - 1
            };
        case 'increment':
            return {
                count: state.count + 1
            };
         default:
            return state
    }
}

const store = createStore(reducer)

export default store