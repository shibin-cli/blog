---
title: Redux的使用
categories: 
- 前端
tags: 
- React 
- date: 2021-08-01
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
``` js
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

