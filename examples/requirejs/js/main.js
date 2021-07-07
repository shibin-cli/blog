define(function(require, exports, module) {
    var a = require('a'),
        b = require('b');

    //Return the module value
    console.log(a(1,2))
    console.log(b.add(2,3))
    return function () {};
}
);