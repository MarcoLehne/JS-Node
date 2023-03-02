const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const date = require('date-and-time');
const day_of_week = require('date-and-time/plugin/day-of-week');

date.plugin(day_of_week)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: true }));

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  log: {
    type: Array
  }
})

let User = mongoose.model("User", userSchema);

app.post("/api/users", (req, res) => {
  User.create({username : req.body.username}, (err, self) => {
    if (err) return handleError(err);
    res.json({username: self.username, _id : self._id}) 
  })
})

app.get("/api/users", (req,res) => {
  User.find({}, (err,docs) => {
    if (err) return handleError(err);
    res.json(docs);
  });
});

function parseDate(dateString) {
  
  if (dateString === "" || dateString === undefined) {
    dateString = new Date()
  } else {
    dateString = date.parse(dateString, "YYYY-MM-DD")
  }
  
  return String(date.format(dateString, "ddd MMM DD YYYY"))
}

app.post("/api/users/:_id/exercises", (req,res) => {
  User.findOne({_id:req.params._id},
                        (err,self) => {
    if (err) return handleError(err);                          
    let date = parseDate(req.body.date);
                                                   
    self.log.push({
      description: req.body.description,
      duration: parseInt(req.body.duration,10),
      date: date
    });
    self.save((err, updatedUser) => {
      if (err) return console.error(err);
      res.json({_id:self._id,
              username: self.username, 
              date: date,
              duration: parseInt(req.body.duration,10),
              description: req.body.description
             });
    })
})});

function limitLog(array, from, to, limit) {

  console.log(limit, from, to)
  
}

app.get("/api/users/:_id/logs", (req,res) => {
  const {from, to, limit} = req.query

  limitLog([], limit, from, to)
  
  User.findById(req.params._id, (err,self) => {
    if (err) return handleError(err);

    let actualLog
    
    res.json({
      _id:self.id,
      username:self.username,
      count:self.log.length,
      log: limit? self.log.slice(0, limit): self.log
    });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
