CAP File conversion

For CAP based custom service, metadata json file can be created automatically using CAP File Conversion feature.
This will reduce manual effort of filling details based on CAP service. This feature is provided to support automated conversion of CAP-CDS based metadata in JSON format to sales and service cloud metadata functionality with comparatively minimal manual effort to upload final metadata to sales and service cloud inorder to create custom service and generate UI’s accordingly.

_Current Scope_

- Supports conversion to create service, entities, events ,apis based on available metadata.
- Partial automation: Some manual intervention is required post the conversion.
- Limited to JSON format support for conversion.

_Pre-requisites_

- CAP service to be developed and deployed to BTP.
- If the CDS service is available locally, use the command cds -2 json <service.cds file path> on the service.cds file in CLI. For services deployed to BTP, cds pull <Service-URL> can be used to fetch the complete service and convert it to JSON locally using the command cds -2 json <service.cds file path>.
- Follow metadata guidelines to avoid inconsistency in metadata conversion and reduced manual effort to upload final metadata to sales and service cloud while creating custom service in Extensibility -> Custom services admin UI.


The conversion involves below steps:

- Upload CAP Schema: Provide CAP-CDS based metadata in JSON format generated as mentioned in pre-requisites section. This schema should adhere to guidelines mentioned in below section.
- Download Converted Metadata – Retrieve the converted metadata in JSON format. Please note conversion has limitations. Please refer to section - Metadata Conversion Support and Limitations for more details.
- Validate and Modify: Review the output, make modifications to the JSON file if any missing details or inconsistencies found.
- Re-upload Metadata: Use the existing upload feature in the custom service UI to submit the revised metadata.


## Guidelines:

The guidelines outlined [here](../files/GuildelinesConv.MD) must be strictly adhered to for consistent and highly reliable conversion.

## Metadata Conversion Support and Limitations:

Support and limitations for this conversion is outlined [here](../files/LimitationConv.md)


## Manual steps before uploading metadata to Sales and Service Cloud

Before uploading the final metadata to the Sales and Service Cloud using the upload feature, a few manual steps need to be completed after downloading the converted file through the automated conversion process:

- Validate the downloaded metadata to ensure it is correct and aligns with the current scope. The conversion might introduce inconsistencies or discrepancies. Make any necessary corrections based on the guidelines for uploading custom service metadata to the Sales and Service Cloud.  

- Set the correct root entity. The first entity defined in the CAP service metadata is automatically considered the `root`. If a different entity should be the root, update the `root: true` property accordingly.

- Update names of entities, services, and other full names with namesapce, as the converted metadata may only reflect CAP-specific names. These should be modified to match the naming conventions required by the Sales and Service Cloud. Example: For associations to CNS entities, target entity and target service needs to be updated. Adding `entityReference` for ASSOCIATION depends on customer's usecase(If the customer wants all the attributes from the associated entity, then entity reference can be maintained. if not then only attributes defined under the objectDefinition will be taken into considerations)
  
- For entity attributes which are marked for description, update the descriptionAttribute property accordingly.
  Example: If `@description: true` is set upon an element in CDS, then please make use of it as a `descriptionAttribute` for the appropriate entity attribute, for which it serves as the description field. Refer to the sample json paylaod for examples of attributes which are marked under the `descriptionAttribute` property.

- For apis, please update the api metadata, with the relevant api paths corresponding to all the child entities. Since at the CDS side, @path is maintained at the service level, the metadata conversion takes care of only one api metadata i.e. the root entity. For other child entities, the api metadata has to be manually maintained.
  
- Once all validations and modifications are complete and aligned with the custom service metadata guidelines(compare it with the sample metadata that is available), use the upload feature to submit the final metadata.


