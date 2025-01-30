This feature will support conversion of CAP - CDS based metadata to sales and service cloud metadata format. Metadata artifacts covered are service, entities, events, apis by taking reference of template defined currently in custom service with sales and service cloud metadata formats. Some manual intervention before uploading final metadata to sales and service cloud is needed.

-   The first entity in the provided CDS service schema is considered the root entity by default.
-   The @create and @update annotations must be applied to all attributes to indicate whether they are creatable or updatable, respectively. – Default “true” for both creatable and updatable if not specified for attributes other than key fields. And for attribute with property key: true, creatable will be true but updatable will be false.
-   `"@Core.Immutable": true` can be used to ensure that an attribute is not updatable under any circumstances. For this attribute or attribute with type UUID, creatable: true and updatable: false. 
-   `"@readonly": true` can be used to ensure that an attribute is not creatable and updatable at all. So properties will be creatable: false and updatable: false in converted metadata.
-   `@UI.HiddenFilter: true` has to maintained for an attribute to mark an attribute as <b> filterable : false</b>, if `"@UI.HiddenFilter": false` is maintained explicitly then that attribute will be marked as <b>filterable: true</b>. If this property is not maintained then <b>filterable: true</b> by default.5.    
-   If an attribute has composition to many, it will be treated as an ARRAY and if composition is 1:1, it will be treated as an OBJECT.
-   Attributes with association to another entity, custom annotation `@dataFormat: AMOUNT/QUANTITY` should be maintained for the attribute in parent entity of association to identify whether it should be of structure AMOUNT or QUANTITY so that code and description attributes are built(As of now both only for QUANTITY associating to CNS productUnitOfMeasure entity and code field association to i18n currency code for AMOUNT - hardcoded)
-   Enums can be defined using `type` keyword in schema.cds inorder to get support of attributes of type `CODE`.

        type Etype          : String @assert.range enum {
            BUSINESS  = 'Business';
            CODEVALUE = 'Code Value';
        }
    This will be converted to an artifact with `"kind": "type"` and it will have enums defined in it and that will act as type of attribute which has reference to this code.
-   There can be multiple service.cds files where projections are on to entities(might be different entities in different service.cds files) from always a single schema.cds file. This is basically in the scenario where customers can create different endpoints / role based views for example.  But as per the analysis, customer can create single JSON file from all those multiple service.cds files using cds commands which will have all the information about multiple services(multiple endpoints) and their projected entites along with elements. But as discussed with pradeepJI, we will first support only one service based JSON at a time.
-   API metadata formation will be supported. <b>Might need to enhance this as requirement came little later, so didn't tested end to end on API metadata formation.</b>
-   Event metadata formation will be supported. Event can be defined in service.cds file in CAP project. It can be defined using `EVENT` keyword. Also, action of event, CREATE/UPDATE/DELETE should be maintained at the end of event name defined.

    For example: 

        EVENT  ProjectOrderService.customer.ssc.projectorderservice.event.projectOrderCreate;

 
 ## Mapping: DataType and Data formats of CAP and Sales & Service cloud.

|Cloud Data Type|Data Format|CAP Data Type|Description|        SUPPORTED |       COMMENTS|
|:----|:----|:----|:----|:----|:----|
|STRING|STRING (Default)|String|Default string type.|                   YES|    NA|
| |UUID|UUID|Universally Unique Identifier.|                   YES|   NA|
| |EMAIL|String|Email address.|                   YES|  NA|
| |CODE|String|Code list.|                   YES|  NA|
| |TOKEN|String|Token format.|                  YES|  In CAP token will also have type as STRING. So such attributes should be annotated with @dataFormat : ‘TOKEN’ to have dataFormat as ‘TOKEN’ in cns metadata.|
| |URI|String|URI format.|                 YES|  In CAP URI will also have type as STRING. So such attributes should be annotated with @dataFormat : ‘URI’ to have dataFormat as ‘URI’ in cns metadata.|
|NUMBER|FLOAT (Default)|Decimal|Default number type.|                YES|  NA|
| |DOUBLE|Double|Double-precision number.|                YES|  NA|
|BOOLEAN|No value|Boolean|Boolean type.|                 YES|  NA|
|OBJECT|AMOUNT, QUANTITY, TEXT|Custom Aspect Types or Predefined Aspects|Complex structures.|               TEXT IS NOT SUPPORTED YET|  Text is not yet tested|
|ARRAY|No value|array of <type>|Array types.|              YES|  NA|
|INTEGER|INT32 (Default)|Integer|Default integer type.|              YES|  NA|
| |INT64|Int64 or Integer64|Long integer.|              YES|  NA|
|DATETIME|DATETIME (Default)|DateTime|Default datetime type.|             YES | NA|
| |DATE|Date|Date type.|             YES| NA|
| |TIME|Time|Time type.|            YES| NA|



