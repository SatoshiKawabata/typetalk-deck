const WebSocket = require('ws');
const request = require('request');
const {
  client_id,
  client_secret
} = require('./../secret.json');

if (!(client_id && client_secret)) {
  console.log("You should set environments with TYPETALK_CLIENT_ID and TYPETALK_CLIENT_SECRET")
  process.exit(1);
}

function getAccessToken(callback) {
  const options = {
    url: "https://typetalk.in/oauth2/access_token",
    method: 'POST',
    headers:  {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'client_id': client_id,
      'client_secret': client_secret,
      'grant_type': 'client_credentials'
    }
  }

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(error, JSON.parse(body)['access_token']);
    } else {
      callback(error);
    }
  });
}

module.exports = callback => {
  getAccessToken(function(error, token) {
    if (error) {
      console.log('Failed to get an access token.');
      console.log(error);
      process.exit(1);
    }

    const ws = new WebSocket("https://typetalk.in/api/v1/streaming", {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    ws.on('open', function() {
      console.log('connected streaming server');
    }).on('close', function() {
      console.log('disconnected streaming server');
    }).on('message', function(data, flags) {
      console.log(data);
      callback(data);
    });
  });
};
