
This feature will support conversion of CAP - CDS based metadata to sales and service cloud metadata format. Metadata artifacts covered are service, entities, events, apis by taking reference of template defined currently in custom service with sales and service cloud metadata formats. Some manual intervention before uploading final metadata to sales and service cloud is needed.

### Overview of metadata conversion support:

#### Service

- No discrepancy in service metadata converted with metadata defined in template `data.json`.
- **Supported:** `name`, `title`, `description`, `authorizationRelevant`
- **Unsupported:** `fullName` (not present in `template.json`)

#### Entities

- **Supported:** 
  - `name`
  - `label` (human-readable format of name)
  - `entityType` (enum)
  - `root` (first entity in service)
  - `creatable`, `updatable`
  - `attributes`
- **Unsupported:** `objectTypeCode`
- **Notes:**
  - `entityType` is based on provided guidelines.
  - `objectTypeCode` not supported yet.
  - `creatable`, `updatable` of entity: default is `false`.
  - As per guidelines: `@odata.containment: false` → `creatable`, `updatable` = `true`.  
    If annotation exists but is `true`, then `creatable`, `updatable` = `false` (default behavior anyway).

#### Entity Attributes

- **Supported:**
  - `name`
  - `label` (human-readable format)
  - `dataType` (CAP ↔ Sales & Service Cloud): `STRING`, `BOOLEAN`, `NUMBER`, `DATETIME`, `OBJECT`, `ARRAY`, `INTEGER`
  - `dataFormat`: `STRING`, `UUID`, `EMAIL`, `CODE`, `URI`, `ALPHANUMERIC`, `FLOAT`, `DOUBLE`, `AMOUNT`, `QUANTITY`, `INT32`, `INT64`, `DATETIME`, `DATE`, `TIME`, `DURATION`
  - `nullable`: derived from `not null` property
  - `creatable`, `updatable`: default `true`; 
    - If `@Core.Immutable: true` or UUID field → `updatable: false`
    - If `@readonly: true` → `creatable`, `updatable: false`
  - `filterable`: determined by `@UI.HiddenFilter: true`
  - `enumOptions`: populated per guideline
- **Unsupported:**
  - `description` (not available due to CODELIST association not supported)
  - `dataFormat`: `TEXT`, `DEFAULT`

- **Associations Supported:**
  - `AMOUNT`: if custom annotation is defined. Also, for the AMOUNT field, if the elements will have a attribute of type - "cds.string" then it will be considered as a CODE field(currencyCode etc.), and the remaining field will be added as it is. For eg: if content field is present of type cds.integer or cds.decimal it will be handled accordingly.
  - `QUANTITY`: if custom annotation is defined.handling is similar to Amount field.
  - `CODE`: Enum-based.
  
- **Associations Not Supported:**
  - Dynamic code list (`CODEVALUE` entity type associations)

- **Other Notes:**
  - `searchable`, `sortable`, `searchResult`, `langDependent`: always `false`
  - `searchWeightage`: always `1`
  - `keyType`: `primary` for `key: true` attributes
  - `filterable`: `false` for `OBJECT`/`ARRAY` dataType or when `@UI.HiddenFilter: true`
  - `sourceEntity`, `targetEntity`, `targetService`: namespaces not included, to be maintained manually

---

### Events

- **Supported:**
  - `technicalName`
  - `label`
  - `entityReference`
  - `trigger` (should follow naming convention ending in CREATE/UPDATE/DELETE)

---
### APIs

- **Supported:**
  - `technicalName`
  - `title`
  - `description`
  - `apiPath`
  - `operations`:
    - `id`
    - `path`
    - `method`: `GET`, `POST`, `PATCH`, `DELETE`
    - `request`:
      - `pathVariable`: `name`, `dataType`, `dataFormat`
    - `responses`: `description`, `responseCode` (200, 400, 401, 403, 404, 500)
    - `entityReference`
- **Unsupported:** `method: query`

> **Note:** Currently only API metadata for root entity is supported. APIs for child entities are not yet generated. Need to be set manually.
> Api methods - `GET` `POST` `PATCH` `DELETE`

---

### Limitations

- First entity in CDS schema is assumed as the root.
- `@create`, `@update` required on attributes. Defaults:
  - `creatable`, `updatable = true` for non-key fields
  - For key: `creatable = true`, `updatable = false`
- `@Core.Immutable: true` or UUID → `creatable: true`, `updatable: false`
- `@readonly: true` → `creatable`, `updatable = false`
- `@UI.HiddenFilter: true` → `filterable = false`.  
  - If not present → `filterable = true` by default
- Attribute composition: 
  - `to many` → `ARRAY`
  - `1:1` → `OBJECT`
- `@dataFormat: AMOUNT` or `QUANTITY` must be set for correct mapping
- Enums via `type` keyword:

    ```cds
    type Etype : String @assert.range enum {
        BUSINESS = 'Business';
        CODEVALUE = 'Code Value';
    }
    ```

- Multiple `service .cds` files supported by combining into single JSON via `cds` commands.  
  Currently only one service-based JSON is supported.
- Event needs to be defined in `service.cds` file. It can be defined using the `EVENT` keyword. Also, the trigger (`CREATE`, `UPDATE`, `DELETE`) should be maintained at the end of the event name, like `projectOrderCreate`.

---

### Mapping DataType and Data formats of CAP and Sales & Service cloud.

| Cloud Data Type | Data Format   | CAP Data Type | Description                 | Supported | Comments                                                                 |
|-----------------|---------------|----------------|-----------------------------|-----------|--------------------------------------------------------------------------|
| STRING          | STRING         | String          | Default string              | YES       |                                                                          |
|                 | UUID           | UUID            | UUID                        | YES       |                                                                          |
|                 | EMAIL          | String          | Email                       | YES       |                                                                          |
|                 | CODE           | String          | Code List                   | YES       |                                                                          |
|                 | TOKEN          | String          | Token format                | YES       | Requires `@dataFormat: 'TOKEN'`                                          |
|                 | URI            | String          | URI format                  | YES       | Requires `@dataFormat: 'URI'`                                            |
| NUMBER          | FLOAT          | Decimal         | Default number              | YES       |                                                                          |
|                 | DOUBLE         | Double          | Double-precision            | YES       |                                                                          |
| BOOLEAN         | -              | Boolean         | Boolean type                | YES       |                                                                          |
| OBJECT          | AMOUNT/QUANTITY| Aspect types    | Complex structures          | YES       | `TEXT` not supported/tested                                              |
| ARRAY           | -              | Array<type>     | Array type                  | YES       |                                                                          |
| INTEGER         | INT32          | Integer         | Default integer             | YES       |                                                                          |
|                 | INT64          | Int64           | Long integer                | YES       |                                                                          |
| DATETIME        | DATETIME       | DateTime        | DateTime type               | YES       |                                                                          |
|                 | DATE           | Date            | Date                        | YES       |                                                                          |
|                 | TIME           | Time            | Time                        | YES       |                                                                          |

---
> **Note:**  Database specific data types like real_vector or blob are not supported in CNS and there is no alternative.

### Open Points & Future Work

- `objectTypeCode` are internally generated
- Dynamic Code List: partial implementation, requires testing
- External entity associations (e.g., CNS entity in same service)
  - Proposed: `@isCnsEntity` annotation
- Cannot determine `targetEntity`/`targetService` fullnames for external associations
- `searchable`: not supported; requires analysis of `cds.search`

---

