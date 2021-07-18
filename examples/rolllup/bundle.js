'use strict';

function fn(a) {
    console.log(a);
}

function sum(a, b) {
    return a + b
}

function Vue() {
    this.fn = fn;
    this.sum = sum;
}

module.exports = Vue;
