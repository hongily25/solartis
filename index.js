const express = require('express')
const path = require('path')
const request = require('request')
const PORT = process.env.PORT || 5000
var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')

var url = "mongodb+srv://emily:Kurama!25@cluster0-gygul.mongodb.net/test";

/* Create database */
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("solartisdb", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req,res) => {
 
      if (req.query.access_token) {      
        /*
        request.post({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.query.access_token;
             },
            url: 'https://api.amazon.com/user/profile'
        }, (err, httpResponse, body) => {
          // do something 
          var string = JSON.parse(body);
          res.render('pages/index', { message: string })
        });
        */
        res.render('pages/index', { message: req.query.access_token })
      } else {
        res.render('pages/index', { message: 'no access token' })
      }
  })
  .get('/all', (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("solartisdb").find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
        console.log(result);
        db.close();
      });
    });
  })
  .get('/amazon/:id', (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      if(req.params.id) {
        var query = { AmazonId: req.params.id }
        dbo.collection("solartisdb").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log("result: ", result);
          db.close();
          res.send(result);
        })
      } else {
        res.send('go to /all to see all entries');
      }
      
    });
  })
  .post('/', (req, res) => {
     console.log('req.body', req.body);

     var solartisRequest = {
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
        "ProgramName": req.body.ProgramName,
        "PolicyType": req.body.PolicyType,
        "ZipCode": req.body.ZipCode,
        "State": req.body.State,
        "EffectiveDate": req.body.EffectiveDate,
        "EventName": req.body.EventName,
        "EventVersion": req.body.EventVersion,
        "ApplicableFromDate": req.body.ApplicableFromDate,
        "NumOfProviders": req.body.NumOfProviders,
        "SharedOrSeparateLimit": req.body.SharedOrSeparateLimit,
        "PLOrWLCoverageType": req.body.PLOrWLCoverageType,
        "ProfessionalLiabilityLimitsOfInsurance": req.body.ProfessionalLiabilityLimitsOfInsurance,
        "WorkplaceLiabilityLimitsOfInsurance": req.body.WorkplaceLiabilityLimitsOfInsurance,
        "WorkplaceLiabilityInsurance": req.body.WorkplaceLiabilityInsurance,
        "CorporationOrPartnershipCoverage": req.body.CorporationOrPartnershipCoverage,
        "AdditionalInsuredCoverage": req.body.AdditionalInsuredCoverage,
        "EmploymentCategory": req.body.EmploymentCategory,
        "TransitionFactor": req.body.TransitionFactor,
        "ProductNumber": req.body.ProductNumber,
        "ProductVerNumber": req.body.ProductVerNumber,
        "ExpensesInsideOrOutside": req.body.ExpensesInsideOrOutside,
        "DeductibleAmount": req.body.DeductibleAmount,
        "NumberOfClaimsinPast5Yrs": req.body.NumberOfClaimsinPast5Yrs,
        "TotalReportedIncurredLossandExpense": req.body.TotalReportedIncurredLossandExpense,
        "RetroDate": req.body.RetroDate,
        "Revenue": req.body.Revenue,
        "ResidentialOrCommercialBusinessModifier": req.body.ResidentialOrCommercialBusinessModifier,
        "ProjectSizeModifier": req.body.ProjectSizeModifier,
        "WrittenContractsModifier": req.body.WrittenContractsModifier,
        "RiskManagementModifier": req.body.RiskManagementModifier,
        "FinancialStrength": req.body.FinancialStrength,
        "UseofSubcontractors": req.body.UseofSubcontractors,
        "HistoryofDisciplinaryAction": req.body.HistoryofDisciplinaryAction,
        "MergersandAcquisitions": req.body.MergersandAcquisitions,
        "ExperienceofPrincipals": req.body.ExperienceofPrincipals,
        "ClientSize": req.body.ClientSize,
        "RequireSubstoShowProofOfEAndO": req.body.RequireSubstoShowProofOfEAndO,
        "RequireAandEstoShowProofOfEandO": req.body.RequireAandEstoShowProofOfEandO,
        "KYLocalGovernmentTaxRate": req.body.KYLocalGovernmentTaxRate,
        "KYLocalGovernmentTaxOverridden": req.body.KYLocalGovernmentTaxOverridden,
        "Provider": [
          {
            "ProviderDetail": {
              "FirstName": req.body.FirstName,
              "MiddleInitial": req.body.MiddleInitial,
              "LastName": req.body.LastName,
              "ProviderClass": req.body.ProviderClass,
              "ProfessionalAssociation": req.body.ProfessionalAssociation,
              "YearsOfPolicy": req.body.YearsOfPolicy,
              "YearsInPractice": req.body.YearsInPractice,
              "RiskManagementDiscount": req.body.RiskManagementDiscount,
              "PatientCompensationFund": req.body.PatientCompensationFund,
              "HoursWorkPerWeek": req.body.HoursWorkPerWeek,
              "ScheduleRatingFactor": req.body.ScheduleRatingFactor,
              "ProviderEmailId": req.body.ProviderEmailId,
              "MeetsStudentQualification": req.body.MeetsStudentQualification,
              "UseofWrittenContractsFactor": req.body.UseofWrittenContractsFactor,
              "TrainingorEducationFactor": req.body.TrainingorEducationFactor,
              "ProfessionalReputationFactor": req.body.ProfessionalReputationFactor,
              "NatureofOperationsFactor": req.body.NatureofOperationsFactor
            }
          }
        ]
      },
      "OwnerId": "27"
    }

     request.post({
      headers: {
        'Content-Type': 'application/json',
        'EventName': 'PLICalculateRate',
        'EventVersion': '2.2.2.1',
        'Token': solartisRequest.ServiceRequestDetail.Token

      },
      url: 'https://profapihk.solartis.net/DroolsV6/DroolsService/FireEventV2',
      body: JSON.stringify(solartisRequest)
    }, (err, httpResponse, body) => {
      if (err) {
        return console.error('err:', err);
        res.send("sorry there was an error");
      }
      console.log('httpResponse.statusCode', httpResponse.statusCode);
      console.log('body: ', body);
      var solartisResponse = JSON.parse(body);

      /* Store request in database. Todo: Store BODY in database */
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb");
          if(req.body.AmazonId) {
            dbo.collection("solartisdb").update(
              { AmazonId: req.body.AmazonId },
              {
                $set:{solartis: solartisResponse }
              },
              {upsert:true}
            );
          }
          res.render('pages/db', { statusCode: httpResponse.statusCode, statusMessage: httpResponse.statusMessage });
        });
      });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
