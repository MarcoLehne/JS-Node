require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

var o_url;

// Your first API endpoint
app.post("/api/shorturl", (req, res) => {

  o_url = req.body.url


  if (! (o_url.substring(0,7) === "http://" || 
        o_url.substring(0,8) === "https://")) {
    res.json({error:"invalid url"})  
    
  } else { 
      res.json({
      original_url: o_url,
      short_url: 1
  })};
});
  
app.get("/api/shorturl/1", (req, res) => {
  res.redirect(o_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
