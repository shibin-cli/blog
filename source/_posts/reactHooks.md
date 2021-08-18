---
title: React Hooks的使用
categories: 
- 前端
tags: 
- React 
date: 2021-08-15
---
# React Hooks
使函数组件可以进行存储状态

类组件的不足
* 同一组相干逻辑拆分到多个生命周期中，一个生命周期中有多个不相干的逻辑
* this指向问题

## useState
``` js
import { useState } from 'react'
function App() {
    const [count, setCount] = useState(0)
    return (
        <div>
        {count}
        <button onClick={setCount(count+1)}>+</button>
        </div>
    )
}
```
每次修改，App函数都会执行

useState方法可以传递一个函数
``` js
    const [count, setCount] = useState(() => props.count || 0)
```
设置状态值的方法是可以异步的
## useReducer
``` js
import {
  useReducer
} from 'react'

function App() {
  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1;
      case 'decrement':
        return state - 1;
      default:
        return state
    }
  }
  const [count, dispatch] = useReducer(reducer, 0)
  return (
    <div className="App" >
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      {count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  )
}
```
## context
``` js
import {
  createContext,
} from 'react'
const coutContext = createContext()

function Foo(){
  return(
    <coutContext.Consumer>
      {
        value => {
          return <span>{value}</span>
        }
      }
    </coutContext.Consumer>
  )
}
function App() {
    return (
    <coutContext.Provider value={200}>
      <Foo/>
    </coutContext.Provider>
  )
}

export default App;
```
使用useContext
``` js
function Foo() {
  const value = useContext(coutContext)
  return (
    <span>{value}</span>
  )
}
```
## useEffect
useEffect
* 第一个参数是个effect函数
  * 如果返回一个函数，那么这个函数会在组件卸载之前执行
* 第二个参数是个数组（可选）
  * 不传递时，组件挂载或更新之后执行effect
  * 空数组，只会在挂载完成后执行effect
  * 当数组中有值时，只有当数组中的变量发生修改时参数触发effect
``` js
useEffect(() => {

})
```
useEffect可以传递第二个参数，第二个参数是个数组，只有数组中的数值发生改变时才会触发回调函数
``` js
// a,b值发生改变时触发
  useEffect(() => {
    
  }, [a, b])
```
当第二个参数为空数组时，只会在挂载完成后执行
``` js
// 组件挂载完成后执行
 useEffect(() => {

  }, [])
 
```

useEffect返回的函数是组件卸载之前执行
``` js
useEffect(() => {
     return () => {
        //  组件被卸载之前执行
     }
}, [])
```
### useEffect中使用异步函数
`useEffect`不能直接使用异步函数
``` js
  useEffect(() => {
    (async function(){

    })()
  }, [])
```
## useMeno
`useMeno`类似Vue中的计算属性，当第二个参数中的值发生改变时才会触发
``` js
const res = useMemo(() => {
    return count * 2
}, [count])
```
## meno
当数据没有发生改变时，不会触发函数进行重新渲染
``` js
const Foo = memo((props)=>{
  console.log('foo')
  return   <div>foo </div>
})
```
## useCallback
为什么要使用`useCallback`

下面代码中，每当页面重新渲染时，就会触发fn的重新赋值，如果将fn传递给子组件时，会导致子组件每次也会触发重新渲染
``` js
function App() {
  const fn = ()=>{
    ...
  }
  return (
    <div>
      ...
    </div>
  )
}
```

