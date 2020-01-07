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
    const person = document.createElement("div")
    person.className = `person${this.id}`
    person.innerHTML = this.id
    return person
  }
}

class ATM extends EventEmitter {
  constructor(number) {
    super()
    this.number = number
    this.state = false
  }
  changeState() {
    this.state = !this.state
  }
}

class Model extends EventEmitter {
  constructor() {
    super()
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
      console.log(this.arrATM)
    }
    return this.arrATM
  }

  // startQueue() {
  //   this.timerId = setInterval(() => {
  //     return this.createPerson()
  //   }, this.randomTime(0.1, 1.0))
  // }

  randomTime(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * 1000
  }

  // This logic I need change!

  addPersonQueue() {
    const newPerson = new Person(this.idPerson)
    this.queue = this.queue.concat(newPerson)
    // this.view.addPersonView(person)
    this.idPerson++
    // if (this.idPerson > 100) {
    //   clearInterval(this.timerId, 0)
    //   this.checkFree2()
    // }
    console.log(this.queue)
    // if person first member
    if (newPerson.id === this.queue[0].id) {
      console.log(this.queue)
      const deletePersonQueue = this.deletePersonQueue(newPerson)
      return deletePersonQueue
    }
    return [newPerson]
  }

  deletePersonQueue(newPerson) {
    let deletePersonQueue
    let currentServeATM
    this.arrATM.forEach(currentATM => {
      if (!currentATM.state && this.queue.length) {
        deletePersonQueue = this.queue.shift()
        currentATM.changeState()
        currentServeATM = currentATM
        setTimeout(
          () => currentATM.changeState(),
          deletePersonQueue.serveTime(1, 3)
        )
      }
    })
    if (!deletePersonQueue && newPerson) {
      console.log(newPerson)
      return [newPerson]
    }
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

//   goToATM(currentServeATM) {
//     this.deletePerson = this.queue.shift()
//     this.view.deletePersonView()
//     currentServeATM.changeState()
//     this.view.goToATM(this.deletePerson, currentServeATM)
//     console.log(this.deletePerson)
//   }

class View extends EventEmitter {
  constructor(wrapper) {
    super()
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
      arrATM.forEach(() => {
        this.createATM()
      })
    }
  }

  createATM() {
    const atm = document.createElement("div")
    atm.className = "atm"
    this.atmBlock.append(atm)
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

  deletePersonView() {
    console.log(this.queue.length)
    if (this.queue.children[0]) {
      this.queue.children[0].remove()
      console.log(this.queue.length)
    }
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

  plusATM() {
    this.createATM()
  }

  minusATM() {
    this.atmBlock.children[this.atmBlock.children.length - 1].remove()
  }
}

class Controller extends EventEmitter {
  constructor(model, view, wrapper) {
    super()
    this.model = model
    this.view = view
    this.wrapper = wrapper
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
    this.createQueue = setInterval(() => {
      const person = this.model.addPersonQueue()
      const [newPerson, currentServeATM] = person
      this.view.addPersonView(newPerson)
      console.log(newPerson)
      console.log(newPerson, currentServeATM)
      this.view.goToATM(newPerson, currentServeATM)
      if (currentServeATM) {
        this.view.deletePersonView()
      }
    }, this.model.randomTime(1, 5))
    this.checkStateATM = setInterval(() => {
      const [deletePerson, currentServeATM] = this.model.deletePersonQueue()
      console.log(deletePerson)
      if (deletePerson) {
        console.log(deletePerson)
        this.view.deletePersonView()
        this.view.goToATM(deletePerson, currentServeATM)
      }
    }, this.model.randomTime(1, 5))
  }

  // startQueue() {
  //   this.createQueue = setInterval(() => {
  //     const person = this.model.addPersonQueue()
  //     const [newPerson, currentServeATM] = person
  //     this.view.addPersonView(newPerson)
  //     console.log(newPerson)
  //     console.log(newPerson, currentServeATM)
  //     this.view.goToATM(newPerson, currentServeATM)
  //     if (currentServeATM) {
  //       this.view.deletePersonView()
  //     }
  //   }, this.model.randomTime(1, 5))
  //   // this.checkStateATM = setInterval(() => {
  //   //   const [deletePerson, currentServeATM] = this.model.deletePersonQueue()
  //   //   console.log(deletePerson)
  //   //   if (deletePerson) {
  //   //     console.log(deletePerson)
  //   //     this.view.deletePersonView()
  //   //     this.view.goToATM(deletePerson, currentServeATM)
  //   //   }
  //   // }, this.model.randomTime(1, 5))
  // }

  startQueue() {
    let count = 0
    const self = this
    this.createQueue = setTimeout(function f() {
      console.log(count)
      const person = self.model.addPersonQueue()
      const [newPerson, currentServeATM] = person
      self.view.addPersonView(newPerson)
      console.log(newPerson)
      console.log(newPerson, currentServeATM)
      self.view.goToATM(newPerson, currentServeATM)
      if (currentServeATM) {
        self.view.deletePersonView()
      }
      count++
      if (count === 10) clearTimeout(this.createQueue, 0)
      setTimeout(f(), this.model.randomTime(3, 10))
      return
    }, this.model.randomTime(1, 2))
  }

  stopProgram() {
    clearTimeout(this.createQueue, 0)
    clearInterval(this.checkStateATM, 0)
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
