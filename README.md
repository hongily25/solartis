# Solartis
```
'use strict';
var Alexa = require('alexa-sdk');
var https = require('https');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Vietnamese Facts';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'GetNewFactIntent': function () {
        this.emit('GetFact');
    },
    'GetFact': function () {
        var alexasdk = this;

        // Create speech output
        var speechOutput = "Here's your fact: " + randomFact;
       // speechOutput = this.event.session.user.accessToken;
        var options = {
          host: 'api.amazon.com',
          path: '/user/profile?access_token=' + this.event.session.user.accessToken
        };
        
       https.get('https://api.amazon.com/user/profile?access_token=' + this.event.session.user.accessToken, 
       function(res){
            var str = '';
            console.log('Response is '+res.statusCode);
    
            res.on('data', function (chunk) {
                   str += chunk;
             });
    
            res.on('end', function () {
                 console.log(str);
                 var string = JSON.parse(str);
                 alexasdk.emit(':tell', string.user_id)
             });
       });

    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = "You can say tell me a Vietnamese fact, or, you can say exit... What can I help you with?";
        var reprompt = "What can I help you with?";
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};
```
# Account Linking

Auth Code Grant;

Authorization URI https://www.amazon.com/ap/oa
Access Token URI https://api.amazon.com/auth/o2/token
Scope profile

Remember to add redirect urls to app console. 
https://sellercentral.amazon.com/home?cor=login_NA&

https://login.amazon.com/manageApps

