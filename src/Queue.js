/**
 * Queue 类
 */
class Queue {
  constructor (name) {
    this.name = 'default'   // 队列名称
    this.isExec = false     // 是否可执行队列
    this.runing = false     // 是否正在执行队列
    this.asyncFns = []      // 待执行函数列表
  }

  /**
   * 添加异步操作函数
   * @param {Function} fn 异步操作函数
   * @return {Object}      this
   */
  add (fn) {
    this.asyncFns.push(fn)
    return this
  }

  /**
   * 按顺序执行异步操作队列
   * @return {Object}      this
   */
  exec () {
    // 标记执行
    this.asyncFns.forEach((fn) => {
      fn.__exec = true
    })
    // 开始按顺序执行操作
    this.isExec = true
    this.__nextTick()
    return this
  }

  /**
   * 递归执行异步操作队列
   */
  __nextTick () {
    if (!this.isExec || this.runing) return
    if (this.asyncFns.length === 0) return this.stop()

    let fn = this.asyncFns.shift()
    if (!fn.__exec) {
      this.asyncFns.unshift(fn)
      return this.stop()
    }

    this.runing = true
    if (fn instanceof Function) {
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
  }

  /**
   * 停止执行
   * @return {Object}      this
   */
  stop () {
    this.isExec = false
    this.runing = false
    return this
  }

  /**
   * 清除所有异步操作
   * @return {Object}      this
   */
  clear () {
    this.stop()
    this.asyncFns = []
    return this
  }

  /**
   * 执行下一个异步操作
   * @param  {Function} fn 异步操作函数
   * @return {Object}      this
   */
  next (fn) {
    return this.add(fn).exec()
  }
}

export default Queue
