'use strict';

// twitter連携情報
const Twitter = require('twitter');
const tw = new Twitter({
  consumer_key: ', // Consumer Key
  consumer_secret: '', // Consumer Secret
  access_token_key: '', // Access Token
  access_token_secret: '' // Access Token Secret
});

// LINE連携情報
const HOST = 'api.line.me';
const CH_SECRET = ''; // Channel Secretを記述
const CH_ACCESS_TOKEN = ''; // Channel Access Tokenを記述
const USER_ID = ''; // Your userIdを記述
const PUSH_PATH = '/v2/bot/message/multicast';
const SIGNATURE = crypto.createHmac('sha256', CH_SECRET);
const PORT = 3000;

const pushClient = (userId, SendMessageObject) => {
    let postDataStr = JSON.stringify({ to: userId, messages: SendMessageObject });
    let options = {
        host: HOST,
        port: 443,
        path: PUSH_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'X-Line-Signature': SIGNATURE,
            'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };

    return new Promise((resolve, reject) => {
        let req = https.request(options, (res) => {
                    let body = '';
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        resolve(body);
                    });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.write(postDataStr);
        req.end();
    });
};
const TARGET = ['1549889018','2968069742','864400939125415936']
var stream = tw.stream('statuses/filter', { track :'1549889018',follow :'2968069742',follow :'864400939125415936'});
stream.on('data', function (data,err){
  if(TARGET.indexOf(data.user.id_str) >= 0) {
        let PushSendMessageObject = [{
          type: 'text',
          text: data.user.name + '\n' + data.text
        }];

        pushClient([USER_ID], PushSendMessageObject)
          .then((body) => {
            console.log(body);
          }, (e) => {console.log(e)});

        console.log(data.user.name + '\n' + data.text);

  }
});