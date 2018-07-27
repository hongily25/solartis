/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
var http = require('http');
var https = require('https');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.6835eb43-0b6d-40dc-813c-42cda1fad474';

var urlPrefix = 'http://solartis.herokuapp.com/amazon/';

const SKILL_NAME = 'Policy Pal';
const PROMPT = 'What would you like to know about?';
const REPROMPT = 'What else would you like to know about?';
const REPEAT = 'Please say that again';
const HELP_MESSAGE = 'You can ask about your policy, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
var data = {
  "EndClientUserUniqueSessionId": "Uniquesession",
  "ServiceRequestDetail": {
    "OwnerId": "27",
    "ResponseType": "JSON",
    "UserName": "CWAgent",
    "Token": "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",
    "BrowserIp": "127.0.0.1",
    "ServiceRequestVersion": "1.0",
    "RegionCode": "US"
  },
  "Policy": {
    "ProgramName": "Healthcare",
    "PolicyType": "Individual",
    "ZipCode": "35005",
    "State": "AL",
    "EffectiveDate": "2018-08-14",
    "EventName": "PLICalculateRate",
    "EventVersion": "2.2.2.1",
    "ApplicableFromDate": "2018-08-14",
    "NumOfProviders": "1",
    "SharedOrSeparateLimit": "Shared",
    "PLOrWLCoverageType": "Claims-Made",
    "ProfessionalLiabilityLimitsOfInsurance": "$1M/$3M",
    "WorkplaceLiabilityLimitsOfInsurance": "$2M/$6M",
    "WorkplaceLiabilityInsurance": "Yes",
    "CorporationOrPartnershipCoverage": "Yes",
    "AdditionalInsuredCoverage": "Yes",
    "EmploymentCategory": "Employed",
    "TransitionFactor": "10",
    "ProductNumber": "HC_PLI",
    "ProductVerNumber": "2.0",
    "ExpensesInsideOrOutside": "Inside",
    "DeductibleAmount": "500",
    "NumberOfClaimsinPast5Yrs": "2",
    "TotalReportedIncurredLossandExpense": "2000000",
    "RetroDate": "Inception",
    "Revenue": "200000",
    "ResidentialOrCommercialBusinessModifier": "10",
    "ProjectSizeModifier": "10",
    "WrittenContractsModifier": "10",
    "RiskManagementModifier": "10",
    "FinancialStrength": "10",
    "UseofSubcontractors": "10",
    "HistoryofDisciplinaryAction": "10",
    "MergersandAcquisitions": "10",
    "ExperienceofPrincipals": "10",
    "ClientSize": "100",
    "RequireSubstoShowProofOfEAndO": "10",
    "RequireAandEstoShowProofOfEandO": "10",
    "KYLocalGovernmentTaxRate": "20",
    "KYLocalGovernmentTaxOverridden": "No",
    "Provider": [
      {
        "ProviderDetail": {
          "FirstName": "Robert",
          "MiddleInitial": "",
          "LastName": "Sled",
          "ProviderClass": "Athletic Trainer",
          "ProfessionalAssociation": "Licensed",
          "YearsOfPolicy": "1",
          "YearsInPractice": "1",
          "RiskManagementDiscount": "Yes",
          "PatientCompensationFund": "No",
          "HoursWorkPerWeek": "25",
          "ScheduleRatingFactor": "25",
          "ProviderEmailId": "john@gmail.com",
          "MeetsStudentQualification": "Yes",
          "UseofWrittenContractsFactor": "10",
          "TrainingorEducationFactor": "10",
          "ProfessionalReputationFactor": "10",
          "NatureofOperationsFactor": "10"
        }
      }
    ]
  },
  "OwnerId": "27"
};

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        var alexasdk = this;
        if (this.event.session.user.accessToken) {
            https.get('https://api.amazon.com/user/profile?access_token=' + this.event.session.user.accessToken, 
            function(res){
                var str = '';
                console.log('Response is '+ res.statusCode);

                res.on('data', function (chunk) {
                    str += chunk;
                });
              
                res.on('end', function () {
                    var userData = JSON.parse(str);
                    getPolicy(userData.user_id, function(){
                        alexasdk.emit(':ask', PROMPT, REPEAT);
                    });
                });
            });
        } else {
            alexasdk.emit(':tell', 'Please link your amazon account in the Alexa app.', 'Please link your amazon account in the Alexa app.');
        }
    },
    'ProgramNameIntent': function () {
        const speechOutput = 'Your program name is ' + data.Policy.ProgramName;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'PolicyTypeIntent': function () {
        const speechOutput = 'Your policy type is ' + data.Policy.PolicyType;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ZipCodeIntent': function () {
        const speechOutput = 'Your zip code is ' + data.Policy.ZipCode;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'StateIntent': function () {
        const speechOutput = 'Your state is ' + data.Policy.State;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'EffectiveDateIntent': function () {
        const speechOutput = 'Your effective date is ' + data.Policy.EffectiveDate;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'EventNameIntent': function () {
        const speechOutput = 'Your event name is ' + data.Policy.EventName;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'EventVersionIntent': function () {
        const speechOutput = 'Your event version is ' + data.Policy.EventVersion;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ApplicableFromDateIntent': function () {
        const speechOutput = 'Your applicable from date is ' + data.Policy.ApplicableFromDate;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'NumOfProvidersIntent': function () {
        const speechOutput = 'Your number of providers is ' + data.Policy.NumOfProviders;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'SharedOrSeparateLimitIntent': function () {
        const speechOutput = 'Your shared or separate limit is ' + data.Policy.SharedOrSeparateLimit;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'PLOrWLCoverageTypeIntent': function () {
        const speechOutput = 'Your coverage type is ' + data.Policy.PLOrWLCoverageType;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ProfessionalLiabilityLimitsOfInsuranceIntent': function () {
        const speechOutput = 'Your professional liability limits of insurance is ' + data.Policy.ProfessionalLiabilityLimitsOfInsurance;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'WorkplaceLiabilityLimitsOfInsuranceIntent': function () {
        const speechOutput = 'Your workplace liability limits of insurance is ' + data.Policy.WorkplaceLiabilityLimitsOfInsurance;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'WorkplaceLiabilityInsuranceIntent': function () {
        const speechOutput = 'Your workplace liability insurance is ' + data.Policy.WorkplaceLiabilityInsurance;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'CorporationOrPartnershipCoverageIntent': function () {
        const speechOutput = 'Your corporation or partnership coverage is ' + data.Policy.CorporationOrPartnershipCoverage;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'AdditionalInsuredCoverageIntent': function () {
        const speechOutput = 'Your additional insured coverage is ' + data.Policy.AdditionalInsuredCoverage;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'EmploymentCategoryIntent': function () {
        const speechOutput = 'Your employment category is ' + data.Policy.EmploymentCategory;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'TransitionFactorIntent': function () {
        const speechOutput = 'Your transition factor is ' + data.Policy.TransitionFactor;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ProductNumberIntent': function () {
        const speechOutput = 'Your product number is ' + data.Policy.ProductNumber;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ProductVerNumberIntent': function () {
        const speechOutput = 'Your product version number is ' + data.Policy.ProductVerNumber;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'DeductibleAmountIntent': function () {
        const speechOutput = 'Your deductible amount is ' + data.Policy.DeductibleAmount;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'NumberOfClaimsinPastFiveYrsIntent': function () {
        const speechOutput = 'Your number of clains in the past five years is ' + data.Policy.NumberOfClaimsinPast5Yrs;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'TotalReportedIncurredLossandExpenseIntent': function () {
        const speechOutput = 'Your total reported incurred loss and expense is ' + data.Policy.TotalReportedIncurredLossandExpense;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'RetroDateIntent': function () {
        const speechOutput = 'Your retro date is ' + data.Policy.RetroDate;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'RevenueIntent': function () {
        const speechOutput = 'Your revenue is ' + data.Policy.Revenue;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ResidentialOrCommercialBusinessModifierIntent': function () {
        const speechOutput = 'Your residential or commercial business modifier is ' + data.Policy.ResidentialOrCommercialBusinessModifier;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ProjectSizeModifierIntent': function () {
        const speechOutput = 'Your project size modifier is ' + data.Policy.ProjectSizeModifier;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'WrittenContractsModifierIntent': function () {
        const speechOutput = 'Your written contracts modifier is ' + data.Policy.WrittenContractsModifier;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'RiskManagementModifierIntent': function () {
        const speechOutput = 'Your risk management modifier is ' + data.Policy.RiskManagementModifier;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'FinancialStrengthIntent': function () {
        const speechOutput = 'Your financial strength is ' + data.Policy.FinancialStrength;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'UseofSubcontractorsIntent': function () {
        const speechOutput = 'Your use of subcontractors is ' + data.Policy.UseofSubcontractors;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'HistoryofDisciplinaryActionIntent': function () {
        const speechOutput = 'Your history of disciplinary action is ' + data.Policy.HistoryofDisciplinaryAction;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'MergersandAcquisitionsIntent': function () {
        const speechOutput = 'Your mergers and acquisitions is ' + data.Policy.MergersandAcquisitions;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ExperienceofPrincipalsIntent': function () {
        const speechOutput = 'Your experience of principals is ' + data.Policy.ExperienceofPrincipals;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'ClientSizeIntent': function () {
        const speechOutput = 'Your client size is ' + data.Policy.ClientSize;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'RequireSubstoShowProofOfEAndOIntent': function () {
        const speechOutput = 'Your subs required to show proof of errors and omissions is ' + data.Policy.RequireSubstoShowProofOfEAndO;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'RequireAandEstoShowProofOfEandOIntent': function () {
        const speechOutput = 'Your A and E required to show proof of errors and omissions is ' + data.Policy.RequireAandEstoShowProofOfEandO;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'KYLocalGovernmentTaxRateIntent': function () {
        const speechOutput = 'Your local government tax rate is ' + data.Policy.KYLocalGovernmentTaxRate;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'KYLocalGovernmentTaxOverriddenIntent': function () {
        const speechOutput = 'Your local government tax overridden is ' + data.Policy.KYLocalGovernmentTaxOverridden;

        this.response.cardRenderer(SKILL_NAME, speechOutput);
        this.response.speak(speechOutput).listen(REPROMPT);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getPolicy(userID, callback) {
    var url = urlPrefix + userID;
    console.log("Request Sent");

    http.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            console.log("Response: ", body);
            var response = JSON.parse(body);
            data = response[0].solartis;
            callback();
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
        callback();
    });
}
