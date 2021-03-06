class EventEmitter {
  constructor() {
    this._events = {}
  }
  on(evt, listener) {
    ;(this._events[evt] || (this._events[evt] = [])).push(listener)
    return this
  }
  emit(evt, arg) {
    ;(this._events[evt] || []).slice().forEach(lsn => lsn(arg))
  }
}

class Person {
  constructor(id) {
    this.id = id
  }
  serveTime(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * 3000
  }
  viewPerson() {
    this.person = document.createElement("div")
    this.person.className = `person${this.id}`
    this.person.innerHTML = this.id
    return this.person
  }
}

class ATM extends EventEmitter {
  constructor(number) {
    this.number = number
    this.state = false
  }
  changeState() {
    this.state = !this.state
  }

  viewATM() {
    this.atm = document.createElement("div")
    this.atm.className = "atm"
    return this.atm
  }
}

class Model extends EventEmitter {
  constructor() {
    this.queue = []
    this.idPerson = 1
    this.amountATM = 3
    this.arrATM = []
    this.numberATM = 1
  }

  stopQueue() {
    clearInterval(this.timerId, 0)
  }

  clearModel() {
    this.queue = []
    this.idPerson = 1
    this.amountATM = 3
    this.arrATM = []
    this.numberATM = 1
  }

  createArrATM() {
    for (let i = 0; i < this.amountATM; i++) {
      this.arrATM = this.arrATM.concat([new ATM(this.numberATM++)])
    }
    return this.arrATM
  }

  randomTime(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * 1000
  }

  addPersonQueue() {
    const newPerson = new Person(this.idPerson)
    this.queue = this.queue.concat(newPerson)
    this.idPerson++
    if (newPerson === this.queue[0]) {
      const deletePersonQueue = this.deletePersonQueueStart(newPerson)
      if (deletePersonQueue[0]) {
        return deletePersonQueue
      }
    }
    return [newPerson]
  }

  deletePersonQueue(currentATM) {
    const deletePerson = this.queue.shift()
    currentATM.changeState()
    setTimeout(() => currentATM.changeState(), deletePerson.serveTime(1, 2))
    return deletePerson
  }

  deletePersonQueueStart(newPerson) {
    let deletePerson
    let currentServeATM
    this.arrATM.forEach(currentATM => {
      if (!currentATM.state && newPerson === this.queue[0]) {
        currentServeATM = currentATM
        deletePerson = this.deletePersonQueue(currentATM)
      }
    })
    return [deletePerson, currentServeATM]
  }

  deletePersonQueueATM() {
    const deletePersonQueue = []
    this.arrATM.forEach(currentATM => {
      if (!currentATM.state && this.queue[0]) {
        const arrPersonATM = []
        arrPersonATM.push(this.deletePersonQueue(currentATM))
        arrPersonATM.push(currentATM)
        deletePersonQueue.push(arrPersonATM)
      }
    })
    return deletePersonQueue
  }

  plusATM() {
    const newATM = new ATM(this.numberATM++)
    this.arrATM = this.arrATM.concat(newATM)
    return newATM
  }

  minusATM() {
    if (this.arrATM[0]) {
      this.numberATM--
      return this.arrATM.pop()
    }
  }
  }

  deletePersonQueueATM() {
    let deletePersonQueue
    let currentServeATM
    this.arrATM.forEach(currentATM => {
      if (!currentATM.state && this.queue[0]) {
        deletePersonQueue = this.queue.shift()
        currentATM.changeState()
        currentServeATM = currentATM
        setTimeout(() => {
          currentATM.changeState()
          this.emit("changeStateATM", currentATM.state)
        }, deletePersonQueue.serveTime(1, 3))
      }
    })
    console.log(this.queue)
    console.log(deletePersonQueue)
    return [deletePersonQueue, currentServeATM]
  }

  plusATM() {
    this.arrATM = this.arrATM.concat([new ATM(this.numberATM++)])
  }

  minusATM() {
    if (this.arrATM[0]) {
      this.arrATM.pop()
      this.numberATM--
    }
  }
}

class View extends EventEmitter {
  constructor(wrapper) {
    this.wrapper = wrapper
  }

