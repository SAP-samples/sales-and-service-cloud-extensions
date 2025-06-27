import {
  dataTypeDFMapping,
  dataTypeMapping,
  entityTypeEnum,
} from './constants';
import {
  elementFormat,
  enumOptions,
} from '../common/interfaces/elements.interface';
import {
  NotImplementedException,
  MethodNotAllowedException,
} from '@nestjs/common';

const crypto = require('crypto'); //@typescript-eslint/no-var-requires

//function to return service Name and isEntity, EntityFullName based on serviceName
export function getEntityDetails(artifact, key, serviceName?) {
  if (artifact.kind === 'entity' && key.split('.')[0] === serviceName) {
    const entityFullName = artifact.projection?.from?.ref[0];
    const isEntity = true;
    const nameSpace = entityFullName.substring(0, entityFullName.lastIndexOf('.'));
    return { entityFullName, isEntity, nameSpace };
  }
}

//function to return service name
export function getServiceName(artifact, key) {
  if (artifact.kind === 'service') {
    const serviceName = key;
    return serviceName;
  }
}

//function to generate object Type code for root entity.
export function generateObjectTypeCode(isRoot, entityType) {
  if (isRoot === true && entityType === entityTypeEnum.BUSINESS) {
    const randomInt = crypto.randomInt(1000, 10000);
    const objectTypeCode = 'CUS' + randomInt;
    return objectTypeCode;
  }
}

//Function that constructs label for an attribute(key).
export function getLabel(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
}

//Function to get entity type : ["BUSINESS" OR "CODEVALUE"]
export function getEntityType(artifact) {
  let entityType;
  if (artifact.hasOwnProperty('@type')) {
    entityType = artifact['@type']['='].split('.').pop();
    if (!isValidEntityType(entityType)) {
      entityType = '';
    }
  }
  return entityType;
}

function isValidEntityType(entityType: string): boolean {
  return Object.values(entityTypeEnum).includes(entityType as entityTypeEnum);
}

export function isEntityCreateUpdateEnabled(artifact) {
  let creatable = false,
    updatable = false;
  if (artifact.hasOwnProperty('@odata.containment')) {
    creatable = !artifact['@odata.containment']; // if not contained then entity can exists independently. creatable - true when containment is false.
    updatable = !artifact['@odata.containment']; // if not contained then entity can exists independently. updatable - true when containment is false.
  }
  return { creatable, updatable };
}

export function mapDataType(cdsSchema, attributeProperties) {
  // if type is cds built-in dataTypes.
  if (attributeProperties?.type?.startsWith('cds.')) {
    return dataTypeMapping[attributeProperties?.type];
  }
  // if type is user defiend types or not pre-defined dataTypes.
  else {
    let dataType = 'UNKNOWN';
    const typeAttribute = attributeProperties?.type;
    if (typeAttribute) {
      dataType = cdsSchema.definitions[typeAttribute]?.type;
      while (dataType && !dataType.startsWith('cds.')) {
        dataType = cdsSchema.definitions[dataType]?.type;
      }
      return dataTypeMapping[dataType] || 'UNKNOWN'; // Return the mapped data type or "UNKNOWN" if not found
    }
  }
}

export function mapDataFormat(cdsSchema, attributeProperties) {
  const type = attributeProperties?.type;
  if (!type.startsWith('cds.')) {
    const typeArtifact = cdsSchema.definitions[type];
    if ('enum' in typeArtifact) {
      return 'CODE';
    } else {
      return buildDataFormat(attributeProperties, type);
    }
  }
  if (type === 'cds.Association' || type === 'cds.Composition') {
    return null;
  }
  return buildDataFormat(attributeProperties, type);
}

function buildDataFormat(attributeProperties, type) {
  return attributeProperties.hasOwnProperty('@dataFormat')
    ? attributeProperties['@dataFormat']
    : dataTypeDFMapping[type] || 'STRING';
}

export function buildEnumOptions(
  cdsSchema: any,
  attribute: string,
  attributeProperties: any,
  entityFullName: string,
) {
  const typeArtifact = cdsSchema.definitions[attributeProperties?.type];
  let enumOptions: Array<enumOptions>;
  if ('enum' in typeArtifact) {
    enumOptions = Object.entries(typeArtifact?.enum).map(
      ([key, value]: [string, { val: string }]) => ({
        code: value.val,
        description: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        default: false,
      }),
    );
  }
  return enumOptions;
}

export function isDescriptionAttribute(attributeProperties) {
  return attributeProperties['@description'] === true ? true : undefined;
}

export function getDataType(associationDetails, dataType) {
  if (associationDetails?.dataType) {
    return associationDetails.dataType;
  } else {
    return dataType;
  }
}

export function getDataFormat(dataType, associationDetails, dataFormat) {
  if (dataType !== 'BOOLEAN') {
    if (associationDetails) {
      return associationDetails?.dataFormat || undefined;
    } else {
      return dataFormat;
    }
  } else {
    return undefined;
  }
}

