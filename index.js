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
  serveTime(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * 2000
  }
  viewPerson() {
    this.person = document.createElement("div")
    this.person.className = `person${this.id}`
    this.person.innerHTML = this.id
    return this.person
  }
}

const wrapper = document.getElementById("wrapper")
class Controller {
  constructor(model, wrapper) {
    this.wrapper = wrapper
    this.model = model
  }
  initial() {
    this.buttonStart = wrapper.querySelector(".start")
    this.buttonStart.addEventListener("click", () => this.startQueue())

    this.buttonStop = wrapper.querySelector(".stop")
    this.buttonStop.addEventListener("click", () => this.stopQueue())

    this.buttonPlusATM = wrapper.querySelector(".plusATM")
    this.buttonPlusATM.addEventListener("click", () => this.model.plusATM())

    this.buttonMinusATM = wrapper.querySelector(".minusATM")
    this.buttonMinusATM.addEventListener("click", () => this.model.minusATM())
  }

  startQueue() {
    this.model.stopQueue()
    this.model.createATM()
    this.model.startQueue()
  }

  stopQueue() {
    this.model.stopQueue()
  }
}
class Model {
  constructor(view) {
    this.view = view
    this.queue = []
    this.idPerson = 1
    this.amountATM = 3
    this.arrATM = []
    this.numberATM = 1
  }

  createATM() {
    for (let i = 0; i < this.amountATM; i++) {
      this.arrATM = this.arrATM.concat([new ModelATM(this.numberATM++)])
    }
    this.view.createFirstATM(this.arrATM)
  }

  startQueue() {
    this.timerId = setInterval(() => {
      this.createPerson()
    }, this.randomTime(1, 3))
  }

  randomTime(min, max) {
    let rand = min + -0.5 + Math.random() * (max - min + 1)
    return Math.round(rand) * 1000
  }

  createPerson() {
    const person = new Person(this.idPerson)
    this.queue = this.queue.concat(person)
    this.view.addPersonView(person)
    this.idPerson++
    if (this.idPerson > 100) {
      clearInterval(this.timerId, 0)
      this.checkFree2()
    }
    console.log(this.queue)
    // if queue have first member
    if (this.queue.length) {
      this.checkFree()
    }
  }

  checkFreeBase(currentServeATM) {
    this.deletePerson = this.queue.shift()
    this.view.deletePersonView()
    currentServeATM.changeState()
    this.view.goToATM(this.deletePerson, currentServeATM)
    console.log(this.deletePerson)
  }

  checkFree() {
    this.arrATM.forEach(currentATM => {
      if (!currentATM.state && this.queue[0]) {
        this.checkFreeBase(currentATM)
        setTimeout(() => currentATM.changeState(), this.deletePerson.serveTime(1, 2))
      }
    })
    console.log(this.queue)
  }

  checkFree2() {
    if (this.queue.length) {
      const timerId = setInterval(() => {
        this.arrATM.forEach(item => {
          if (!item.state && this.queue[0]) {            
            this.checkFreeBase(item)
            setTimeout(() => item.changeState(), this.deletePerson.serveTime(1, 2))
            console.log(this.queue)
            if (!this.queue.length) {
              clearInterval(timerId, 0)
              // this.clearModel()
            }
          }
        })
      })
    }
  }

  stopQueue() {
    clearInterval(this.timerId, 0)
    this.clearModel()
    console.log(this.arrATM)
    this.view.deleteBlocks()
    this.view.createBlockATM()
    this.view.createBlockQueue()
  }

  plusATM() {
    this.arrATM = this.arrATM.concat([new ModelATM(this.numberATM++)])
    
    console.log(this.arrATM)
    this.view.plusATM(this.arrATM)
  }

  minusATM() {
    if(this.arrATM[0]) {
      this.arrATM.pop()
    this.numberATM--    
    this.view.minusATM(this.arrATM)
    console.log(this.numberATM)
    }   
  
  }

  clearModel() {
    console.log(this)
    this.queue = []
    this.idPerson = 1
    this.amountATM = 3
    this.arrATM = []
    this.numberATM = 1
  }
}

class View {
  constructor(wrapper) {
    this.wrapper = wrapper
  }

  start() {
    this.buttons = document.createElement("div")
    this.buttons.className = "buttons"
    this.wrapper.appendChild(this.buttons)
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

  createFirstATM(arrATM) {
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

  addPersonView(newPerson) {
    this.queue.append(newPerson.viewPerson())
  }

  goToATM(person, currentServeATM) {
    for (let i = 0; i < this.atmBlock.children.length; i++) {
      this.atmBlock.children[i].classList.remove("currentATM")
    }
    this.atmBlock.children[currentServeATM.number - 1].classList.add(
      "currentATM"
    )
    this.atmBlock.children[currentServeATM.number - 1].innerText = person.id
  }

  deleteBlocks() {
    this.atmBlock.remove()
    this.queue.remove()
  }

  deletePersonView() {
    this.queue.children[0].remove()
  }

  plusATM() {
    this.createATM()
  }

  minusATM() {    
    this.atmBlock.children[this.atmBlock.children.length - 1].remove()
  }
}

const view = new View(wrapper)
const model = new Model(view)
const controller = new Controller(model, wrapper)

view.start()
controller.initial()


// 1. Сделать событие, если стэйт банкомата фолс, запускается проверка если кто в очереди и если есть то удаление первого человека из очереди
// 2. при создание очереди запускать проверку, какой номер у вновь пришедшего и если он первый то запускать проверку свободных банкоматов