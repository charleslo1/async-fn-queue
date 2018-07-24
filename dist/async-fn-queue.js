(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/core-js/promise')) :
	typeof define === 'function' && define.amd ? define(['babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/core-js/promise'], factory) :
	(global.weappCookie = factory(global._classCallCheck,global._createClass,global._Promise));
}(this, (function (_classCallCheck,_createClass,_Promise) { 'use strict';

_classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
_createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
_Promise = _Promise && _Promise.hasOwnProperty('default') ? _Promise['default'] : _Promise;

/**
 * Queue 类
 */
var Queue = function () {
  function Queue(name) {
    _classCallCheck(this, Queue);

    this.name = 'default'; // 队列名称
    this.canExec = false; // 是否可执行队列
    this.runing = false; // 是否正在执行队列
    this.asyncFns = []; // 待执行函数列表
  }

  /**
   * 添加异步操作函数
   * @param {Function} fn 异步操作函数
   * @return {Object}      this
   */


  _createClass(Queue, [{
    key: 'push',
    value: function push(fn) {
      if (fn instanceof Function) {
        this.asyncFns.push(fn);
      } else {
        throw new Error('队列只接受 Function 类型');
      }
      return this;
    }

    /**
     * 获取最前面的异步操作函数
     * @return {Function}   异步操作函数
     */

  }, {
    key: 'pop',
    value: function pop() {
      return this.asyncFns.shift();
    }

    /**
     * 按顺序执行异步操作队列
     * @return {Object}      this
     */

  }, {
    key: 'start',
    value: function start() {
      // 标记执行
      this.asyncFns.forEach(function (fn) {
        fn.__exec = true;
      });
      // 开始按顺序执行操作
      this.canExec = true;
      this.__nextTick();
      return this;
    }

    /**
     * 递归执行异步操作队列
     */

  }, {
    key: '__nextTick',
    value: function __nextTick() {
      var _this = this;

      if (!this.canExec || this.runing) return;
      if (this.asyncFns.length === 0) return this.pause();

      var fn = this.asyncFns.shift();
      if (!fn.__exec) {
        this.asyncFns.unshift(fn);
        return this.pause();
      }

      this.runing = true;
      var promise = fn();
      var runNext = function runNext() {
        _this.runing = false;
        _this.__nextTick();
      };
      if (promise instanceof _Promise) {
        promise.then(runNext).catch(runNext);
      } else {
        runNext();
      }
    }

    /**
     * 停止执行
     * @return {Object}      this
     */

  }, {
    key: 'pause',
    value: function pause() {
      this.canExec = false;
      this.runing = false;
      return this;
    }

    /**
     * 清除所有异步操作
     * @return {Object}      this
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.pause();
      this.asyncFns = [];
      return this;
    }

    /**
     * 执行下一个异步操作
     * @param  {Function} fn 异步操作函数
     * @return {Object}      this
     */

  }, {
    key: 'next',
    value: function next(fn) {
      return this.push(fn).start();
    }
  }]);

  return Queue;
}();

/**
 * QueueManager 类
 */

var QueueManager = function () {
  function QueueManager() {
    _classCallCheck(this, QueueManager);

    // 队列列表
    this.queues = {};
  }

  /**
   * 根据名称获取队列，不存在则创建
   * @param  {String} name 队列名称
   * @return {Queue}       队列对象
   */


  _createClass(QueueManager, [{
    key: 'get',
    value: function get(name) {
      var queue = this.queues[name];
      if (!queue) {
        queue = new Queue(name);
        this.queues[name] = queue;
      }
      return queue;
    }
  }]);

  return QueueManager;
}();

// 实例化 queueManager
var queueManager$1 = new QueueManager();

return queueManager$1;

})));
//# sourceMappingURL=async-fn-queue.js.map