function isNullableAttribute(attributeProperties) {
  if (
    attributeProperties.hasOwnProperty('notNull') &&
    attributeProperties['notNull'] === true
  ) {
    return false;
  }
  if (attributeProperties.type === 'cds.UUID') {
    return false;
  }
  return true;
}

function isCreatableUpdatableAttribute(attributeProperties) {
  let creatable = true,
    updatable = true;
  if (
    (attributeProperties.hasOwnProperty('@Core.Immutable') &&
      attributeProperties['@Core.Immutable'] === true) ||
    attributeProperties.type === 'cds.UUID'
  ) {
    creatable = true;
    updatable = false;
  } else if (
    attributeProperties.hasOwnProperty('@readonly') &&
    attributeProperties['@readonly'] === true
  ) {
    creatable = false;
    updatable = false;
  }
  return { creatable, updatable };
}

function isFilterableAttribute(attributeProperties, attrDataType) {
  let filterable = true;
  if(attrDataType === 'OBJECT' || attrDataType === 'ARRAY') {
    filterable = false;
  }else if (attributeProperties.hasOwnProperty('@UI.HiddenFilter')) {
    filterable = !attributeProperties['@UI.HiddenFilter']; // filterable: true when @UI.HiddenFilter : false, filterable: false when @UI.HiddenFilter: true
  }
  return filterable;
}

function getKeyType(attributeProperties, associationDetails) {
  if (attributeProperties?.key === true) {
    return 'PRIMARY';
  } else if (associationDetails?.keyType) {
    return associationDetails.keyType;
  }
  return undefined;
}

export function buildFormattedElement(
  attribute,
  attributeProperties,
  associationDetails,
  dataType,
  dataFormat,
  enumOptions,
) {
  const name = attribute.toLowerCase();
  const label = getLabel(attribute);
  const isDescAttribute = isDescriptionAttribute(attributeProperties);
  const attrDataType = getDataType(associationDetails, dataType);
  const attrDataFormat = getDataFormat(
    dataType,
    associationDetails,
    dataFormat,
  );
  const isAttrNullable = isNullableAttribute(attributeProperties);
  const isAttrCreatable =
    isCreatableUpdatableAttribute(attributeProperties).creatable;
  const isAttrUpdatable =
    isCreatableUpdatableAttribute(attributeProperties).updatable;
  const isAttrFilterable = isFilterableAttribute(attributeProperties, attrDataType);
  const attrKeyType = getKeyType(attributeProperties, associationDetails);
  // console.log('associationDetails:', associationDetails?.objectDefinition);
  // const descriptionAttribute = associationDetails ? attribute.toLowerCase().concat('Description') : undefined;
  const formattedElement: elementFormat = {
    name: name,
    label: label,
    description: isDescAttribute,
    dataType: attrDataType,
    itemDataType: associationDetails?.itemDataType,
    dataFormat: attrDataFormat,
    nullable: isAttrNullable, // Assume nullable if not specified
    creatable: isAttrCreatable, // If immutable, it can't be created
    updatable: isAttrUpdatable, // If readOnly, it can't be updated
    filterable: isAttrFilterable, // if HiddenFilter is true, it is not filterable.
    enumOptions: enumOptions ? enumOptions : undefined,
    searchable: false,
    sortable: false, // Default searchable to true
    searchResult: false,
    searchWeightage: 1, // Default search weightage to 1
    keyType: attrKeyType,
    // descriptionAttribute: descriptionAttribute,
    objectDefinition:
      associationDetails?.objectDefinition.length > 0
        ? [...associationDetails?.objectDefinition]
        : undefined,
    languageDependent: false,
    labelTextId: '',
  };
  return formattedElement;
}

export function checkHttpActions(
  req: Request,
  next,
  allowedMethods,
  TobeImplementedMethods,
) {
  if (allowedMethods.includes(req.method)) {
    next();
  } else if (TobeImplementedMethods.includes(req.method)) {
    throw new NotImplementedException();
  } else {
    throw new MethodNotAllowedException();
  }
}

export function createOperation(
  id,
  path,
  method,
  pathVariables,
  responseCodes,
) {
  return {
    id,
    path,
    method,
    request: { pathVariables },
    responses: generateResponses(responseCodes),
  };
}

// Helper function to generate responses
function generateResponses(codes) {
  const descriptions = {
    200: '200 OK',
    201: '201 Created',
    400: '400 BAD_REQUEST',
    401: '401 UNAUTHORIZED',
    403: '403 FORBIDDEN',
    404: '404 NOT_FOUND',
    500: '500 INTERNAL_SERVER_ERROR',
  };

  return codes.map((code) => ({
    description: descriptions[code],
    responseCode: code.toString(),
  }));
}
