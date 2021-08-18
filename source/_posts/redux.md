---
title: Redux的使用
categories: 
- 前端
tags: 
- React 
date: 2021-08-01
---
## redux的基本使用

``` js
// 创建store容器
const store = Redux.createStore(reducer)
// 创建用于处理状态的reducer函数，dispatch时也会执行
function reducer(state) {
    ...
}
// 订阅状态,当状态修改是会触发回调
store.subscribe(() => {
    ...
})
// 触发action
store.dispatch({type: 'xxx'})
```
安装react-redux
``` bash
yarn add redux react-redux
```
当触发action时，会调用reducer处理函数，reducer函数中处理完毕后，就会触发订阅回调

为什么要使用Redux
* 在React中组件通信的数据流是单向的，父组件可以通过props向子组件传递数据，子组件不能向父组件传递数据，修改父组件数据只能将修改的方法传递给子组件
* 使用Redux管理数据，Store独立与组件，解决了组件与组件间传递数据困难的问题

在项目中使用reudx
`react-redux`提供了`Provider`组件，通过Provider组件store传递给内部组件，是内部组件可以访问store中的内容

``` js
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'

import App from './App.jsx';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```
``` js
import {connect} from 'react-redux'

function App(props) {
  return (
    <div className="App">
      count:{props.count}
    </div>
  );
}
const mapStateToProps = state=>({
  count: state.count
})
export default connect(mapStateToProps)(App);

```
connect中的第二个参数是可以让我们获取到dispatch方法（之前说过dispatch方法会触发action，最终会执行reducer函数）
``` js
...
const mapStateToProps = state=>({
  count: state.count
})
const mapDispatchToProps = dispatch =>({
  increment(){
    return dispatch({
      type: 'increment'
    })
  },
  decrement(){
    return dispatch({
      type: 'decrement'
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(App);

```
处理reducer
``` js
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
```
使用`bindActionsCreators`
``` js
import { bindActionCreators } from 'redux'
...
const mapDispatchToProps = dispatch => bindActionCreators({
  increment() {
    return {
      type: 'increment'
    }
  },
  decrement() {
    return {
      type: 'decrement'
    }
  }
}, dispatch)
```
将`mapDispatchToProps`中的action提取到单独的文件中
``` js
// actions.js
export const increment = () => ({
    type: 'increment'
})

export const decrement = () => ({
    type: 'decrement'
})
```
``` js
import * as countActions from './store/actions'
... 
const mapDispatchToProps = dispatch => bindActionCreators(countActions, dispatch)
```
拆分多个reducer,当reducer中的代码比较多时，可以拆分进行管理
``` js
import {
    combineReducers
} from 'redux'
import countReducer from './count'
import showReducer from './show'

export default combineReducers({
    counter: countReducer,
    modal: showReducer
})
```
``` js
// count.js
const initState = {
    count: 0
}
export default function countReducer(state = initState, action) {
    switch(action.type){
        case 'decrement':
            return {
                count: state.count + 1
            };
        case 'increment':
            return {
                count: state.count + 1
            };
         default:
            return state
    }
}
```
在组件中使用
``` js
...
const mapStateToProps = state => ({
  count: state.counter.count,
  show: state.modal.show
})
const mapDispatchToProps = dispatch => bindActionCreators(countActions, dispatch)
```
传递参数
``` js
export const increment = payload => ({
    type: 'increment',
    payload
})

export const decrement = payload => ({
    type: 'decrement',
    payload
})

```
``` js
export default function countReducer(state = initState, action) {
    switch (action.type) {
        case 'decrement':
            return {
                count: state.count - (action.payload ? action.payload : 1)
            };
        case 'increment':
            return {
                count: state.count + (action.payload ? action.payload : 1)
            };
        default:
            return state
    }
}
```
``` jsx
<button onClick={() => props.decrement(5)}>-</button>
```
## redux的中间件
### 开发一个redux中间件
``` js
export default function logger(store) {
    return next => {
        return action => {
            console.log(action)
            next(action)
        }
    }
}
```
引入中间件
``` js
import reducer from './reducers'
import {
    applyMiddleware
} from 'redux'
import logger from './middlewares/loggger'

const store = createStore(reducer, applyMiddleware(logger))

export default store
```
### 开发一个支持异步操作的中间件
``` js
export default function thunk(store) {
    return next => {
        return action => {
          // 如果action是个函数，就执行这个函数
          // 并把dispatch传递过去
            if (typeof action === 'function') {
                return action(store.dispatch)
            }
            next(action)
        }
    }
}
```
在异步action中，异步任务执行完成后，调用dispatch方法触发其他的action
``` js
export const deplay_increment = payload => dispatch => {
    setTimeout(() => {
        dispatch(increment(payload))
    }, 2000)
}
```
``` js
...
const store = createStore(reducer, applyMiddleware(logger, thunk))
...
```
### redux-thunk
`redux-thunk`的使用方法和上面实现的thunk中间件的使用方法一样
``` js
...
import thunk from 'redux-thunk'
...
const store = createStore(reducer, applyMiddleware(logger,thunk))
```
### redux-actions
在上面的代码中，我们创建action，写了比较多的样本代码，甚至，还需要将action.type写成常量提取到单独的文件进行管理，这样增加了代码量

通过使用`redux-actions`可以简化这些过程
``` js
import {
    createAction
} from 'redux-actions'

export const decrement = createAction('decrement')
export const increment = createAction('increment')
```
``` js
import {
    handleActions as createReducer
} from 'redux-actions'
import {
    decrement,
    increment
} from '../actions'

const countReducer = createReducer({
    [increment]: (state, action) => {
        return {
            count: state.count + (action.payload ? action.payload : 1)
        }
    },
    [decrement]: (state, action) => {
        return {
            count: state.count - (action.payload ? action.payload : 1)
        }
    }
}, initState)
export default countReducer
```
### redux-saga
`redux-saga`也是用来处理异步操作的，可以将要处理的异步操作放到单独的文件中
``` js
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

// 处理
function* handleDelayIncrement(action) {
    yield delay(2000)
    // 触发action
    yield put(increment(action.payload))
}

export default function* CounterSaga() {
  // 接收action
    yield takeEvery(deplay_increment, handleDelayIncrement)
}
```
引入`redux-saga`
``` js
import {
    createStore
} from 'redux'
import {
    applyMiddleware
} from 'redux'
import createSagaMiddleWare from 'redux-saga'
import reducer from './reducers'
import CounterSaga from './sagas/couter'

const sageMiddleWare = createSagaMiddleWare()
const store = createStore(reducer, applyMiddleware(sageMiddleWare))

sageMiddleWare.run(CounterSaga)

export default store
```
合并多个saga，使用`redux-saga/effects`中all方法可以将多个saga文件进行合并
``` js
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
```
## [Redux Toolkit](https://redux-toolkit.js.org/)
``` 
npm install @reduxjs/toolkit react-redux
```
``` js
import {
    createSlice,
    configureStore
} from '@reduxjs/toolkit'
export const TODOS_KEY = 'todos'
const {
    reducer: todoReducer,
    actions
} = createSlice({
    name: TODOS_KEY,
    initialState: [],
    reducers: {
        addTodo(state, actions) {
            state.push(actions.payload)
        }
    }
})
```
``` js
export const {
    addTodo
} = actions

export default configureStore({
    reducer: {
        [TODOS_KEY]: todoReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
})
```