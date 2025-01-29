## Custom Service- Getting Started!
 This is getting started sample to levarage the "Custom Service" feature in SAP Sales and Service cloud and explains basics of this feature. 
 
### What is "Custom Service"?
 
 Custom Service is the service that is implemented,developed and deployed outside SAP Sales and Service Cloud(SSCV2), but its metadata like entity, event structure is published in/imported to metadata repository in SSCV2. This is very important feature for side-by-side extensibility. This service can participate in the SSCV2 processes seamlessly, like:
- To allow the various built-in capabilities and features of SSCV2 like autoflow, timeline, search and analytics.
- To have custom workspace with generated custom UIs like List view, Detail view, Quick view, Quick create and Object Value Selector.
 
### What is required for custom Services?
 
 - Service : Rest Service developed and deployed using any technology/framework outside SSCV2.
 - Metadata: Service metadata to be uploaded in SSCV2.
 - Admin access to SSCV2 to access and create Custom Service via admin settings.
 
 SSCV2 expects service API and metadata should follow particular guidelines. To know more about metadata and API guidelines please check [guideline](#guidelines) section . 
 
### How to start and use this sample?
 
- Deploy Service- <br>
     This sample provides CAP service having one [entity](./Doc/files/service.MD) with few attributes. Download the soure code and deploy in BTP Cloud Foundry by following steps mentioned [here](./Doc/files/deploy.md)
- Metadata- <br>
     [Download](./Doc/files/CSMetadata.json) the metadata of this service which needs to be uploaded to SSCV2 in next step.
- Create Custom Services in SSCV2 and view the generated UIs- <br>
     Admin user needs to create "Custom Services" in SSCV2 by following steps mentioned [here](./Doc/files/ui.md).
 
 ### What's next?
 This sample gives idea on custom services. But there are other key features as well like:
 - [Add child entities](./Doc/files/ChildEntity.MD).
 - [Adding Authentication to service](./Doc/files/Auth.md).
 - [Handling reference associations](./Doc/files/RA.MD).
 
 ### Guidelines
 - [Metadata](./Doc/files/Metadata.MD)
 - [API](./Doc/files/API.MD)

### Project Structure

It contains these folders and files, following CAP recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide

### Learn More on CAP

Learn more at https://cap.cloud.sap/docs/get-started/ 
