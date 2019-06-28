"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Action0 = /** @class */ (function () {
    function Action0() {
        this._funcs = [];
    }
    Action0.prototype.invoke = function () {
        for (var _i = 0, _a = this._funcs; _i < _a.length; _i++) {
            var f = _a[_i];
            f();
        }
    };
    Action0.prototype.add = function (f) {
        if (!this._funcs.includes(f))
            this._funcs.push(f);
    };
    Action0.prototype.remove = function (f) {
        var index = this._funcs.indexOf(f);
        if (index >= 0)
            this._funcs.splice(index, 1);
    };
    Action0.prototype.removeAll = function () {
        this._funcs = [];
    };
    return Action0;
}());
exports.Action0 = Action0;
var Action1 = /** @class */ (function () {
    function Action1() {
        this._funcs = [];
    }
    Action1.prototype.invoke = function (t1) {
        for (var _i = 0, _a = this._funcs; _i < _a.length; _i++) {
            var f = _a[_i];
            f(t1);
        }
    };
    Action1.prototype.add = function (f) {
        if (!this._funcs.includes(f))
            this._funcs.push(f);
    };
    Action1.prototype.remove = function (f) {
        var index = this._funcs.indexOf(f);
        if (index >= 0)
            this._funcs.splice(index, 1);
    };
    Action1.prototype.removeAll = function () {
        this._funcs = [];
    };
    return Action1;
}());
exports.Action1 = Action1;
var Action2 = /** @class */ (function () {
    function Action2() {
        this._funcs = [];
    }
    Action2.prototype.invoke = function (t1, t2) {
        for (var _i = 0, _a = this._funcs; _i < _a.length; _i++) {
            var f = _a[_i];
            f(t1, t2);
        }
    };
    Action2.prototype.add = function (f) {
        if (!this._funcs.includes(f))
            this._funcs.push(f);
    };
    Action2.prototype.remove = function (f) {
        var index = this._funcs.indexOf(f);
        if (index >= 0)
            this._funcs.splice(index, 1);
    };
    Action2.prototype.removeAll = function () {
        this._funcs = [];
    };
    return Action2;
}());
exports.Action2 = Action2;
var Action3 = /** @class */ (function () {
    function Action3() {
        this._funcs = [];
    }
    Action3.prototype.invoke = function (t1, t2, t3) {
        for (var _i = 0, _a = this._funcs; _i < _a.length; _i++) {
            var f = _a[_i];
            f(t1, t2, t3);
        }
    };
    Action3.prototype.add = function (f) {
        if (!this._funcs.includes(f))
            this._funcs.push(f);
    };
    Action3.prototype.remove = function (f) {
        var index = this._funcs.indexOf(f);
        if (index >= 0)
            this._funcs.splice(index, 1);
    };
    Action3.prototype.removeAll = function () {
        this._funcs = [];
    };
    return Action3;
}());
exports.Action3 = Action3;
function test() {
    var a = new Action1();
    a.add(function (msg) { console.log("hi:", msg); });
    a.invoke("world");
}
test();
//# sourceMappingURL=myjs.action.js.map