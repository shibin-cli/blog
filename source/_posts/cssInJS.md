---
title: CSS IN JS
tag: React
date: 2021-08-22
categories: 
- 前端
- React
---
# CSS-IN-JS
## 为什么会有CSS-IN-JS
解决CSS的局限性，例如缺乏动态功能、作用域和可移植性

CSS-IN-JS的优点
* 让CSS拥有独立的作用域，防止CSS样式泄漏到组件外部，引起样式冲突
* 让组件具有可移植性、重用性
* 样式具有动态功能

缺点
* 增加项目的复杂性
* 自动生成的选择器大大降低了代码的可读性
## Emotion
### 安装
``` bash
yarn add @emotion/react
```
使用方法一: JSX Pragma

通知babel，不再需要将jsx语法转化为React.createment,而是需要转化为jsx方法
``` js
/** @jsx jsx */
```
如果你使用的是`create-react-app`创建的React17+版本应用，可能需要如下配置（文档上有解释 https://emotion.sh/docs/css-prop#jsx-pragma）
``` js
/** @jsxImportSource @emotion/react */
import {  css } from '@emotion/react'
```
使用方法二: Babel Preset
``` js
{
  "presets": ["@emotion/babel-preset-css-prop"]
}
```
### 使用方式
方式一
``` js
import { css } from '@emotion/react'
const style = css`
width: 200px;
height: 200px;
background: red
`
function App() {
  return (
    <div css={style}>
    </div>
  )
}

export default App
```
方式二
``` js
const style = css({
  width: 200,
  height: 200,
  background: 'blue'
})
```
### css属性优先级
props对象中的css属性优先级高于组件内部的css属性，在调用组件时可以覆盖组件的默认样式

子组件
``` js
const style = css`
width: 100px;
height: 40px;
line-height: 40px;
color: #fff;
background: red;
border-radius: 5px;
`
export default function Button(props){
    return (
        <button  css={style}  {...props}>{props.text}</button>
    )
}
```
父组件引入子组件后，父组件传入的background覆盖了子组件本身的background
``` js
function App() {
  return (
    <div>
      <Button text="按钮" css={{background:'#4e6ef2'}}/>
    </div>
  )
}
```
## Styled Components
### 建样式化组件的两种方式
``` js
import styled from '@emotion/styled'

const Button = styled.button`
width: 100px;
height:30px;
background: #4e6ef2;
`
```
``` js
import styled from '@emotion/styled'

const Container = styled.div({
  width: 960,
  margin: '0 auto'
})
```
在组将中调用
``` js
function App() {
  return (
    <Container>
      <Button>按钮</Button>
    </Container>
  )
}
```
### 根据props覆盖样式
``` js
// 写法一
const Button = styled.button`
width: 100px;
height:30px;
background: ${props => props.bgColor || '#4e6ef2'};
`

// 写法二
const Container = styled.div(props => ({
  width: props.w || 960,
  margin: '0 auto',
}))
// 写法三
const Container = styled.div({
  width: 960,
  margin: '0 auto'
}, props => ({
  width: props.w
}))

function App() {
  return (
    // 注意，w为字符串时，需要写成 w="1000px"
    <Container w={1000}>
      <Button bgColor="blue">按钮</Button>
    </Container>
  )
}
```
### 给组件添加样式
``` js
import styled from '@emotion/styled'

function Button(props){
  return (<button className={props.className}>{props.text}</button>)
}
const RedButton = styled(Button)`
background: red;
color: #fff;
`
// 写法二
// const RedButton = styled(Button)({
//   background: 'red',
//   color:'#fff'
// })
function App() {
  return (
    <div>
      <RedButton text='按钮'/>
    </div>
  )
}
```
在父组件中给子组件添加样式
``` js
const Child = styled.div`
color: red;
background: black;
`
// 写法一
const Parent1 = styled.div`
${Child} {
  color: green;
}
`
// 写法二
const Parent2 = styled.div({
  [Child]:{
    color: 'blue'
  }
})
```
### css选择器`&`
emotion中的`&`与sass中的`&`用法相同，都表示当前元素
``` js
// &代表的就是当前的ul标签
const List = styled.ul`
&>li{
  list-style: none;
}
```
使用`as`可以修改组件的标签
``` js
const List = styled.ul`
...
`
function App() {
  return (
    <div>
    // 这里渲染到页面的的标签就是div
      <List as="div">
        ...
      </List>
    </div>
  )
}
```
### 样式组合
``` js
import { css } from '@emotion/react'

const base = css`
font-size:16px;
`

const button = css`
border-radius:5px;
background: #4e6ef2;
color: #fff;
`

function App() {
  return (
    <div>
        <button css={[base,button]}>按钮</button>
    </div>
  )
}
```
### 全局样式
``` js
import { css, Global } from '@emotion/react'

const base = css`
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
`

function App() {
  return (
    <div>
      <Global styles={base}/>
      <ul>
        <li>1</li>
      </ul>
    </div>
  )
}
```
### 使用keyframes定义关键帧动画
``` js
import { css, keyframes } from '@emotion/react'

const movein = keyframes`
0% {
  background: red;
  left: 0;
  top: 0;
}
100% {
  background: blue;
  left: 300px;
  top: 300px;
}
`
const box = css`
position: absolute;
width: 100px;
height: 100px;
animation: ${movein} 2s;
`

function App() {
  return (
    <div css={box}>
     
    </div>
  )
}
```
### 使用主题功能
父组件使用`ThemeProvider`组件，并设置`theme`属性
``` js
import { ThemeProvider } from '@emotion/react'

const theme = {
  colors: {
    primary: 'blue'
  }
}

function App() {
  return (
   <ThemeProvider theme={theme}>
   ...
   </ThemeProvider>
  )
}
```
子组件
``` js
import { css, useTheme } from '@emotion/react'

const style = props => css`
color: ${props.colors.primary};
`
function Page() {
  // 也可以通过useTheme()拿到父组件中定义的theme对象
  return (
     <p css={style}>12312312</p>
  )
}
```