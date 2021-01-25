---
title: es6基础
---
部分内容参考了[《ECMAScript 6 入门》](https://es6.ruanyifeng.com/)
## ES2015
### 块级作用域
在es6之前，只有两种作用域
* 全局作用域
* 函数作用域

es6新增了块级作用域，可以使用`let`和`const`声明
#### let
let 可以用来声明变量，它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。
``` js
if (true) {
    var a = 100
}
console.log(a) //100
```
将变量a换成使用let或const声明后,就会报错
``` js
if (true) {
    let a = 100
}
console.log(a) //ReferenceError: a is not defined
```
如果使用let，声明的变量仅在块级作用域内有效
``` js
var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i);
  };
}
a[6](); // 6
```

上面代码中，变量i是let声明的，当前的i只在本轮循环有效，所以每一次循环的i其实都是一个新的变量，所以最后输出的是6。

##### 不存在变量提升
var命令会发生“变量提升”现象，即变量可以在声明之前使用，值为undefined。但let或const声明的变量不存在变量提升
``` js
// var 的情况
console.log(foo); // 输出undefined
var foo = 2;

// let 的情况
console.log(bar); // 报错ReferenceError
let bar = 2;
```
##### 暂时性死区
``` js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```
上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错。

ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。
##### 不允许重复声明
let不允许在相同作用域内，重复声明同一个变量。
``` js
// 报错
function func() {
  let a = 10;
  var a = 1;
}

// 报错
function func() {
  let a = 10;
  let a = 1;
}
```
#### const
const用来声明一个只读的常量。一旦声明，常量的值就不能改变。其他的跟let一样
``` js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // TypeError: "foo" is read-only
```
在开发环境允许的条件下，声明变量时不要使用var，能用const就使用const，不能用就使用let
### 变量解构赋值
#### 数组的解构
``` js
let [a, b, c] = [1, 2, 3]
console.log(a, b, c) // 1 2 3

let [, , d] = [1, 2, 3]
console.log(d) // 3

let [, d] = [1]
console.log(d) // undefined
```
上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值。如果匹配不成功，变量的值就是`undefined`

可以使用`...`来匹配剩余的元素
```js
let [e, , ...f] = [1, 2, 3, 4, 5, 6]
console.log(f) // [ 3, 4, 5, 6 ]
```
默认值
``` js
let [x, y = 'b'] = ['a']; // x='a', y='b'
```
注意，ES6 内部使用严格相等运算符（===），判断一个位置是否有值。所以，只有当一个数组成员严格等于undefined，默认值才会生效。
#### 对象的解构

``` js
lconst obj = {
    name: 'Shibin',
    age: '17'
}
let { name, age } = obj
console.log(name, age) //Shibin 17

// 如果变量名与属性名不一致，可以这样写
let { name: MyName } = obj
console.log(MyName)
// 默认值
let { title: myTitle = 'Hello' } = obj
console.log(myTitle) //Hello
```
### 字符串
#### 模板字符串
模板字符串中嵌入变量，需要将变量名写在${}之中。
```js
const name = 'Shibin'
const msg = `Hello,${name}` 
console.log(msg) // Hello,Shibin
```
大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性。
```js
console.log(`1 + 2 = ${1 + 2}`) // 1 + 2 = 3
```
如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

##### 带标签的模板字符串
模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串
``` js 
const name = 'Shibin'
const age = '17'
function myFunc(str, name, age) {
    console.log(str) // [ 'My name is ', ". I'm ", ' years old' ]
    console.log(name, age) // Shibin 17
    let old = age > 1 ? `${age} years old` : `${age} year old`
    return str[0] + name + str[1] + old
}
let res = myFunc`My name is ${name}. I'm ${age}`
console.log(res) // My name is Shibin. I'm 1 year old
```
#### 字符串方法
* includes  是否包含xxx字符串
* startsWith 是否以xxx开头
* endsWith  是否以xxx结尾
``` js
let a = 'https//www.github.com'
console.log(a.includes('github')) // true
console.log(a.startsWith('https')) // true
console.log(a.endsWith('com')) // true
```
### 参数默认值
``` js
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
```
通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。
```js
function f(x = 1, y) {
  return [x, y];
}

f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
```
所以在使用开发过程中,一定要没有默认值的参数在前，有默认值的参数在后

可以使用...获取剩余的参数,也要放到最后再使用
``` js
function fn(a, ...b) {
    console.log(b) // [ 2, 3, 4, 5 ]
}
fn(1, 2, 3, 4, 5)
```
### 展开数组和对象
``` js
let a = [1, 2, 3, 4]
console.log([...a]) // [ 1, 2, 3, 4 ]

let obj = {
    name: 'Shibin',
    age: '17'
}
console.log({
    ...obj,
    sex: 'boy'
})//{ name: 'Shibin', age: '17', sex: 'boy' }
```
### 箭头函数
es6允许使用=>定义函数
``` js
const fn = a => a
// 等同于
const fn = a => {
    return a
}
```
如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
``` js
let getTempItem = id => ({ id: id, name: "Temp" })
// 报错
let getTempItem = id => { id: id, name: "Temp" }
```
箭头函数不会改变this的指向，即函数内部this指向和函数外面this的指向一样

### 对象
####  对象字面量
当变量名与对象的属性名一样时，可以直接省略调冒号+属性值，写成下面的样子
``` js
const bar = 'bar'
const obj = {
    foo: 123,
    bar,
    func(){
        console.log(123)
    }
}
// 等价于
const obj = {
    foo: 123,
    bar: bar,
    func: func(){
        console.log(123)
    }
}
```
在声明对象时，还可以使用 `[计算属性值]: 属性值`来声明动态的属性值
``` js
const obj = {
    ['a' + 'b']: 'aabb'
}
// 等价于
const obj = {
    ab: 'aabb'
}
```
####  Object.assign
Object.assign  将多个对象中的属性（可枚举属性）复制到一个目标对象中，后面的属性会覆盖前面的对象
``` js
const obj1 = {
    name: 'Shibin'
}
const obj2 = {
    age: 17,
    sex: 'boy'
}
const target = Object.assign(obj1, obj2)
console.log(target) // { name: 'Shibin', age: 17, sex: 'boy' }
```
#### Object.is
判断两个变量是否相等
```js
console.log(Object.is(NaN, NaN)) //true
```
#### Proxy
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程

Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截
``` js
const person = {
    name: 'Shibin',
    age: 17
}
const personProxy = new Proxy(person, {
    get(target, key) {
        console.log(target, key) // { name: 'Shibin', age: 17 } name
        return target[key]
    }, 
    set(target, key, val) {
        console.log(target, key, val)
        if(key === 'age' && typeof val !== 'number'){
            throw new Error('age must be number')
        }
        target[key] = val // { name: 'Shibin', age: 17 } sex boy
    }
})
console.log(personProxy.name)
console.log(personProxy.age)
personProxy.sex = 'boy'

age.age = 'aa' //报错  Error: age must be number
```
#### Proxy相对于Object.defineProperty的优势
* 可以监听对象的删除
* 更好的支持数组对象的监视
``` js
const person = {
    name: 'Shibin',
    age: 17
}
const personProxy = new Proxy(person, {
    deleteProperty(target, key) {
        console.log(target, key) // { name: 'Shibin', age: 17 } age
    }
})
delete personProxy.age
```
``` js
const arr = [1, 2, 3, 4, 5]
const personArr = new Proxy(arr, {
    set(target, key, val) {
        console.log(target, key, val)
        target[key] = val  // [ 1, 2, 3, 4, 5 ] 5 6  
                           // [ 1, 2, 3, 4, 5, 6 ] length 6  
        return true
    }
})
personArr.push(6)
console.log(arr)
```
Proxy是以非侵入的方式监管了对象的读写

其他属性参考  https://es6.ruanyifeng.com/#docs/proxy

#### Reflect
Reflect成员方法就是Proxy处理对象的默认实现。Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
``` js
let person = {
    name: 'Shibin',
    age: 17
}
const personProxy = new Proxy(person, {
    get(target, key, receiver) {
        return Reflect.set(target, key, receiver)
    },
    set(target, key, val, receiver) {
        return Reflect.set(target, key, val, receiver)
    }
})
```
它统一提供了一套用于操作对象的API

一共提供了13个静态方法
* Reflect.apply(target, thisArg, args)
* Reflect.construct(target, args)
* Reflect.get(target, name, receiver)
* Reflect.set(target, name, value, receiver)
* Reflect.defineProperty(target, name, desc)
* Reflect.deleteProperty(target, name)
* Reflect.has(target, name)
* Reflect.ownKeys(target)
* R*eflect.isExtensible(target)
* Reflect.preventExtensions(target)
* Reflect.getOwnPropertyDescriptor(target, name)
* Reflect.getPrototypeOf(target)
* Reflect.setPrototypeOf(target, prototype)

### Class
``` js
class Person {
    constructor(name) {
        this.name = name
    }
    say() {
        console.log(`Hello,my name is ${this.name}`)
    }

}
const person = new Person('Tom')
person.say() // Hello,my name is Tom
```
如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
``` js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
```
#### Class的继承
Class 可以通过extends关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。
```js
class Person {
    constructor(name) {
        this.name = name
    }
    say() {
        console.log(`Hello,my name is ${this.name}`)
    }

}
class Student extends Person {
    constructor(name, age) {
        super(name)
        this.age = age
    }
    sayAge() {
        console.log(this.age)
    }
}

const student = new Student('Tom', 20)
student.say() // Hello,my name is Tom
student.sayAge() // 20
```
super关键字，它在这里表示父类的构造函数，用来新建父类的this对象。 子类必须在constructor方法中调用super方法，否则新建实例时会报错
### Set
类似于数组，但是成员的值都是唯一的，没有重复的值。
```js
const a = new Set()
a.add(1).add(2).add(3).add(3)
console.log(a) // Set(3) { 1, 2, 3 }
```
Set的方法
* Set.prototype.add(value)：添加某个值，返回 Set 结构本身。
* Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
* Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
* Set.prototype.clear()：清除所有成员，没有返回值。
* Set.prototype.size：返回Set实例的成员总数。


Set的遍历操作
* Set.prototype.keys()：返回键名的遍历器
* Set.prototype.values()：返回键值的遍历器
* Set.prototype.entries()：返回键值对的遍历器
* Set.prototype.forEach()：使用回调函数遍历每个成员

Set转换为数组
``` js
console.log(Array.from(a)) // [ 1, 2, 3 ]
console.log([...a]) // [ 1, 2, 3 ]
```
### WeakSet
WeakSet 结构与 Set 类似，也是不重复的值的集合.但是，它与 Set 有两个区别。
* WeakSet 的成员只能是对象，而不能是其他类型的值。
* WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用。也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

这些特点同样适用于 WeakMap 结构。
### Map
它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。
``` js
const obj = {
    name: 'tom'
}
const a = new Map()
a.set(obj, 100)
console.log(a) // Map(1) { { name: 'tom' } => 100 }
console.log(a.get(obj)) //100
// 清除set中的内容
a.clear() 
console.log(a) //Map(0) {}
```
Map实例的属性方法
* size 返回 Map 结构的成员总数。
* Map.prototype.set(key, value)
* Map.prototype.get(key)
* Map.prototype.has(key)  表示某个键是否在当前 Map 对象之中
* Map.prototype.delete(key)  delete删除某个键，返回true。如果删除失败，返回false。
* Map.prototype.clear() 清除所有成员

### Symbol
一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）
```js
let a = Symbol('123')
let b = Symbol('123')
console.log(a === b) //false

let obj = {}
obj[a] = 200
obj[b] = 100
console.log(obj) // { [Symbol(123)]: 200, [Symbol(123)]: 100 }
```
对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。

有时，我们希望重新使用同一个 Symbol 值,可以使用Symbol.for()
``` js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

console.log(s1 === s2) // true
```
Object.keys和for in循环无法获取到属性名为symbol的属性，可以使用getOwnPropertySymbols获取到属性名为symbol的属性
### Iterator
Iterator 的作用有三个：
* 为各种数据结构，提供一个统一的、简便的访问接口
* 使得数据结构的成员能够按某种次序排列
* ES6 创造了一种新的遍历命令for...of循环，Iterator 接口主要供for...of消费

Iterator 的遍历过程是这样的
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置

每一次调用next方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束。

``` js
// 实现Iterator 接口
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
}
```
ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”
 
原生具备 Iterator 接口的数据结构如下
* Array
* Map
* Set
* String
* TypedArray
* 函数的 arguments 对象
* NodeList 对象

对象（Object）之所以没有默认部署 Iterator 接口，是因为对象的哪个属性先遍历，哪个属性后遍历是不确定的，需要开发者手动指定
### for...of
作为遍历所有数据结构的统一的方法。
``` js
const arr = [100, 200, 300, 400, 900]
for (const item of arr) {
    console.log(item)
}
// 输出
// 100
// 200
// 300
// 400
// 900

