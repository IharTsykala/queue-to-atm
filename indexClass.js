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
  viewPerson() {   
    const person = document.createElement('div')
    person.className = `person${this.id}`
    person.innerHTML = this.id 
    return person
  }
}

const wrapper = document.getElementById('wrapper')
class Controller {
  constructor(model, wrapper) {
    this.wrapper = wrapper   
    this.model = model
  }
  start() {
    this.buttonStart = wrapper.querySelector('.start')     
    this.buttonStart.addEventListener("click", () => this.startQueue())
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
    this.idPerson = 1
    this.arrATM = [0,0,0]
    this.numberATM = 1
  }
  startQueue() {   
    this.timerId = setInterval(() => {
      this.createPerson()      
    }, Math.random() * 1000)   
  }

  createATM() {
    this.arrATM = this.arrATM.map(() => new ModelATM(this.numberATM++))
    this.view.createATM(this.arrATM)
  }

  createPerson() {
    const person = new Person(this.idPerson)
    this.queue = this.queue.concat(person)
    this.view.addPersonView(person)
    this.idPerson++
    if (this.idPerson > 20) {
      clearInterval(this.timerId, 0)
      this.checkFree2()
    }
    console.log(this.queue)
    if(this.queue.length) {
    
    this.checkFree()
    }
  }

  checkFreeBase (item) {
    const deletePerson = this.queue.shift()
    this.view.deletePersonView(deletePerson)
    item.changeState()
    this.view.serveATM(deletePerson, item)
    console.log(deletePerson)
  }

  checkFree () {        
        this.arrATM.forEach(item => {
          if (!item.state && this.queue[0]) {                
            this.checkFreeBase(item)
            setTimeout(() => item.changeState(), 3000)
          }
        })
        console.log(this.queue)           
  }

  clearModel() {
    this.queue = []
    this.idPerson = 1
    this.arrATM = [0,0,0]
    this.numberATM = 1
  }

  checkFree2 ()  {
    if (this.queue.length) {
      const timerId = setInterval(() => {
        this.arrATM.forEach(item => {
          if (!item.state && this.queue[0]) {
            this.checkFreeBase(item)
            setTimeout(() => item.changeState(), 3000)
            console.log(this.queue)
            if (!this.queue.length) {
              clearInterval(timerId, 0)
              this.clearModel()
            }
          }     
        })      
      })
    }
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
    this.buttonStart = document.createElement('button')
    this.buttonStart.className = 'start'    
    this.buttons.append(this.buttonStart)
    this.buttonStart.innerText = 'Start'
    this.buttonStop = document.createElement('button')
    this.buttonStop.className = 'stop'
    this.buttons.append(this.buttonStop)
    this.buttonStop.innerText = 'Stop'

    this.atmBlock = document.createElement("div")
    this.atmBlock .className = "atmBlock"
    wrapper.appendChild(this.atmBlock )

    this.queue = document.createElement("div")
    this.queue.className = "queue"
    wrapper.appendChild(this.queue)
  }

  createATM(arrATM) {    
    if(!this.atmBlock.children.length) {
      arrATM.forEach(()=> {        
        const atm = document.createElement('div')
        atm.className = 'atm'
        this.atmBlock.append(atm)
      } )
    }    
    }

  addPersonView(newPerson) {   
  const person = newPerson
  this.queue.append(person.viewPerson())
  }

  deletePersonView() {    
    this.queue.children[0].remove();
  }

  serveATM(person, currentATM) {    
    for(let i = 0; i < this.atmBlock.children.length; i++) {
      this.atmBlock.children[i].classList.remove("currentATM")
      // this.atmBlock.children[i].innerText='free'
    } 
    this.atmBlock.children[currentATM.number-1].classList.add("currentATM")
    this.atmBlock.children[currentATM.number-1].innerText=person.id
 } 
}

const view = new View(wrapper)
const model = new Model(view)
const controller = new Controller(model, wrapper)

view.start()
controller.start()
