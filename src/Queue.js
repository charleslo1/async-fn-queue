/**
 * Queue 类
 */
class Queue {
  constructor (name) {
    this.name = 'default'   // 队列名称
    this.canExec = false     // 是否可执行队列
    this.runing = false     // 是否正在执行队列
    this.asyncFns = []      // 待执行函数列表
  }

  /**
   * 添加异步操作函数
   * @param {Function} fn 异步操作函数
   * @return {Object}      this
   */
  push (fn) {
    if (fn instanceof Function) {
      this.asyncFns.push(fn)
    } else {
      throw new Error('队列只接受 Function 类型')
    }
    return this
  }

  /**
   * 获取最前面的异步操作函数
   * @return {Function}   异步操作函数
   */
  pop () {
    return this.asyncFns.shift()
  }

  /**
   * 按顺序执行异步操作队列
   * @return {Object}      this
   */
  start () {
    // 标记执行
    this.asyncFns.forEach((fn) => {
      fn.__exec = true
    })
    // 开始按顺序执行操作
    this.canExec = true
    this.__nextTick()
    return this
  }

  /**
   * 递归执行异步操作队列
   */
  __nextTick () {
    if (!this.canExec || this.runing) return
    if (this.asyncFns.length === 0) return this.pause()

    let fn = this.asyncFns.shift()
    if (!fn.__exec) {
      this.asyncFns.unshift(fn)
      return this.pause()
    }

    this.runing = true
    let promise = fn()
    let runNext = () => {
      this.runing = false
      this.__nextTick()
    }
    if (promise instanceof Promise) {
      promise.then(runNext).catch(runNext)
    } else {
      runNext()
    }
  }

  /**
   * 停止执行
   * @return {Object}      this
   */
  pause () {
    this.canExec = false
    this.runing = false
    return this
  }

  /**
   * 清除所有异步操作
   * @return {Object}      this
   */
  stop () {
    this.pause()
    this.asyncFns = []
    return this
  }

  /**
   * 执行下一个异步操作
   * @param  {Function} fn 异步操作函数
   * @return {Object}      this
   */
  next (fn) {
    return this.push(fn).start()
  }
}

export default Queue
