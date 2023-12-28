# Vehicle Service Extension Scenario
<!-- Please include descriptive title -->

<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/REPO-NAME)](https://api.reuse.software/info/github.com/SAP-samples/REPO-NAME)
-->

## Description
This sample demonstrates side by side extension on Sales and Service Cloud for vehicle service scenario. Complete scenario details are mentioned in the section - [Reference Scenario](#reference-scenario).

We have created external applications for service and UI, respectively. The service is developed using both Node.js and Java and is interacting with SAP Sales and Service Cloud using SAP Cloud SDK. The service is deployed in a BTP Kyma instance. The UI is developed using SAP Build Apps, which is a no-code/low-code tool. The external UI is embedded in Sales and Service Cloud via mashups.


## Key Features
The key extension features covered in this implementation are:
* Embedding external application in SAP Sales and Service Cloud via mashup
* External custom logic (validations/determinations) implementation using external hooks
* Few basic Extension configurations in SAP Sales and Service Cloud
* User propagation across different applications

## Prerequisites
For creating similar sample , below are the prerequisites along with link where you can learn more about them-
* SAP Build Apps set up in BTP Account. Helpful links for setup
  * https://discovery-center.cloud.sap/serviceCatalog/sap-build-apps/?region=all
  * https://help.sap.com/docs/build-apps/service-guide/setup-sap-build-apps-with-sap-sales-cloud-version-2?locale=en-US
* [Configure IDP in Sales and Service Cloud](https://help.sap.com/docs/CX_NG_SVC/2c87cece32844c91836e535aef8f9642/0606508068724fea9b3ae9e2cd39f2e2.html?locale=en-US)
* Account and subaccount in SAP BTP , Kyma Instance runtime.
  * Refer [here](https://help.sap.com/docs/sap-hana-spatial-services/onboarding/introduction) to create account in BTP
  * Refer [here](https://discovery-center.cloud.sap/missiondetail/3019/3016/) to learn BTP
  * Refer [here](https://github.com/SAP-samples/kyma-runtime-extension-samples/tree/main/prerequisites#kyma) to know more about Kyma
* Users in both Sales and Service Cloud and BTP respectively . Few things already covered in above links. [Here](./Files/user.md) is quick guide.
* Kubectl - Install kubectl from below link
  * [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)
  * [MacOS](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
* kubelogin plugin is required to proceed with Kubernetes authentication
  * Homebrew (macOS and Linux) - brew install int128/kubelogin/kubelogin
  * Chocolatey (Windows) - choco install kubelogin
  * Install krew from [here](https://krew.sigs.k8s.io/docs/user-guide/setup/install/)
  * Run - "kubectl krew install oidc-login"
* Install [Skaffold](https://skaffold.dev/docs/install/)
* Install Docker
* For Backend Service
  * NodeJS and NestJS Framework
  * Java and SpringBoot Framework
* Cloud SDK. Learn from [here](https://sap.github.io/cloud-sdk/)
* HANA DB Account in BTP.

## Reference Scenario
Details of sample reference scenario is mentioned [here](./Files/scenario.md).

## Running the application
Please follow below mentioned steps to run this application.
* [Configurations in SAP Sales and Service cloud](./Files/ssc_configuration.md)

* [Run Backend service](./Files/service.md)
  * [Download and Deploy application](./Files/service.md#download-and-deploy-service-in-kyma)
  * [Add Authentication](./Files/service.md#add-authentication)
  * [Run service API using postman](./Files/service.md#running-backend-api-using-postman)
  * [Code structure details](./Files/service.md#code-folder-structure)

* [Run SAP Build Apps application](./Files/buildapps.md)
* [Embed external UI application via mashup](./Files/EmbedMashup.md)
* [Custom logic implementation using external hooks](./Files/externalHooks.md)




