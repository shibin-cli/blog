export default function logger(store) {
    return next => {
        return action => {
            console.log(action)
            next(action)
        }
    }
}