const express = require('express')
const path = require('path')
const request = require('request')
const PORT = process.env.PORT || 5000
var MongoClient = require('mongodb').MongoClient
var bodyParser = require('body-parser')

var url = "mongodb+srv://emily:Kurama!25@cluster0-gygul.mongodb.net/test";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  var dbo = db.db("mydb");
  dbo.createCollection("sol", function(err, res) {
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
  .get('/', (req,res) => res.render('pages/index'))
  .get('/amazon/:id', (req,res) => {
    console.log('req.params.id: ', req.params.id);
    res.send(req.params.id);
  })
  .get('/all', (req, res) => {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("sol").find({}).toArray(function(err, result) {
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
        dbo.collection("sol").update(
          {amazonId: req.params.id },
          {
            $set:{solartis: ["data"]}
          },
          {upsert:true}
        );
      }
     res.send('go to /all to see all entries');
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
        'Content-Type': 'application/json'
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
      res.render('pages/db', { statusCode: httpResponse.statusCode, statusMessage: httpResponse.statusMessage });
    });
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))