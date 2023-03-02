// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();
const date = require('date-and-time');
const day_of_week = require('date-and-time/plugin/day-of-week');
date.plugin(day_of_week)

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// app.get("/api", (req,res) => {
//   res.json({greetings:"hi")
// })


// your first API endpoint... 
app.get("/api/:msOrDate?", (req, res) => {

  const dateRegex = /[0-9]{1,4}\-[0-9]{1,2}\-[0-9]{1,2}/
  const validMs = /\-?[0-9]+/
  const unixDate = date.parse("1970-01-01", "YYYY MM DD")

  var dateNow; // Date object
  var dateString; // formatted Date Obj as string
  var diffInMs; // number

  // if date is not defined
  if (req.params.msOrDate === undefined) {

    dateNow = new Date()
    dateString = `${String(date.format(dateNow, "ddd, DD MMM YYYY HH:mm:ss"))} GMT`
    
    diffInMs = date.subtract(dateNow, unixDate).toMilliseconds()
    
    res.json({ unix: diffInMs, utc: dateString })
    
    // if user variable in url is a date
  } else if (! isNaN(new Date(req.params.msOrDate))) {
    
    dateNow = new Date(req.params.msOrDate)
    dateString = `${String(date.format(dateNow, "ddd, DD MMM YYYY HH:mm:ss"))} GMT`

    diffInMs = date.subtract(dateNow, unixDate).toMilliseconds()

    res.json({ unix: parseInt(diffInMs), utc: dateString })

    // valid ms
  } else if (validMs.test(req.params.msOrDate)) {

    dateNow = unixDate
    dateNow = date.addMilliseconds(dateNow, parseInt(req.params.msOrDate, 10))
    dateString = `${String(date.format(dateNow, "ddd, DD MMM YYYY HH:mm:ss"))} GMT`

    res.json({ unix: parseInt(req.params.msOrDate, 10), utc: dateString })

    // invalid date
  } else {
    res.json({ error: "invalid Date" })
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