## OPEN POINTS AND FUTURE WORK:

-   ObjectTypeCode support is not yet supported because we can't use randomInt as well because generated integer can match with cns entitie's object type code.
-   Dynamic Code List is not yet supported but it can be done based on enum of entity types and using custom annotation like `@type`. And then build association based on that.

    For example: 

        type Etype          : String @assert.range enum {
            BUSINESS  = 'Business';
            CODEVALUE = 'Code Value';
        }

        @type  : Etype.CODEVALUE
        entity ProjectOrder {}
-   Association to external entity(for example entity in CNS) where data is stored in CNS by defining the CNS entity structure in `schema.cds` in the same custom external(CAP) service which will then become association with entity in same custom service but logically not. 

    `Idea:` Define custom annotation something like `@isCnsEntity`. For example, defined `Accounts` entity for now in  `Project Order` CAP service where attribute `accounts` in `ProjectOrder` entity in this CAP service is coming from `Accounts` entity in CNS. And data from accounts in cns is fetched using service.js file logic written in CAP but we will not have access to it, atleast it wont be part of JSON file being uploaded. This is not yet implemented.

-   Association to any of the CNS entities can't be identified, hence targetEntity and targetService is no where refered to sales and service cloud services like i18n currencies, etc.,

-   `Searchable` is not yet supported as it needed further analysis on `cds.search`.
-   UI and integrating with service for this feature is yet to be developed.
-   As of now admin data also will be formed based on input only just like other attributes, it won't be part of admin data array as such, no associations built.


### Comparision with templateData.json:

-   Service:

    No discrepency in service metadata converted with metadata defined in template data.json

    Supported: technicalName, label, description, authorizationRelevant

    Unsupported: fullName if any. Don't see in template.json

-   Entities:

    Supported: name, label(human readable format of name), entityType(enum), root(firstEntity in service), creatable, updatable, attributes

    Unsupported: objectTypeCode

    -   entityType based on guideline provided.

    -   objectTypeCode is not yet supported.

    -   creatable, updatable of entity - default `false`.

        As per guidelines, @odata.containment: false has to be maintained for independent entity and creatable,updatable will be true.

        If annotation exists but it is true, then creatable,updatable will be false. which is anyways by default.

-   Entities-Attributes:

    Supported: name,

    label(human readable format of name),

    dataType(mapping b/w CAP and sales & service cloud)- STRING/BOOLEAN/NUMBER/DATETIME/OBJECT/ARRAY/INTEGER.

    dataFormat(may with dataFormats of cns dataTypes if no specific custom annotation defined for attribute)- STRING/UUID/EMAIL/CODE/URI/ALPHANUMERIC/FLOAT/DOUBLE/AMOUNT/QUANTITY/INT32/INT64/DATETIME/DATE/TIME/DURATION.

    nullable(based on not null property of attribute),

    creatable, updatable - true by default. @Core.Immutable true or UUID field, then updatable false. @readonly true, then both false.

    filterable(based on @UI.HiddenFilter: true)

    enumOptions: filled based on guideline provided to define type and refer that type as type of an attribute.

    Unsupported: description(because CODELIST entity type based association is not yet covered), dataFormat - TEXT/DEFAULT(Not analysed as well)

    Associations supported: AMOUNT(if custom annotation is defined), QUANTITY(if custom annotation is defined), CODE(Enum based). For amount fields, currencyCode if present in associated entity and if enum exists, then format will be code and then association to i18n is built 'hardcoded' target entity and service.

    Associations not yet supported: dynamic code list(association of an attribute to an entity of type CODEVALUE).

    ***Note:***

    Searchable,sortable, searchResult, langDependent is always false and searchWeightage will be 1 by default and labelTextId will be emptyString by default. Though they are not part of templateData.json

    keyType is primary for attribute with property key true.

    Filterable will be false for attribute of dataType OBJECT or ARRAY and then preference is it uiHiddenFilter.

    sourceEntity, targetEntity, targetService -- full names will namespaces can't be formed as namespace is not aware. We can take namespace from cap service but that will be something like sap.capire.service. As discussed earlier, namespaces can be ignored for now and can be maintained manually or something like that.

-   events:

    Supported: technicalName, label, entityReference, trigger but with guidelines followed during CAP service creation.

-   apis:

    Supported: technicalName, title, description, apiPath, operations - id,path,method(read, post, patch, delete), request-pathVariable-name,dataType,dataFormat, responses-description,responseCode(200/400/401/403/404/500),entityReference

    Unsupported:  method(query)

    Currently API metadata for root entity is only supported. Need to enhance further. Api's with child entity endpoints are not yet generated.

