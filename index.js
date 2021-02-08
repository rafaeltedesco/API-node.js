const express = require('express')
const fs = require('fs')
const app = express()

function readFilePro() {
  return new Promise((resolve, reject)=> {
    fs.readFile('students.json', 'utf-8', (err, data)=> {
      if (err) reject(err)
      resolve(JSON.parse(data))
    })
  })
}



app.use(express.json())


app.get('/', async (req, res)=> {
  let data
  try {
    data = await readFilePro()
  }
  catch (err) {
    throw err
  }
  res.status(200).json(data)
})

function writeFilePro(dataObj) {
  return new Promise((resolve, reject)=> {
    let data = JSON.stringify(dataObj)
    fs.writeFile('students.json', data, err=> {
    if (err) reject(err)
    resolve('ok')
  })

  })
}

app.post('/', async (req, res)=> {
  let data
  try {
    data = await readFilePro()
  }
  catch (err) {
    throw err
  }
  let student = req.body
  data.push(student)
  let result = await writeFilePro(data)
  if (result === 'ok') res.status(201).json(data)

})


app.delete('/:name', async (req, res)=> {
  try {
    let data = await readFilePro()
    data = data.filter(el=> el.name != req.params.name)
    if (!data) {
      res.status(200).json('Esse dado não existe!')
    }
    else {
     let result = await writeFilePro(data)
      if (result === 'ok')  {
      res.status(200).json(data)
      }
    }
  }
  catch (err) {
    throw err
    res.end()
  }

})

app.put('/:name', async (req, res)=> {
  let data
  try {
    data = await readFilePro()
  }
  catch (err) {
    throw err
  }
  let studentIndex = data.indexOf(data.find(el=>el.name==req.params.name))
    data[studentIndex] = req.body
    let result = writeFilePro(data)
    if (result == 'ok') {
      res.status(200).json(data)
    }
    else {
      res.end(JSON.stringify(data))
    }
   
})

app.listen(3000, ()=> {
  console.log('Server up and running')
})