require('dotenv').config();
//require bodyparser
var bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
//require http validation
const isUrlHttp = require('is-url-http');
//require mongoose
var mongoose = require('mongoose');
//require("./models/shortUrl");
const app = express();
//require dns to validate url 
const dns = require('dns');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//connect to mongodb - changed from using secret to mongo url
mongoose.connect('mongodb+srv://hlittlefield:Tonkatruck4!@cluster0.tlijw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true}, {useUnifiedTopology: true});

//use bodyparser middleware to handle post req
app.use(bodyParser.urlencoded({extended: false}));

//connect schema to mongoose 
const Schema = mongoose.Schema;
//create schema for db with properties 
const urlSchema = new Schema({
  inputUrl: String, 
  shorterUrl: Number,
});

//create instance of the schema, aka the 'table' for data
const Links = mongoose.model("Links", urlSchema);


app.post('/api/shorturl', function(req,res){
  //use url input id from index.html
  var inputUrl = req.body.url;
  //shorter url created using tinyurl npm
  //if else statement to check if url is valid
  if (isUrlHttp(inputUrl) === !true){
    //throw error if invalid
    res.json({error:"invalid url"});
  }
    else{
     Links.create(
      {inputUrl: inputUrl,
      shorterUrl: Math.floor(Math.random()*100)})
      .then(result=> res.json({original_url:result.inputUrl, short_url: result.shorterUrl}))
    }
})

app.get('/api/shorturl/:short_url', function(req,res){
  const input_url = req.params.short_url
  console.log(input_url)
  Links.findOne({shorterUrl:input_url}, function(err, result){
  res.redirect(result.inputUrl)
  console.log(result)
  })
});
