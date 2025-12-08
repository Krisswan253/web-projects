const express = require('express')
const parser = require('body-parser')
const multer = require('multer')
const nedb = require('@seald-io/nedb')

const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')

const encodedParser = parser.urlencoded({ extended: true })
const uploadProcessor = multer({ dest: 'public/upload' })

let database = new nedb({
    filename: 'database.txt',
    autoload: true
})

let userdb = new nedb({
    filename: 'userdb.txt',
    autoload: true
})

const app = express()

// APP.USE IS MIDDLEWARE
// THIS HAPPENS IN BETWEEN THE APP BEING SET UP AND THE ROUTES THAT IT RECEIVES
app.use(express.static('public'))
app.use(encodedParser)
// tells the app to receive json data
app.use(parser.json())
app.use(cookieParser())

app.get('/visits', (req, res) => {
    if (req.cookies.visits) {
        let currentVisits = parseInt(req.cookies.visits)
        let addVisits = currentVisits + 1
        let options = {
            expires: new Date(Date.now() + 1000000000)
        }
        res.cookie('visits', addVisits, options)
    } else {
        let randomTime = 10000 * 60 * 60 * 24
        let options = {
            expires: new Date(Date.now() + randomTime)
        }
        res.cookie('visits', 1, options)
    }

    res.sendFile('home.html', { root: 'public' })
})

app.post(
    '/upload',
    uploadProcessor.single('imgUpload'),
    (req, res) => {
        console.log(req.body)
        console.log(req.file)

        // creates an object that keeps track of the time using the date class
        const currentTime = new Date(Date.now())
        console.log(currentTime)

        let data = {
            postText: req.body.text,
            postTime: currentTime.toLocaleString(),
            postTimestamp: currentTime,
            likes: 0,
            imageFilename: req.file ? req.file.filename : null
        }

        database.insert(data, (err, insertedDoc) => {
            if (err) {
                console.log(err)
                res.redirect('/')
            } else {
                console.log(insertedDoc)
                res.redirect('/')
            }
        })
    }
)

app.post('/like', (req, res) => {
    if (req.cookies[req.body.id] == 'liked!') {
        // already liked, just go back
        return res.redirect('/')
    } else {
        res.cookie(req.body.id, 'liked!', {
            expires: new Date(Date.now() + 100000000)
        })

        let query = {
            _id: req.body.id
        }
        let update = {
            $inc: { likes: 1 }
        }
        let options = {}

        database.update(query, update, options, (err, numUpdated) => {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
    }
})

// create a new request to retrieve the info from the database
app.get('/populate-posts', (req, res) => {
    // empty {} means we want to retrieve the entire db
    let query = {}

    database.find(query, (err, data) => {
        if (err) {
            console.log(err)
            return res.json([])
        }
        // we are sending back json response so our front end main.js can parse it
        res.json(data)
    })
})

// this will take in data from main.js and delete a specific post in the database
app.delete('/delete-post', (req, res) => {
    console.log(req.body.id)

    let query = {
        _id: req.body.id
    }

    database.remove(query, {}, (err, numRemoved) => {
        if (err) {
            console.log(err)
        }
        console.log(numRemoved)
        res.redirect('/')
    })
})

app.get('/register', (req, res) => {
    res.sendFile('register.html', { root: 'public' })
})

app.post('/signup', (req, res) => {
    let username = req.body.username
    let password = bcrypt.hashSync(req.body.password, 10)

    let newUser = {
        user: username,
        pass: password
    }

    userdb.insert(newUser, (err, doc) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/register')
    })
})
 app.get('/login')
 app.post ('/authenticate', (req,res) => {

    })
app.listen(6004, () => {
    console.log('app is listening on port 6004')
})