let s = new Set(arr)
for (const item of s) {
    console.log(item)
}
// 输出
// 100
// 200
// 300
// 400
// 900

let m = new Map()
m.set('name','tom')
m.set('age',20)
for (const item of m) {
    console.log(item)
}
// 输出
// [ 'name', 'tom' ]
// [ 'age', 20 ]
```
### 生成器
在function关键字与函数名加上一个星号就是生成器函数，函数体内部可以使用yied表达式
```js
function* foo() {
    console.log('foo')
    return 'foo'
}
let res = foo()
console.log(res.next()) //{ value: 'foo', done: true }


function* foo() {
    console.log('foo')
    yield '1'
    yield '2'
    return 'foo'
}
let res = foo()
console.log(res.next()) //{ value: '1', done: false }
console.log(res.next()) //{ value: '2', done: false }
```
Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行。

遍历器对象的next方法的运行逻辑如下。
* 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
* 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
* 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
* 如果该函数没有return语句，则返回的对象的value属性值为undefined。

yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
```js
/*
next方法没有参数，每次运行到yield表达式，变量reset的值总是undefined。当next方法带一个参数true时，变量reset就被重置为这个参数（即true），因此i会等于-1，下一轮循环就会从-1开始递增。
*/
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```
## ES2016
### Array.prototype.inclodes
``` js
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```
该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度

indexOf方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。二是，它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。
### 指数运算符
```js
// es5
console.log(Math.pow(2, 4))
// es2016
console.log(2 ** 4)
```
## ES2017
### bject.values()  
返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
``` js
const obj = { foo: 'bar', baz: 42 }
console.log(Object.values(obj)) // [ 'bar', 42 ]
```
### Object.entries() 
方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
``` js
const obj = { foo: 'bar', baz: 42 }
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]
```
如果原对象的属性名是一个 Symbol 值，该属性会被忽略。
```js
console.log(Object.entries({ [Symbol()]: 123, foo: 'abc' }))  // [ [ 'foo', 'abc' ] ]
```
Object.entries的基本用途是遍历对象的属性。
``` js
const obj = { foo: 'bar', baz: 42 }
for (const [k, v] of Object.entries(obj)) {
    console.log(k, v)
}
// foo bar
// baz 42
```
### Object.getOwnPropertyDescriptors
返回指定对象所有自身属性（非继承属性）的描述对象。
``` js
const f1 = {
    name: 'Shibin',
    age: 10,
    get say() {
        return this.name + ':' + this.age
    }
}
const f2 = Object.assign({}, f1)
f2.age = 17
console.log(f2.say) //{ name: 'Shibin', age: 17, say: 'Shibin:10' }

const descriptors = Object.getOwnPropertyDescriptors(f1)
const f3 = Object.defineProperties({}, descriptors)
f3.age = 18
console.log(f3.say) //Shibin:18
```


### String.prototype.padEnd  String.prototype.padStart
字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
``` js
const str='123'
console.log(str.padEnd(8, '0')) // 12300000
console.log(str.padStart(8, '0')) // 00000123
```
### 伪逗号
```js
// 函数参数末尾添加伪逗号
function fn1(a, b,) {

}
```