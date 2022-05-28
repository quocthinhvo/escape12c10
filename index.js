var express = require('express');
const url = require('url')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var morgan = require("morgan")
var cors = require('cors')
const getEnv = require('dotenv').config()
var app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan("common"))

const port = process.env.PORT || 3000

var whitelist = ['https://escape12c10.herokuapp.com', 'https://www.quocthinhvo.dev']
var corsOptions = {
   origin: function (origin, callback) {
     if (whitelist.indexOf(origin) !== -1) {
       callback(null, true)
     } else {
       callback(new Error('Not allowed by CORS'))
     }
   }
 }

mongoose.connect(process.env.DBSTR);
var winnerSchema = mongoose.Schema({
   name: String,
   time: Number,
   date: String
});
var Winner = mongoose.model("winner", winnerSchema);

app.get('/', function(req, res){
   res.send({
      "message": "REST API zone"
   }).status(200)
});

app.post('/add', cors(corsOptions), function (req, res) {
   let datetime = new Date();
   let winnerData = req.body;
   if (!winnerData.name || !winnerData.time) {
      res.send({
         "message": "Wrong data"
      }).status(403)
   } else 
   {
      let winner = new Winner({
         name: winnerData.name,
         time: winnerData.time,
         date: datetime.toISOString().slice(0,10)
      })
      winner.save(function (err){
         if (err) {
            res.send({
               "message": "error",
               "content": err
            }).status(500)
         } else res.redirect(301, "https://quocthinhvo.dev/escape12c10");
      })
   }
})

app.get("/ranks",cors(corsOptions), function (req, res) {
   let top = req.query.top
   Winner.find()
   .limit(top)
   .sort({
      time: 1
   })
   .then((result)=>{
      res.status(200).send(result)
   })
   .catch((err)=>{
      res.status(500).send({message: "Some error with database"})
   })
})

app.get("/user/:username", cors(corsOptions), function (req, res) {
   let username = req.params.username
   let num = 10;
   num = req.query.num;
   Winner.find()
   .find({
      name: username
   })
   .limit(num)
   .then((result)=>{
      res.status(200).send(result)
   })
   .catch((err)=>{
      res.status(500).send({message: "Some error with database"})
   })
})
app.listen(port);