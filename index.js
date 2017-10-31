// IMPORT MODULES
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Twitter = require('twitter');

// LINE SETTING
const CH_SECRET       = process.env.LINE_CHANNEL_SECRET;
const CH_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const USER_ID         = process.env.LINE_USER_ID;

// TWITTER SETTING
const TW = new Twitter({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:    process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// NEW EXPRESS
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var targetUser = [];
var tweetlog = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.']

app.post('/callback', (req, res) => {
  var userId = req.body['events'][0]['source']['userId'];
  if(targetUser.indexOf(userId) == -1) {
    targetUser.push(userId);
  }
  const replyOptions = {
    method: 'POST',
    uri   : 'https://api.line.me/v2/bot/message/reply',
    body  : {
      replyToken: req.body.events[0].replyToken,
      messages  : [
        {
          type : 'text',
          text : tweetlog[0]
        },
        {
          type : 'text',
          text : tweetlog[1]
        },
        {
          type : 'text',
          text : tweetlog[2]
        },
        {
          type : 'text',
          text : tweetlog[3]
        },
        {
          type : 'text',
          text : tweetlog[4]
        }
      ]
    },
    auth: {
      bearer: CH_ACCESS_TOKEN
    },
    json: true
  }
  request(replyOptions, (err, response, body) => {
    console.log(JSON.stringify(response))
  });
  res.send('OK');
});

const TARGET = ['1549889018','2968069742','864400939125415936','500129008'];
var stream = TW.stream('statuses/filter', {follow :'1549889018',follow :'2968069742',follow :'864400939125415936',follow :'500129008'});
stream.on('data', function (data,err){
  if(TARGET.indexOf(data.user.id_str) >= 0) {
    tweetlog.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('STARTING on PORT:' + process.env.PORT)
});