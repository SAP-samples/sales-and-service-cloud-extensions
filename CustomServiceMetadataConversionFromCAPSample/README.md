## Sections in this chapter

[Overview (DRAFT!)](#Overview)

[UseCase](#usecase)

[Current Scope](#current-scope)

[Pre-requisites](#pre-requisites)

[Multi-Step Conversion](#conversion-process)

[User Interface](#user-interface)

[Guidelines](#guidelines)

[Limitations](#limitations)

[Manual Actions Required Post Conversion](#manual-actions-required-post-conversion)

[Metadata](#metadata)


## Overview

This is sample and guideline document for automating CAP-CDS custom service metadata conversion to sales and service cloud supported metadata format. 

## UseCase

We have an extensibility feature `Custom Services` in admin setting inorder to create custom services into sales and service cloud. For that metadata formats has to match with sales and service cloud metadata. So metadata artifact's(service, entities, events, apis) metadata required for sales and service cloud is defined in a template which can be downloaded using `Download Template`. Required details in the template.json downloaded has to be manually filled and use `Upload JSON file` feature is used to upload custom service's metadata to sales and service cloud. Inorder to reduce manual effort of filling details based on service maintained in external system(like CAP in this case), this feature is provided to support `automated conversion of CAP-CDS based metadata in JSON format to sales and service cloud metadata` functionality with comparatively minimal manual effort to upload final metadata to sales and service cloud inorder to create custom service and generate UI's accordingly.

## Current Scope

1.  Supports conversion to create service, entities, events ,apis based on available metadata.
2.  Partial automation: Some manual intervention is required to update full service names and correct missing or incorrect details.
3.  Limited to JSON format support for conversion.

## Pre-requisites

1. CAP service to be developed and deployed to BTP. Please refer  [Custom Service Sample based on CAP](../CustomServiceBasicCAPSample/README.md) to know more about limitations and support.
2.  If the CDS service is available locally, use the command `cds -2 json <service.cds file path>` on the service.cds file in CLI. For services deployed to BTP, `cds pull <Service-URL>` can be used to fetch the complete service and convert it to JSON locally using the command `cds -2 json <service.cds file path>`. 
3. Follow guidelines mentioned in [guidelines](./Documents/guidelines.md) to avoid inconsistency in metadata conversion and reduced manual effort to upload final metadata to sales and service cloud while creating custom service in Extensibility -> Custom services admin UI.

## Conversion Process:

The conversion involves five steps:

-   Upload Metadata: Provide CAP-CDS based metadata in JSON format generated as mentioned in pre-requisites section.
-   Automated Conversion: The system processes and converts the metadata into a Sales and Service Cloud metadata format.
-   Download Converted Metadata – Retrieve the converted metadata in JSON format.
-   Validate and Modify: Review the output, make modifications to the JSON file if any missing details or inconsistencies found.
-   Re-upload Metadata: Use the existing upload feature in the custom service UI to submit the revised metadata.

This process ensures a structured transformation while allowing manual adjustments to refine the final output.

## User Interface:

<b>`TO BE DEVELOPED - PENDING.`</b>

## Guidelines:

The guidelines outlined [here](./Documents/guidelines.md) must be strictly adhered to for consistent and highly reliable conversion.

## Metadata Conversion Support and Limitations:

Support and limitations for this conversion is outlined [here](./Documents/supportAndLimitations.md)

##  Manual Actions Required Post Conversion:

Please perform the manual actions [required](./Documents/manualStepsPostConversion.md) after downloading the sales and service cloud supported converted metadata based on provided CAP based metdata in JSON.

## Run service locally:

Run the service locally by giving the required metadata JSON in constant cdsSchema in constants.ts file. Please find service code [here](./Service) considering Node.js environment is setup already in local

## Metadata:

-   ### Sample Metadata for conversion -

    Refer [CAP Based CDS Metadata in JSON format Sample](./Metadata/CapBasedCDSMetadata.json)

-   ### Sample converted metadata using CAP sample -

    Refer [Converted Metadata Sample](./Metadata/ConvertedMetadata.json)









