export default function thunk(store) {
    return next => {
        return action => {
            if (typeof action === 'function') {
                return action(store.dispatch)
            }
            next(action)
        }
    }
}