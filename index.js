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

// TWEET LOGS AND TARGET ACCOUNT
const TARGET       = [process.env.FGO_TWITTER_ID,process.env.AZR_TWITTER_ID,process.env.GBF_TWITTER_ID,process.env.FF14_TWITTER_ID];
const OFFICIAL_URL = [process.env.FGO_OFFICIAL_URL,process.env.AZR_OFFICIAL_URL,process.env.GBF_OFFICIAL_URL,process.env.FF14_OFFICIAL_URL];
var tweet_log_all  = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.'];
var tweet_log_fgo  = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist0.'];
var tweet_log_azr  = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist1.'];
var tweet_log_gbf  = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist2.'];
var tweet_log_ff14 = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist3.'];

// MESSEAGE TEXT
const STATUS = '状態：試験運用中\n';
const ABOUT = 'このLINEBOTはTwitter上から特定のゲームの公式アカウントのツイートを取得し、最新5件を表示するBOTです。'
const HINT = 'リッチメニューからゲームタイトルを取得するとタイトル毎、それ以外のメッセージはタイトル区別なしで取得します。'

// LINE REPLY
app.post('/callback', (req, res) => {
  var userText = req.body['events'][0]['message']['text'];
  var tweet_log = ['Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.','Tweet dose not exist.'];
  var replayOptions;

  if(userText == 'ABOUT'){
    // SETTING MESSAGE
    replyOptions = {
      method: 'POST',
      uri   : 'https://api.line.me/v2/bot/message/reply',
      body  : {
        replyToken: req.body.events[0].replyToken,
        messages  : [
          {
            type : 'text',
            text : STATUS + ABOUT + HINT
          }
        ]
      },
      auth: {
        bearer: CH_ACCESS_TOKEN
      },
      json: true
    }
  }else{
    // SWITCH TITLE
    switch (userText){
      case OFFICIAL_URL[0]:
        tweet_log = tweet_log_fgo;
        break;
      case OFFICIAL_URL[1]:
        tweet_log = tweet_log_azr;
        break;
      case OFFICIAL_URL[2]:
        tweet_log = tweet_log_gbf;
        break;
      case OFFICIAL_URL[3]:
        tweet_log = tweet_log_ff14;
        break;
      default:
        tweet_log = tweet_log_all;
        break;
    }

    // SETTING MESSAGE
    replyOptions = {
      method: 'POST',
      uri   : 'https://api.line.me/v2/bot/message/reply',
      body  : {
        replyToken: req.body.events[0].replyToken,
        messages  : [
          {
            type : 'text',
            text : tweet_log[0]
          },
          {
            type : 'text',
            text : tweet_log[1]
          },
          {
            type : 'text',
            text : tweet_log[2]
          },
          {
            type : 'text',
            text : tweet_log[3]
          },
          {
            type : 'text',
            text : tweet_log[4]
          }
        ]
      },
      auth: {
        bearer: CH_ACCESS_TOKEN
      },
      json: true
    }
  }
  
  request(replyOptions, (err, response, body) => {
    console.log(JSON.stringify(response))
  });
  res.send('OK');
});

// GET TWEET
var param = {follow : TARGET[0] + ',' + TARGET[1] + ',' + TARGET[2] + ',' + TARGET[3]}
var stream = TW.stream('statuses/filter', param);
stream.on('data', function (data,err){
  if(TARGET.indexOf(data.user.id_str) >= 0) {
  
    // INTO LOG(ALL)
    tweet_log_all.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
    
    // INTO LOG(TITLE)
    switch (data.user.id_str){
      case TARGET[0]:
        tweet_log_fgo.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
        break;
      case TARGET[1]:
        tweet_log_azr.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
        break;
      case TARGET[2]:
        tweet_log_gbf.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
        break;
      case TARGET[3]:
        tweet_log_ff14.unshift(data.user.name + '\n' + 'https://twitter.com/' + data.user.screen_name + '\n' + data.text);
        break;
    }
    
  }
});

// PORT BINDING
app.listen(process.env.PORT || 3000, () => {
  console.log('STARTING on PORT:' + process.env.PORT)
});
