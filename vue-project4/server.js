const express = require('express')
const path = require('path')

const app = express()

// serve Vue dist folder
app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const port = 5001
app.listen(port, () => {
  console.log('Server running on port ' + port)
})
