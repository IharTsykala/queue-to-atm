function setBase(a) {
  let count = 0
  return function(b) {
    count = count + b
    return count + a
  }
}

const inc = setBase(10)

console.log(inc(5))
console.log(inc(1))
console.log(inc(8))
console.log(inc(10))

const obj = {
  name: "Joe",
  address: {
    city: "NYC",
    street: "street"
  },
  schools: ["sc.n1", "sc.n2", { name: "vasya" }],
  wife: null
}

function flattenObj(obj) {
  const arr = Object.values(obj).reduce((acc, item) => {
    if (typeof item === "string") {
      return acc.concat(item)
    }
    if (item === null) {
      return acc.concat(null)
    }
    return acc.concat(flattenObj(item))
  }, [])
  return arr
}
console.log(flattenObj(obj))
