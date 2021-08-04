import {
    takeEvery,
    put,
    delay
} from 'redux-saga/effects'
import {
    delayShowModal, showModal
} from '../actions'
// takeEvery  接收action
// put 触发action

function* handleDelayIncrement(action) {
    yield delay(2000)
    yield put(showModal(action.payload))
}

export default function* modalSaga() {
    yield takeEvery(delayShowModal, handleDelayIncrement)
}