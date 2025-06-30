
## Guidelines for conversion supportability:

To be followed in schema.cds while defining the entity and events:

- Maintain custom annotation for root entity "@isRoot". If not maintained, then by default first entity will be considered as root. There must be only one Root entity.

-   The `source` property of the service definition should not be modified. It should have “.cds” extension. All these properties are mandatory and should not be removed when serviceSchema.cds is converted to JSON and is being uploaded for metadata conversion.
For example:
```json
        "ProjectOrderService": {
            "@source": "srv/projectorder-service.cds", // .cds extension
            "kind": "service",
            "@path": "/project-order-service"
        } 
```
Note: Please do not use the word `service` while defining the service name in your .cds file.

-   `@odata.containment: false` has to be maintained for an entity in schema.cds if an entity can exists independently is not contained. Useful for maintained creatable,updatable properties of entity.
-   Atleast one attribute(element) in the entity should have property "key": true. Preferably UUID attribute in the entity.
    For example:

        key ID  : UUID;

-   The `@description` custom annotation can be used to mark an attribute as the description attribute within an entity which can only then be used while building association as descriptionAttribute.
For Example:
```json
          "Name": {
            "@description": true,  // Custom annotation.
            "type": "cds.String",
            "notNull": true
          },
```

-   `"@Core.Immutable": true` can be used to ensure that an attribute is not updatable under any circumstances. For this attribute or attribute with type UUID, creatable will be true and updatable will be false. Otherwise updatable will be true.

    For example to maintain either true or false for `Name` attribute:

        "@Core.Immutable": true/false,
        Name        : String not null;
        
-   `@readonly` can be used to ensure that an attribute is not creatable and updatable at all. So properties will be creatable: false and updatable: false in converted metadata.
    For example:

        @readonly
        opportunityId            : UUID;

-   If none of the above are maintained creatable and updatable will be true by default other than for UUID type of attribute.

-   `@UI.HiddenFilter: true` has to maintained for an attribute to mark an attribute as <b> filterable : false</b>, if `"@UI.HiddenFilter": false` is maintained explicitly then that attribute will be marked as <b>filterable: true</b>. If this property is not maintained then <b>filterable: true</b> by default.

    For example to maintain either true or false for `displayID` attribute:

        @UI.HiddenFilter: false/true
        displayId                : String;

-    `not null` can be used for an attribute to mark it non-nullable. By default, nullable will be true if not specified.
    For Example:

    Name  : String not null;

-   Attributes with association to another entity, custom annotation `@dataFormat` should be maintained for the attribute in parent entity of association. 
    For example:

        @dataFormat: 'AMOUNT'
        estimatedRevenue  : Composition of EstimatedRevenue;

    Here in this case, `estimatedRevenue` attribute in `ProjectOrder` entity is having association to another entity `EstimatedRevenue` which is having amount fields structure. Inorder to know that association of estimatedRevenue attribute should have structure of AMOUNT, then this is mandatory to maintain `custom annotation` as mentioned above.

    `EstimatedRevenue` entity:

        entity EstimatedRevenue {
        key ID                                : UUID;
            currencyCode                      : String;
            content                           : Decimal(10, 3);
    }

    Similarly, custom annotation `@dataFormat : 'QUANTITY'` to be maintained for attributes with association to an entity with structure representing quantity.

    For example:

        @dataFormat: 'QUANTITY'
        quantity : Composition of ProductQuantity;

    `ProductQuantity` entity:

        entity ProductQuantity {
            key ID            : UUID;
            content       : Integer;
            unitOfMeasure : String;
        }
    For these two Entities defined for `@dataFormat : 'QUANTITY'/'AMOUNT'` please mark them as `@isCnsEntity: true`

-   Enums can be defined using `type` keyword in schema.cds inorder to get support of attributes of type `CODE`.

        type Etype          : String @assert.range enum {
            BUSINESS  = 'Business';
            CODEVALUE = 'Code Value';
        }
    

- Event can be defined in service.cds file in CAP project. It can be defined using `EVENT` keyword. Also, action of event, CREATE/UPDATE/DELETE should be maintained at the end of event name defined here inorder to get support of event metadata formation using this conversion service.

    For example: 

        EVENT  ProjectOrderService.customer.ssc.projectorderservice.event.projectOrderCreate;


- CDS import functionality can be utilised for conversion of an open api schema to CSN (Core Schema Notation). Open api schema, can be retrieved from Buisness API hub under SSCV2 space and then use the command
  cds.import.from.openapi("SalesSvcCloudV2_filename.json") which would generate the CSN.


