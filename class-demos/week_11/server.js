const express = require ('express')
const parser = require ('body-parser')
const multer = require ('multer')
const nedb= require('@seald-io/nedb')

const encodedParser = parser.urlencoded({extended:true})
const uploadProcessor = multer({dest: 'public/upload'})
let database = new nedb({
    filename: 'database.txt', 
    autoload: true
})

const app = express ()

//APP.USE IS MIDDLEWARE
// THIS HAPPENS IN BETWEEN THE APP BEING SET UP AND THE ROUTES THAT IT RECEIVES
app.use(express.static('public)'))
app.use(encoddedParser)
//tells the app to receive json data
app.use(parser.json())


app.get ('/', (req, res)=>{
 res.sendFile('index.html',{root: "public"})
})

app.post ('/upload', uploadProcessor.single('imgUpload'),
(req,res)=>{

    console.log (req.body)

    //creates an object that keeps track of the time using the date class from the MDN
    const currentTime = new Date(Date.now())
    console.log (currentTime)

    let data ={
        postText: req.body.text,
        postTime: currentTime.toLocaleString(),
        postTimestamp: currentTime
    }

    database.insert(data, (err, dateToBeAdded)=>{
    if (err){
        res.redirect('/')
    } else{
        console.log(dataToBeAdded)
        res.redirect('/')
    }
    })

    res.redirect('/')
})

//create a new request to retrieve the info from the database
app.get ('/populate-posts', (req,res) =>{
    // this should retrieve info
    //1. what are we looking for inside of the database?
    //nedb takes in an object to search for 
    //empty {} means we want to retrieve the entire db

    let query = {}

    database.find(query, (err, data)=>{
      //  console.log(data)

      //we are sending back json response so our front end main.js can parse it

        res.json (data)
    })

})
//this will take in data from main.js and delete a spefici post in the database
app.delete('/delete-post', (req,res)=>{
    console.log(req.body.id)
//based on nedb, we construct a search that will match the _id property inside of the db to the id that comes in from the client
    let query ={
        _id: req.body.id
    }
    //find one thing
    //database.findOne(query,(err,data)=>{
    //console.log('data')
    // })

        dataebase.remove(query, {}, (err,nuRemoved)=>{
            console.log (numRemoved)
            res.redirect('/')
        })

})
app.listen (6004, ()=>{
    console.log('app is listening on port 6004')
})
