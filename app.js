const express = require('express')
const cors = require('cors')
const app = express()
const loggerMiddleware = require('./middlewares/loggerMiddleware.js')
const notFoundMiddleware = require('./middlewares/notFound.js')
const errorHandler = require('./middlewares/errorHandler.js')
const ricetteRouters = require('./routes/ricette.js')
app.use(express.static('public'))

const ricette = require('./database/db.js')
app.use(cors())
const corsOperetor = {
    origin: 'http://localhost:5174/',
    operetorStatus: 200
    // Create a function if i wanna only route active
}

const PORT = process.env.PORT
const HOST = process.env.HOST

app.use(express.json())

app.listen(PORT, () => {

    console.log(`${HOST}:${PORT}`);
})
// to create ad error

// app.use('/ricette', (req, res, next)=> {
//     throw new Error("you broke everything dude!")
// })

app.use('/ricette', loggerMiddleware)

app.use('/ricette', ricetteRouters)

app.get('/',  (req, res) => {
    console.log( req.query);
    
})

// app.use('/', (req, res) => {
//     res.status(200).send('<h1>Le ricette</h1>')
// })
app.use(errorHandler)
app.use(notFoundMiddleware)

//  app.get('/filtra/:tags',(req, res) =>{

//     const ricetteTags = ricette.filter( ricetta => ricetta.tags.includes(req.params.tags) )
//     if (!ricetteTags) {
//         return res.status(404).json({error: 'nessun tags presente'})        
//     }
//     return res.status(200).json({ tags : ricetteTags})
    
// })
 