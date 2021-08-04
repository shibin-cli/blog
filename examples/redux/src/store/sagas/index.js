import {
    all
} from 'redux-saga/effects'
import counterSaga from './couter'
import modalSaga from './modal'
export default function* allSaga() {
    yield all([
        counterSaga(),
        modalSaga()
    ])
}