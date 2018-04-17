const WebSocket = require('ws');
const request = require('request');

module.exports = (token) => callback => {
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
};
