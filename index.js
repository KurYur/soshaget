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

app.post('/callback', (req, res) => {
  var user_id = req.body['events'][0]['source']['userId'];
  if(targetUser.indexOf(user_id) == -1) {
    targetUser.push(user_id);
  }
  const replyOptions = {
    method: 'POST',
    uri   : 'https://api.line.me/v2/bot/message/reply',
    body  : {
      replyToken: req.body.events[0].replyToken,
      messages  : [{
        type : 'text',
        text : 'HELLO TENTACLE!!'
      }]
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


app.listen(process.env.PORT || 3000, () => {
  console.log('STARTING on PORT:' + process.env.PORT)
});


const TARGET = ['1549889018','2968069742','864400939125415936','92230963'];
var stream = TW.stream('statuses/filter', { track :'1549889018',follow :'2968069742',follow :'864400939125415936',follow :'92230963'});
stream.on('data', function (data,err){
  if(TARGET.indexOf(data.user.id_str) >= 0) {
    const pushOptions = {
      method: 'POST',
      uri   : 'https://api.line.me/v2/bot/multicast/',
      body  : {
        to        : targetUser,
        messages  : [{
          type : 'text',
          text : data.text
        }]
      },
      auth: {
        bearer: CH_ACCESS_TOKEN
      },
      json: true
    }
    request(pushOptions, (err, response, body) => {
      console.log(JSON.stringify(response))
    });
  }
});