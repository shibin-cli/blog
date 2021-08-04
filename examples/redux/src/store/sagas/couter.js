import {
    takeEvery,
    put,
    delay
} from 'redux-saga/effects'
import {
    deplay_increment,
    increment
} from '../actions'
// takeEvery  接收action
// put 触发action

function* handleDelayIncrement(action) {
    yield delay(2000)
    yield put(increment(action.payload))
}

export default function* counterSaga() {
    yield takeEvery(deplay_increment, handleDelayIncrement)
}