# Leads Extensibility Scenario

## Description
This sample demonstrates side by side extension on Sales and Service Cloud for Leads Entity. Complete scenario details are mentioned in the section –  [Reference Scenario](#reference-scenario). 

We have created external service. Service is developed using Node.js in AWS Lambda Service and is interacting with SAP Sales and Service cloud via AWS API Gateway. Service is deployed in AWS. 

## Key Features
The key extension features covered in this implementation are:
* External custom logic (validations/determinations) implementation using external hooks

## Prerequisites
For creating similar sample , below are the prerequisites along with link where you can learn more about them-
* Root User in AWS Management console. Helpful links for setup
https://aws.amazon.com/console/ 
* User in Sales and Service Cloud.

## Reference Scenario
Details of sample reference scenario is mentioned [here](./Files/scenario.md).

## Integrating external service
Please follow below mentioned steps to integrate external service and run leads application.
* [Sales and Sercice cloud configurations](./Files/ssc_configuration.md)
* [Aws Lambda Configuration and integration to SAP Sales and Service cloud using custom Logic external hooks](./Files/externalHooks.md)



