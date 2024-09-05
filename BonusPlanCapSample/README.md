# Side by Side extension using **CAP** on SAP Sales and Service cloud V2
<!-- Please include descriptive title -->

<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/REPO-NAME)](https://api.reuse.software/info/github.com/SAP-samples/REPO-NAME)
-->

## Description
This sample demonstrates side by side extension on Sales and Service Cloud V2 for a sample application scenario (Bonus Plan). Complete scenario detail is mentioned in the section - [Sample Application Scenario - Bonus Plan](#sample-application-scenario-bonus-plan).

We have created external application- service and UI, respectively using **SAP Cloud Application Programming Model (CAP)**. CAP allows Node and Java based service SDK, among which Node based service SDK and runtimes are used to create services which uses **Core Data Services (CDS)** as universal modeling language for both domain models and service definitions. UI is created using **CAP Fiori templates**. The application is deployed in BTP Cloud Foundry. Application is embedded in SAP Sales and Service Cloud via mashup capability. 

## Key Features
The key features covered in this implementation are:  
* Development of external(Bonus Plan) application following the golden path of programming model using [SAP CAP](#references-to-cap-development-guides).
* Used SAP Fiori UX Standards and SAP UI5 library for creating UIs for the external(Bonus Plan) application.
* Implemented access restrictions for the external(Bonus Plan) application based on XSUAA authentication. [Details for ading user to BTP account for authentication](./Files/user.md). [Details for XSUAA Implementation](./Files/authorization.md)
* Implemented role based authorizations for the external(Bonus Plan) application. [Details](./Files/userAccessBTP.md).
* Integrated SAP Sales and Service Cloud V2 REST apis for fetching and updating data in the external(Bonus Plan) application. [Details](./Files/createDestination.md).
* Embedded the external application in SAP Sales and Service Cloud V2 via Mashup. [Details](./Files/EmbedMashup.md).
* Deployed external application on Cloud Foundry in SAP BTP. [Details](./Files/deploy.md).
* User propagation across SAP Sales and Service Cloud V2 and the external application.

## Sample application Scenario (Bonus Plan)
Details of the Bonus Plan Application and the use cases are mentioned [here](./Files/scenario.md).

## Prerequisites
Following configurations are required to download bonusplan application from Git and to deploy and run the application on BTP (Cloud Foundry).
* Admin access to SAP Sales and Service Cloud V2 for creating and adding mashup.
* BTP account and Hana Cloud services (Cloud Foundry). Please follow links below in case trial account needs to be created. 
  * [Tutorial](https://youtu.be/GSNQpfxPuLU?si=XmE62QVyIMBV5LQP) for setting up BTP trial account
  * [Documentation](https://cap.cloud.sap/docs/guides/deployment/to-cf#btp-and-hana) for deployment setup of SAP CAP to deploy on Cloud Foundry in SAP BTP.
* Same business user (email) should exist both in SAP Sales and Service Cloud V2 and SAP BTP for authentication. 
  * [Quick guide](./Files/user.md) to create and manage users in SAP Sales and Service Cloud V2 and SAP BTP.
* Install Node.js. [Refer here](https://cap.cloud.sap/docs/get-started/jumpstart#_1-install-node-js)
* Install CAP's cds-dk. [Refer here](https://cap.cloud.sap/docs/get-started/jumpstart#_2-install-cap-s-cds-dk)
* Install Git. [Refer here](https://cap.cloud.sap/docs/get-started/jumpstart#_3-install-git)
* Install Cloud MTA Build Tool using `npm i -g mbt`. [Reference from Capire documentation](https://cap.cloud.sap/docs/guides/deployment/to-cf#mbt)
* **For Windows users**, install **GNU Make**. [Reference from Capire documentation](https://cap.cloud.sap/docs/guides/deployment/to-cf#mbt) [**Not required for Mac/Linux users**]
* Install Cloud Foundry CLI and MTA Plugins [Reference from Capire documentation](https://cap.cloud.sap/docs/guides/deployment/to-cf#cf-cli)


## Running the application
To run this sample application please follow the steps below
* [Download application code from git and install npm dependencies](./Files/setup.md)
* Add BTP Configurations (Cloud Foundry)
    * [Create destination for accessing SAP Sales and Service Cloud V2 REST apis](./Files/createDestination.md)
    * [Add user role for Admin User](./Files/userAccessBTP.md)
* [Build and Deploy Application](./Files/deploy.md)
* [View and run application](./Files/viewApplication.md)

## Development Guide
Previous section helped in getting the application running from BTP. This section will give details on how to run this application locally and play around with code. 

### Prerequisites
In addition to the [Deployment Prerequisites](#Prerequisites), some additional configurations are required to locally setup this project for development.
* **For Windows Users**, Install SQLite. [Refer here](https://cap.cloud.sap/docs/get-started/jumpstart#_4-install-sqlite). [**Not required for Mac/Linux users**].
* Install Visual Studio Code as preferred editor and all related plugins. [Refer here](https://cap.cloud.sap/docs/get-started/jumpstart#_6-install-visual-studio-code).

### Local Setup
* To setup and run the application locally follow steps mentioned [here](./Files/localSetupGuide.md).
* [Adding Authentication and Authorization](./Files/authorization.md)

### Code Structure
Please find the code structure details [here](./Files/codeStructure.md)

### References to CAP development guides
Please follow below links for learning more about CAP
* [Jumpstart CAP Project](https://cap.cloud.sap/docs/get-started/jumpstart#jumpstart-cap-projects).
* [CAP Cookbook](https://cap.cloud.sap/docs/guides).

## Bonus Plan Application Codebase
[Git Repo](./bonusplan)