``` js
function App() {
    ...
    const resetCount = useCallback(()=>{
      setCount(0)
    },[setCount])
    ...
}
```
## useRef
`useRef`的基本使用
``` js
function App() {
  const username = useRef()
  return (
    <div>
      <input type="text" ref={username}/><button onClick={handler}>ref</button>      
    </div>
  )
}
```
使用useRef还可以保存数据，即使组件重新渲染，保存的数据不会改变
``` js
function App() {
  const [count, setCount] = useState(0)
  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }, [])
  const stopTimer = () => {
    clearInterval(timerId.current)
  }
  return (
    <div>
      {count}
      <button onClick={stopTimer}>clear</button>
    </div>
  )
}
```
## 自定义Hook
* 自定义Hook用来封装共享逻辑
* ⾃定义 Hook 其实就是逻辑和内置 Hook 的组合
``` js
function useGetData() {
  const [data, setData] = useState({})
  useEffect(() => {
    getData().then(res => {
      setData(res)
    })
  }, [])
  return [data, setData]
}
function App() {
  const [data, setData] = useGetData()
  return (
    <div>
      {data.title}
    </div>
  )
}
```
实现一个表单的自定义Hook
``` js
function useUpdateInput(initVal = '') {
  const [value, setValue] = useState(initVal)
  return {
    value,
    onChange(e) {
      setValue(e.target.value)
    }
  }
}
function App() {
  const usernameInput = useUpdateInput()
  const passwordInput = useUpdateInput()
  const summitForm = (e) => {
    e.preventDefault()
    console.log(usernameInput.value, passwordInput.value)
  }
  return (
    <div>
      <form onSubmit={summitForm}>
        <input type="text" name="username" {...usernameInput} autoComplete="false" /><br/>
        <input type="password" name="password" {...passwordInput} /><br/>
        <input type="submit" />
      </form>
    </div>
  )
}
```
## React路由中的Hook
``` js
import {useHistory, useLocation, useRouteMatch, useParams} from 'react-router-dom'

export default function About(){
    console.log('useHistory', useHistory())
    console.log('useLocation', useLocation())
    console.log('useRouteMatch', useRouteMatch())
    console.log('useParams', useParams())
    return (
        <h1>About</h1>
    )
}
```
## useState钩子函数的实现原理
分析
* useState返回一个数组，一个是状态值，一个是设置该状态的方法
* useState可以调用多次
组件中调用
``` js
function App() {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(1)

  return (
    <div>
      <div>count:{count}<button onClick={() => setCount(count + 1)}>+</button>
    
      </div>
      <div>count2:{count2}
      <button onClick={() => setCount2(count2 *2)}>2</button></div>
    </div>
  )
}
```
首先写出初始代码
``` js
function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}
function useState(initState) {
  let value = initState
  const setter = newVal => {
    value = newVal
    // 修改后重新渲染页面
    render()
  }
  return [value, setter]
}
```
保存状态值
``` js
let state
function useState(initState) {
  if(typeof state === 'undefined'){
    state = initState
  }
  const setter = newVal => {
    state = newVal
    // 修改后重新渲染页面
    render()
  }
  let value = state
  return [value, setter]
}
```
由于`useState`可以调用多次
* 需要对每个状态进行保存，我们可以使用数组进行保存
* 由于每次调用修改状态值的方法，设置当前属性的值，需要当前状态值所对应的索引，这里可以使用闭包保存当前状态的索引值

这样就实现了一个简单的useState方法
``` js
let state = []
let stateIndex = 0
function render() {
  stateIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
function createSetters(stateIndex) {
  return newVal => {
    state[stateIndex] = newVal
    stateIndex = 0
    render()
  }
}
function useState(initState) {
  if (typeof state[stateIndex] === 'undefined') {
    state[stateIndex] = initState
  }
  const setter = createSetters(stateIndex)
  let value = state[stateIndex]

  stateIndex++
  return [value, setter]
}
```

完整代码
``` js
import ReactDOM from 'react-dom'
let state = []
let setters = []
let stateIndex = 0

function createSetter(index){
  return (newState)=>{
    state[index] = newState
    render()
  }
}
function useState(initState) {
  if (typeof state[stateIndex] === 'undefined') {
    state[stateIndex]= initState
  }
  const setter = createSetter(stateIndex)
  const value = state[stateIndex]
  setters.push(setter)
  stateIndex++
  return [value, setter]
}
function render() {
  stateIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
function App() {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(1)

  return (
    <div>
      <div>count:{count}<button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>count2:{count2}
      <button onClick={() => setCount2(count2 *2)}>2</button></div>
    </div>
  )
}

export default App
```
## useEffect的实现原理
``` js
let prevEffects = []
let effectIndex = 0

function render() {
  stateIndex = 0
  effectIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
function useEffect(cb, depsArr) {
  if (typeof cb !== 'function') {
    console.warn('useEffect的第一个参数必须是函数')
    return
  }
  if (typeof depsArr === 'undefined') {
    cb()
  } else {
    if (!Array.isArray(depsArr)) {
      console.warn('useEffect的第二个参数必须是数组')
    } else if (depsArr.length) {
      const prevEffect = prevEffects[effectIndex]
      const hasChanged = prevEffect ? depsArr.every((dep, index) => dep !== prevEffect[index]) : true
      if (hasChanged) {
        cb()
      }
      prevEffects[effectIndex] = depsArr
      effectIndex++
    }
  }
}  
```
## useReducer的实现原理
``` js
function useReducer(reducer, initState) {
  const [state, setState] = useState(initState)
  function dispatch(action) {
    const newState = reducer(state, action)
    setState(newState)
  }
  return [state, dispatch]
}
```