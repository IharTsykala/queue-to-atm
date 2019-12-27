let queue = [];
let id = 1;
let arrATM = [0];

const serveClient = ()=> {
  const deletePerson = queue.shift()
}
class ModelATM {
  constructor(number) {
    this.number = number;
    this.state = false;
  }
  changeState() { 
    this.state=!this.state
  }

checkFreeBase =()=> {   
    const deletePerson = queue.shift()
    item.changeState()
    console.log(deletePerson)
}

  checkFree = ()=> {   
    arrATM.forEach((item)=>{     
      if(!item.state) {      
        this.checkFreeBase()
       setTimeout(()=>item.changeState(),1000)     
      }    
    }) 
    console.log(queue)  
  }

  checkFree2 = ()=> {
    if(queue.length) {
      if(queue.length) {
        const timerId = setInterval(()=>{
          arrATM.forEach((item)=>{     
            if(!item.state) { 
            checkFreeBase(item)          
            setTimeout(()=>item.changeState(),2000)
            if(!queue.length) clearInterval(timerId, 0)   
            }    
          })   
      })     
       }
     } 
  }
}

const createATM = ()=> {  
  arrATM = arrATM.map(()=>new ModelATM)    
}

createATM();
class Person {
  constructor(id) {
    this.id = id
  }
  serveTime() {   
    return Math.random() * 1000
  }
}

class App {
  constructor() {
    let queue = []
    let id = 1
    let arrATM = [0];
  }

  createATM = ()=> {  
    arrATM = arrATM.map(()=>new ModelATM)    
  } 

}

checkFreeBase =(item)=> {   
  const deletePerson = queue.shift()
  item.changeState()
  console.log(deletePerson)
}

const checkFree = (end)=> {   
  arrATM.forEach((item)=>{     
    if(!item.state) { 
      checkFreeBase(item)          
     setTimeout(()=>item.changeState(),2000)     
    }    
  }) 
  console.log(queue)  
}

const checkFree2 = ()=> {
  if(queue.length) {
    const timerId = setInterval(()=>{
      arrATM.forEach((item)=>{     
        if(!item.state) { 
        checkFreeBase(item)          
        setTimeout(()=>item.changeState(),2000)
        if(!queue.length) clearInterval(timerId, 0)   
        }    
      })   
  })     
   }
}

const createPerson = () => {
  queue = queue.concat(new Person(id))
  id++
  if (id > 10) {
    clearInterval(timerId, 0)     
      checkFree2()  
    }  
  console.log(queue)
  checkFree();
}

let timerId = setInterval(() =>  {
  createPerson()
}, (Math.random() * 1000))