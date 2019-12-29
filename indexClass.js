class ModelATM {
  constructor(number) {
    this.number = number
    this.state = false
  }
  changeState() {
    this.state = !this.state
  }
}
class Person {
  constructor(id) {
    this.id = id
  }
  serveTime() {
    return Math.random() * 1000
  }
}

const body = document.body

class Controller {
  constructor(model) {
    this.body = document.querySelector("body")
    this.model = model
  }
  start() {
    this.body.addEventListener("click", () => this.startQueue())
  }

  startQueue() {
    this.model.createATM()
    this.model.startQueue()
  }
}

class Model {
  constructor(view) {
    this.view = view
    this.queue = []
    this.id = 1
    this.arrATM = [0]
  }
  startQueue() {
    this.timerId = setInterval(() => {
      this.createPerson()
    }, Math.random() * 1000)
  }

  createATM() {
    this.arrATM = this.arrATM.map(() => new ModelATM())
  }

  createPerson() {
    this.queue = this.queue.concat(new Person(this.id))
    this.id++
    if (this.id > 10) {
      clearInterval(this.timerId, 0)
      this.checkFree2()
    }
    console.log(this.queue)
    this.checkFree()
  }

  checkFreeBase = item => {
    const deletePerson = this.queue.shift()
    item.changeState()
    console.log(deletePerson)
  }

  checkFree = () => {
    this.arrATM.forEach(item => {
      if (!item.state) {
        this.checkFreeBase(item)
        setTimeout(() => item.changeState(), 1000)
      }
    })
    console.log(this.queue)
  }

  checkFree2 = () => {
    if (this.queue.length) {
      const timerId = setInterval(() => {
        this.arrATM.forEach(item => {
          if (!item.state) {
            this.checkFreeBase(item)
            setTimeout(() => item.changeState(), 2000)
            console.log(this.queue)
            if (!this.queue.length) clearInterval(timerId, 0)
          }
        })
      })
    }
  }
}

class View {
  constructor(body) {
    this.body = body
  }

  start() {
    this.div = document.createElement("div")
    this.div.className = "div"
    body.appendChild(this.div)
  }
}

const view = new View(body)
const model = new Model(view)
const controller = new Controller(model, body)

view.start()
controller.start()
