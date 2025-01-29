## Metadata

When integrating external services, such as those on SAP BTP, into SAP Sales and Service Cloud V2(SSCV2) as custom services, inconsistencies may arise due to differences in data types, attributes, associations, and operations. To address this, a JSON file is used to map the external service details to structure expected in SSCV2. By explicitly defining these mappings in the JSON file, you ensure seamless and accurate service integration.

It is important to note that SSCV2 currently does not support metadata versioning. As a result, any changes to the external service require manual updates to the metadata file. Additionally, rollback to a previous state is not supported, emphasizing the need for careful management and backup of metadata files.

Uploaded metadata looks like this:
![Entity](../Images/Metadata.png)

There are various provided for metadata 
![Entity](../Images/MD.png)

 - Download Template : To download metadata template with placeholder which can be edited as per use case to upload
 - Download Sample : To download example template for reference
 - Download Current Metadata : To download the uploaded metadata


The metadata is primarily divided into four sections:
- Service Information: Details of service like- name, description etc.
- Entities: Contains entity information along with the mapping structure required by SSCV2.
- APIs: Contains details of APIs for various methods such as GET, POST, PATCH, and DELETE.
- Events: Includes information about events triggered by the external service. For example, an event(projectOrderCreate) is raised when a project order is created in the external service.

Lets check the properties for each of above mentioned section in details -

### Service Information:
__name__	:
    Unique string identifier for the service (e.g., “ProjectOrder”). Must not include the word ‘service’.<br>
__title__ : 
 	Display name of the service, used in the UI.<br>
__description__ :
    Description of the service.<br>
__authorizationRelevant__
   Indicates whether the service requires authorization (true or false).

### Entities
Each entity represents a functional data unit (e.g., a business object).

__name__ : 	Unique identifier for the entity (e.g., “ProjectOrderNS”).<br>
__label__:	Display name of the entity (e.g., “Project Order”). The translation support of these labels is supported via the Language Adaptation Tool. <br>
__entityType__	Type of entity, such as BUSINESS.<br>
__objectTypeCode__	Code representing the object type, typically used in integrations.<br>
__root__ :Indicates if this is the root entity of the service.

####  Attributes : Defines properties of entity fields.
__name__ :	Unique name of the attribute (e.g., “id”, “Name”).<br>
__label__:	Human-readable label for the attribute.<br>
__dataType__:	Data type of the attribute (e.g., STRING, DATETIME).<br>
__nullable__:	Specifies if the attribute can have a null value (true or false).<br>
__creatable__:	Indicates if the attribute can be set during entity creation.<br>
__updatable__:	Indicates if the attribute can be modified after creation.<br>
__filterable__:	Specifies if the attribute can be used in filters (true or false).<br>
__searchable__:	Specifies if the attribute is searchable (true or false).<br>
__keyType__:	Defines if the attribute is a primary or foreign key (PRIMARY, FOREIGN).<br>
__objectReference__:	Specifies associations with other entities or services, including source and target attributes.<br>
__description__ : Boolean, indicates if particular attribute is description of id field(Primary Key Type) and used to trigger navigation to QV, details.

### Events
Defines triggers for specific actions (e.g., create, update, delete).

__name__ :	Unique identifier for the event (e.g., “projectOrderCreate”).<br>
__entityReference__: The entity this event is associated with (e.g., “ProjectOrderNS”).<br>
__trigger__:	Event trigger type, such as CREATE, UPDATE, or DELETE.

### APIs

__name__:	Unique name for the API (e.g., “ProjectOrderApi”).<br>
__description__:	Brief description of the API’s purpose.<br>
__title__:	Display title for the API.<br>
__apiPath__:	Base path for the API (e.g., “/project-order-service/project-order”).<br>
__operations__ :	Defines operations like READ, CREATE, UPDATE, or DELETE, along with path and methods.<br>

### Datatypes in SAP Sales and Service Cloud V2

In Sales And Service Cloud, metadata attributes are defined using datatypes (aligned with OpenAPI/JSON Schema standards) and data formats (providing additional context). Please refer below table for more information on datatype available.

| Data Type | Data Format       | Description                                                                   |
|-----------|-------------------|-------------------------------------------------------------------------------|
| STRING    | STRING (Default)  | Default string format. Empty `dataFormat` unless explicitly set.             |
|           | UUID              | Universally Unique Identifier.                                               |
|           | EMAIL             | Email address.                                                               |
|           | CODE              | Code list (fixed via `enumOptions` or dynamic via entity reference).          |
|           | TOKEN             | Token format.                                                                |
|           | URI               | Uniform Resource Identifier.                                                 |
| NUMBER    | FLOAT (Default)   | Default number type. Empty `dataFormat` unless explicitly set.               |
|           | DOUBLE            | Double-precision number.                                                     |
| BOOLEAN   | No value          | Represents true/false.                                                       |
| OBJECT    | No value          | For structured or complex types.                                             |
|           | AMOUNT            | Amount with a structure (e.g., `sap.crm.common.struct.amount`).              |
|           | QUANTITY          | Quantity with a structure (e.g., `sap.crm.common.struct.quantity`).          |
|           | TEXT              | Text with a structure (e.g., `sap.crm.common.struct.text`).                  |
| ARRAY     | No value          | Applicable data format specified via `itemDataType`.                         |
| INTEGER   | INT32 (Default)   | Default integer type.                                                        |
|           | INT64             | Long integer.                                                                |
| DATETIME  | DATETIME (Default)| Default datetime type.                                                       |
|           | DATE              | Date only.                                                                   |
|           | TIME              | Time only.                                                                   |
|           | DURATION          | Duration type.                                                               |



