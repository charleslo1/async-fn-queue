import Queue from './Queue'

/**
 * QueueManager
 */
class QueueManager {
  constructor () {
    // 队列列表
    this.queues = {}
  }

  /**
   * 根据名称获取队列，不存在则创建
   * @param  {String} name 队列名称
   * @return {Queue}       队列对象
   */
  get (name) {
    let queue = this.queues[name]
    if (!queue) {
      queue = new Queue(name)
      this.queues[name] = queue
    }
    return queue
  }
}

export default QueueManager
