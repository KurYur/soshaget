// IMPORT MODULES
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

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
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/callback', (req, res) => {
  const options = {
    method: 'POST',
    uri   : 'https://api.line.me/v2/bot/message/reply',
    body  : {
      replyToken: req.body.events[0].replyToken,
      messages  : [{
        type : 'text',
        text : "HELLO TENTACLE!!"
      }]
    },
    auth: {
      bearer: CH_ACCESS_TOKEN
    },
    json: true
  }
  request(options, (err, response, body) => {
    console.log(JSON.stringify(response))
  })
  res.send('OK')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('STARTING on PORT:' + process.env.PORT)
})