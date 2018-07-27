# Policy Pal
## Inspiration
Insurance policy documents tend to be very long an difficult to navigate. Further, customers typically do not need to reference them very often and when they do, they are usually looking for very specific pieces of information. Unfortunately, the information they are looking for is often buried in a 20 page document or file that sometimes gets lost.
## What it does
Policy Pal comprises a web app for issuing insurance policies on the road and a voice app for navigating policy information.
## How we built it
We use a node server for storing policy information provided by Solartis with application information gathered from our web app. We can then access the information from our Alexa app.
We were able to add a user input field for Amazon Alexa ID so we could query our database to link a user to the Alexa skill.
## Alexa Skill
To use the Policy Pal skill, apply for an insurance policy at:
http://solartis.herokuapp.com
Once your policy is issued, you can ask for details using Policy Pal.

You can ask Policy Pal for:

Program Name,
Policy Type,
Zip Code,
State,
Effective Date,
Event Name,
Event Version,
Applicable From Date,
Number of Providers,
Shared or Separate Limit,
Coverage Type,
Professional Liability Limits of Insurance,
Workplace Liability Limits of Insurance,
Workplace Liability Insurance,
Corporation or Partnership Coverage,
Additional Insured Coverage,
Employment Category,
Transition Factor,
Product Number,
Product Version Number,
Expenses Inside or Outside,
Deductible Amount,
Number of Claims in the Past Five Years,
Total Reported Incurred Loss and Expense,
Retro Date,
Revenue,
Residential or Commercial Business Modifier,
Project Size Modifier,
Written Contracts Modifier,
Risk Management Modifier,
Financial Strength,
Use of Subcontractors,
History of Disciplinary Action,
Mergers and Acquisitions,
Experience of Principals,
Client Size,
Subs Required to Show Proof of Errors and Omissions,
A and E Required to Show Proof of Errors and Omissions,
Local Government Tax Rate,
Local Government Tax Overridden
