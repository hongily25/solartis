# Solartis

'use strict';
var Alexa = require('alexa-sdk');
var https = require('https');

var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Vietnamese Facts';

/**
 * Array containing space facts.
 */
var FACTS = [
    "The official name of Vietnam is the Socialist Republic of Vietnam.",
    "Vietnam shares a land border with China to the north, Cambodia and Laos to the west.",
    "The capital city of Vietnam is Hanoi, with an estimated population of just under 6.5 million.",
    "Vietnam is the largest exporter of cashew nuts and black pepper in the world with one-third of the global production.",
    "Football (soccer) is the most popular sport in Vietnam, other sports of interest include table tennis, volleyball, badminton, tennis, and martial arts.",
    "Vietnamese food is a blend of Chinese and Thai styles and is considered one of the healthiest cuisines.",
    "The largest city in Vietnam is Ho Chi Minh City with over 7.5 million people.",
    "There are over 92 million people living in Vietnam.",
    "An estimated ten million motor bikes travel on the roads of Vietnam every day.",
    "The Vietnamese language has six different tones.",
    "Vietnam is the world’s second largest coffee producing nation after Brazil.",
    "In a traditional wedding, gifts are placed on a number of round red trays and then covered by a red color paper or cloth.",
    "Vietnam is the only country in the world where people eat animal blood."
];

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
        // Get a random space fact from the space facts list
        var factIndex = Math.floor(Math.random() * FACTS.length);
        var randomFact = FACTS[factIndex];

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

# Account Linking

Auth Code Grant;

Authorization URI https://www.amazon.com/ap/oa
Access Token URI https://api.amazon.com/auth/o2/token
Scope profile

Remember to add redirect urls to app console. 
https://sellercentral.amazon.com/home?cor=login_NA&

https://login.amazon.com/manageApps