  initial() {
    this.buttons = document.createElement("div")
    this.buttons.className = "buttons"
    this.wrapper.append(this.buttons)
    this.buttonStart = document.createElement("button")
    this.buttonStart.className = "start"
    this.buttons.append(this.buttonStart)
    this.buttonStart.innerText = "Start"
    this.buttonStop = document.createElement("button")
    this.buttonStop.className = "stop"
    this.buttons.append(this.buttonStop)
    this.buttonStop.innerText = "Stop"
    this.buttonStop = document.createElement("button")
    this.buttonStop.className = "plusATM"
    this.buttons.append(this.buttonStop)
    this.buttonStop.innerText = "plusATM"
    this.buttonStop = document.createElement("button")
    this.buttonStop.className = "minusATM"
    this.buttons.append(this.buttonStop)
    this.buttonStop.innerText = "minusATM"

    this.createBlockATM()
    this.createBlockQueue()
  }

  createBlockATM() {
    this.atmBlock = document.createElement("div")
    this.atmBlock.className = "atmBlock"
    wrapper.appendChild(this.atmBlock)
  }

  createBlockQueue() {
    this.queue = document.createElement("div")
    this.queue.className = "queue"
    wrapper.appendChild(this.queue)
  }

  createInitialATM(arrATM) {
    if (!this.atmBlock.children.length) {
      arrATM.forEach(atm => {
        this.createATM(atm)
      })
    }
  }

  createATM(atm) {
    this.atmBlock.append(atm.viewATM())
  }

  deleteBlocks() {
    this.atmBlock.remove()
    this.queue.remove()
  }

  addPersonView(newPerson) {
    if (newPerson) {
      this.queue.append(newPerson.viewPerson())
    }
  }

  deletePersonView(deletePerson) {
    deletePerson.person.remove()
  }

  goToATM(person, currentServeATM) {
    if (person && currentServeATM) {
      for (let i = 0; i < this.atmBlock.children.length; i++) {
        this.atmBlock.children[i].classList.remove("currentATM")
      }
      this.atmBlock.children[currentServeATM.number - 1].classList.add(
        "currentATM"
      )
      this.atmBlock.children[currentServeATM.number - 1].innerText = person.id
    }
  }

  plusATM(newATM) {
    this.createATM(newATM)
  }

  minusATM(deleteATM) {
    if (deleteATM) deleteATM.atm.remove()
  }
}

class Controller extends EventEmitter {
  constructor(model, view, wrapper) {
    super()
    this.model = model
    this.view = view
    this.wrapper = wrapper

    this.model.on("changeStateATM", state => this.deletePerson(state))
  }

  initial() {
    this.view.initial()

    this.buttonStart = wrapper.querySelector(".start")
    this.buttonStart.addEventListener("click", () => this.startProgram())

    this.buttonStop = wrapper.querySelector(".stop")
    this.buttonStop.addEventListener("click", () => this.stopProgram())

    this.buttonPlusATM = wrapper.querySelector(".plusATM")
    this.buttonPlusATM.addEventListener("click", () => this.plusATM())

    this.buttonMinusATM = wrapper.querySelector(".minusATM")
    this.buttonMinusATM.addEventListener("click", () => this.minusATM())
  }

  startProgram() {
    this.stopProgram()
    const arrATM = this.model.createArrATM()
    this.view.createInitialATM(arrATM)
    this.startQueue()
  }

  startQueue() {
    const self = this
    let count = 0
    this.createQueue = setTimeout(function f() {
      console.log(count++)
      const person = self.model.addPersonQueue()
      const [newPerson, currentServeATM] = person
      self.view.addPersonView(newPerson)
      self.view.goToATM(newPerson, currentServeATM)
      if (currentServeATM) {
        self.view.deletePersonView(newPerson)
      }
      self.model.randomTime(1, 3)
      if (count < 15) {
        self.createQueue = setTimeout(f, self.model.randomTime(1, 3))
      } else {
        return clearTimeout(self.createQueue)
      }
      return
    }, 1000)
  }

  deletePerson(state) {
    if (!state) {
      const person = this.model.deletePersonQueueATM()
      console.log(state)
    }
  }

  stopProgram() {
    clearTimeout(this.createQueue, 0)
    //   clearInterval(this.checkStateATM, 0)
    this.model.clearModel()
    this.view.deleteBlocks()
    this.view.createBlockATM()
    this.view.createBlockQueue()
  }

  plusATM() {
    this.model.plusATM()
    this.view.plusATM()
  }

  minusATM() {
    this.model.minusATM()
    this.view.minusATM()
  }
}

const wrapper = document.getElementById("wrapper")
const view = new View(wrapper)
const model = new Model()
const controller = new Controller(model, view, wrapper)

controller.initial()
