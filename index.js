let queue = []
let id = 1

class Person {
  constructor(id) {
    this.id = id
  }
  serveTime() {
    console.log(Math.random() * 10000)
    return Math.random() * 10000
  }
}

const createPerson = () => {
  queue = queue.concat(new Person(id))
  id++
  if (id > 10) {
    clearInterval(timerId, 0)
  }
  console.log(queue)
}

let timerId = setInterval(() => createPerson(), Math.random() * 10000)
