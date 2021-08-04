// export const increment = payload => ({
//     type: 'increment',
//     payload
// })

// export const decrement = payload => ({
//     type: 'decrement',
//     payload
// })

// export const deplay_increment = payload => dispatch => {
//     setTimeout(() => {
//         dispatch(increment(payload))
//     }, 2000)
// }
import {
    createAction
} from 'redux-actions'

export const decrement = createAction('decrement')
export const increment = createAction('increment')
export const showModal = createAction('show')
export const delayShowModal =  createAction('delayShowModal')
// export const deplay_increment = payload => dispatch => {
//     setTimeout(() => {
//         dispatch(increment(payload))
//     }, 2000)
// }
export const deplay_increment = createAction('delay_increment')