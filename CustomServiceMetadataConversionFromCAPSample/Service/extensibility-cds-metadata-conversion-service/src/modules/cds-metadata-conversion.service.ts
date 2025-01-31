import { Injectable } from '@nestjs/common';
import {
  i18nEntities,
} from '../common/constants';
import {
  AdminData,
  convertedMetadata,
  elementFormat,
  entityFormat,
  eventFormat,
} from '../common/interfaces/elements.interface';
import {
  getServiceName,
  getEntityDetails,
  getLabel,
  getEntityType,
  isEntityCreateUpdateEnabled,
  mapDataType,
  mapDataFormat,
  buildEnumOptions,
  buildFormattedElement,
  createOperation,
} from '../common/utils';
import * as jsonata from 'jsonata';
const crypto = require('crypto');

@Injectable()
export class CdsMetadataConversionService {
  async convertMetadata(cdsSchema) {
    let serviceName,
      entities = [],
      entityDetails,
      convertedMetadata: convertedMetadata = {
        service: {
          technicalName: '',
          label: '',
          description: '',
          authorizationRelevant: true,
        },
        entities: [],
        events: [],
        apis: [],
      },
      isRoot = true;
    for (const key of Object.keys(cdsSchema.definitions)) {
      const artifact = cdsSchema.definitions[key];
      if (artifact.kind === 'service') {
        serviceName = getServiceName(artifact, key);
        const serviceMetadata = this.buildServiceMetadata(serviceName);
        convertedMetadata.service = serviceMetadata;
      } else if (artifact.kind === 'event') {
        const event = this.buildEvent(key);
        convertedMetadata.events.push(event);
      } else {
        entityDetails = getEntityDetails(artifact, key, serviceName);
      }

      if (entityDetails?.isEntity === true) {
        const entityType = getEntityType(artifact);
        // const objectTypeCode = generateObjectTypeCode(isRoot, entityType);   --- Commented as we should not generate object type code using random because it might lead to duplicate object type codes in CNS.
        const { creatable, updatable } = isEntityCreateUpdateEnabled(artifact);
        const entity: entityFormat = {
          name: key.split('.')[1], // string - Alphanumeric without space in between.
          label: getLabel(key.split('.')[1]), // string.
          entityType: entityType || 'BUSINESS', // enum ["BUSINESS" , "CODEVALUE"]. DEFAULT "BUSINESS".
          // objectTypeCode: objectTypeCode || undefined, // Only for BUSINESS ROOT entity
          root: isRoot === true ? true : false,
          creatable: creatable,
          updatable: updatable,
          attributes: [],
        };
        if (entity.root === true) {
          isRoot = false;
        }
        const attributes: Array<elementFormat> | any =
          await this.buildAttributes(
            cdsSchema,
            artifact,
            key,
            entityDetails?.entityFullName,
          );
        entities.push(key);
        entity.attributes = attributes;
        convertedMetadata.entities.push(entity);
      }
    }

    const apiMetadata = this.parseSchemaForApiMetadata(
      cdsSchema,
      serviceName,
      entities,
    );
    if (apiMetadata) {
      convertedMetadata.apis.push(apiMetadata);
    }
    return convertedMetadata;
  }

  parseSchemaForApiMetadata(cdsSchema, serviceName, entities) {
    if (entities.length > 0) {
      const serviceDefinition = cdsSchema.definitions[`${serviceName}`];
      const entityKey = entities[0];
      const entityName = entityKey?.split('.').pop();
      // const entityDefinition = cdsSchema.definitions[entityKey];
      const apiPath = serviceDefinition?.hasOwnProperty('@path')
        ? `${serviceDefinition['@path']}/${entityName}`
        : '';
      const technicalName = `${entityName}ApiCAP`;
      const description = `API for interacting with BTP ${entityName} service`;
      const title = `BTP ${entityName} API`;
      const entityReference = entityKey;

      const operations = [
        createOperation(
          `read${entityName}`,
          '/',
          'READ',
          [],
          [200, 400, 401, 403, 404, 500],
        ),
        createOperation(
          `read${entityName}`,
          '/{id}',
          'READ',
          [{ name: 'id', dataType: 'STRING', dataFormat: 'UUID' }],
          [200, 400, 401, 403, 404, 500],
        ),
        createOperation(
          `create${entityReference}`,
          '/',
          'POST',
          [],
          [201, 400, 401, 403, 500],
        ),
        createOperation(
          `update${entityReference}`,
          '/{id}',
          'PATCH',
          [{ name: 'id', dataType: 'STRING', dataFormat: 'UUID' }],
          [200, 400, 401, 403, 404, 500],
        ),
        createOperation(
          `delete${entityReference}`,
          '/{id}',
          'DELETE',
          [{ name: 'id', dataType: 'STRING', dataFormat: 'UUID' }],
          [200, 400, 401, 403, 404, 500],
        ),
      ];

      return {
        technicalName,
        title,
        description,
        apiPath,
        operations,
        entityReference,
      };
    }
  }

  async buildAttributes(
    cdsSchema,
    artifact,
    currentEntity,
    entityFullName: string,
  ) {
    let attributes = [];

    // build and update adminData to attributes of entity.
    // const adminData = await this.buildAdminData(entityFullName);
    // attributes.push(adminData);

    const attributePromises = Object.keys(artifact.elements)
      .filter(
        (attribute) =>
          !['createdBy', 'createdAt', 'modifiedBy', 'modifiedAt'].includes(
            attribute,
          ),
      )
      .map((attribute) => {
        let dataType, dataFormat, enumOptions, attributeProperties;

        attributeProperties = artifact.elements[attribute];
        dataType = mapDataType(cdsSchema, attributeProperties);
        dataFormat = mapDataFormat(cdsSchema, attributeProperties);

        if (dataFormat === 'CODE') {
          enumOptions = buildEnumOptions(
            cdsSchema,
            attribute,
            attributeProperties,
            entityFullName,
          );
        }

        const associationDetails = this.buildAssociationDetails(
          cdsSchema,
          attribute,
          attributeProperties,
          currentEntity,
          entityFullName,
          getLabel,
          mapDataType,
        );

        const formattedElement: elementFormat = buildFormattedElement(
          attribute,
          attributeProperties,
          associationDetails,
          dataType,
          dataFormat,
          enumOptions,
        );
        return formattedElement;
      });
    const resolvedAttributes = await Promise.all(attributePromises);
    attributes.push(...resolvedAttributes);
    // console.log('attr after:', attributes);
    return attributes;
  }

  async buildAdminData(entityFullName): Promise<AdminData> {
    const adminData: AdminData = {
      name: 'adminData',
      dataType: 'OBJECT',
      creatable: true,
      updatable: true,
      nullable: true,
      sortable: false,
      filterable: false,
      searchable: false,
      searchResult: false,
      languageDependent: false,
      objectDefinition: [],
      structReference: 'sap.crm.common.struct.adminData',
      analyticsRelevant: true,
    };
    const objectDefinition = await this.buildAdminDataObjDefinition(
      entityFullName,
    );
    adminData.objectDefinition = objectDefinition;
    return adminData;
  }

  async buildAdminDataObjDefinition(
    sourceEntity,
  ): Promise<Array<elementFormat>> {
    const adminData = [
      {
        name: 'createdBy',
        dataType: 'STRING',
        dataFormat: 'UUID',
        keyType: 'FOREIGN',
        objectReference: {
          associationType: 'ASSOCIATION',
          sourceEntity: '',
          sourceAttribute: 'adminData.createdBy',
          targetAttribute: 'id',
          targetEntity: 'sap.crm.userservice.entity.user',
          keyGroup: 'createdByUser',
          targetService: 'sap.crm.service.userService',
        },
      },
      {
        name: 'createdByName',
        dataType: 'STRING',
        objectReference: {
          associationType: 'REFERENCE',
          sourceEntity: '',
          targetAttribute: 'displayName',
          keyGroup: 'createdByUser',
        },
      },
      {
        name: 'createdOn',
        dataType: 'DATETIME',
      },
      {
        name: 'updatedBy',
        dataType: 'STRING',
        dataFormat: 'UUID',
        keyType: 'FOREIGN',
        objectReference: {
          associationType: 'ASSOCIATION',
          sourceEntity: '',
          sourceAttribute: 'adminData.updatedBy',
          targetAttribute: 'id',
          targetEntity: 'sap.crm.userservice.entity.user',
          keyGroup: 'updatedByUser',
          targetService: 'sap.crm.service.userService',
        },
      },
      {
        name: 'updatedByName',
        dataType: 'STRING',
        objectReference: {
          associationType: 'REFERENCE',
          sourceEntity: '',
          targetAttribute: 'displayName',
          keyGroup: 'updatedByUser',
        },
      },
      {
        name: 'updatedOn',
        dataType: 'DATETIME',
      },
    ];
    const createElementFormat = (item, sourceEntity) => {
      const attribute = {
        name: item.name,
        dataType: item.dataType,
        dataFormat: item?.dataFormat,
        creatable: false,
        updatable: false,
        nullable: true,
        sortable: false,
        filterable: false,
        searchable: false,
        searchResult: false,
        languageDependent: false,
        labelTextId: `sap.crm.common.commonText.${item.name}`,
        keyType: item?.keyType,
        objectReference: item?.objectReference,
        analyticsRelevant: true,
        label:
          item.name.charAt(0).toUpperCase() +
          item.name.slice(1).replace(/([A-Z])/g, ' $1'), // Capitalize and space camelCase
      };
      if (item?.objectReference) {
        attribute.objectReference.sourceEntity = sourceEntity;
      }
      return attribute;
    };

    // Map through adminData to build the elements
    const objectDefinition = adminData.map((item) =>
      createElementFormat(item, sourceEntity),
    );
    return objectDefinition;
  }

  buildAssociationDetails(
    cdsSchema,
    attribute: string,
    elementProps: any,
    sourceEntity,
    entityFullName: string,
    toLabel,
    mapDataType,
    isComposition?: boolean,
    compositionParentName?: string,
  ) {
    let associationDetails, targetService;
    if (
      elementProps?.type === 'cds.Association' ||
      elementProps?.type === 'cds.Composition'
    ) {
      let targetEntity = elementProps.target;
      const i18nEntity = this.checkI18NTarget(elementProps);
      if (i18nEntity?.targetEntity) {
        targetEntity = i18nEntity.targetEntity;
        targetService = i18nEntity.targetService;
      }
      const dataType = this.buildDataTypeForAssociation(elementProps);
      const dataFormat = this.buildDataFormatForAssociation(
        elementProps
      );
      const itemDataType = dataType === 'ARRAY' ? 'OBJECT' : undefined;
      const query = `definitions."${targetEntity}".elements`;
      const expression = jsonata(query);
      const targetEntityAttributes = expression.evaluate(cdsSchema);
      // const associationAttributeHeader = await this.buildAssociationAttributeHeader(cdsSchema, attribute, elementProps, entityFullName, toLabel, mapDataType, targetEntityAttributes, targetEntity);
      const objectDefinition = this.buildObjectDefinition(
        cdsSchema,
        attribute,
        elementProps,
        sourceEntity,
        entityFullName,
        targetEntityAttributes,
        targetEntity,
        mapDataType,
        isComposition,
        compositionParentName,
      );
      associationDetails = {
        dataType: dataType,
        itemDataType: itemDataType,
        objectDefinition: objectDefinition,
        dataFormat: dataFormat.length > 0 ? dataFormat : undefined,
      };
    }
    return associationDetails;
  }

  buildObjectDefinition(
    cdsSchema: any,
    attribute: any,
    elementProps: any,
    sourceEntity,
    entityFullName,
    targetEntityAttributes: any,
    targetEntity: any,
    mapDataType: any,
    isComposition?: boolean,
    compositionParentName?: string,
  ) {
    const objectDefinition = [];
    let associationDetails;
    let query = `on[2].ref[0]`;
    let expression = jsonata(query);
    let sourceAttribute = expression.evaluate(elementProps);
    if (sourceAttribute === '$self') {
      query = `definitions."${sourceEntity}".elements`;
      expression = jsonata(query);
      const sourceAttributes = expression.evaluate(cdsSchema);
      sourceAttribute = Object.keys(sourceAttributes).find((key) => {
        return sourceAttributes[key].key === true;
      });
    }
    query = `on[0].ref[1]`;
    expression = jsonata(query);
    const targetAttribute = expression.evaluate(elementProps);
    for (const [key, value] of Object.entries(targetEntityAttributes)) {
      const attributes: {
        name: string;
        dataType: string;
        dataFormat?: string;
        creatable: boolean;
        updatable: boolean;
        nullable: boolean;
        sortable: boolean;
        filterable: boolean;
        searchable: boolean;
        searchResult: boolean;
        languageDependent: boolean;
        label: string;
        keyType?: string;
        objectReference?: {};
        objectDefinition?: Array<elementFormat>;
      } = {
        name: key,
        dataType: mapDataType(cdsSchema, targetEntityAttributes[key]),
        creatable: false,
        updatable: false,
        nullable: true,
        sortable: false,
        filterable: false,
        searchable: false,
        searchResult: false,
        languageDependent: false,
        label: `lbl_${attribute}_${key}`,
      };
      if (targetEntityAttributes[key]?.key === true) {
        attributes.keyType = 'FOREIGN';
        attributes.dataFormat = 'UUID';
        attributes.objectReference = {
          associationType: 'ASSOCIATION',
          sourceEntity: sourceEntity.split('.')[1],
          sourceAttribute:
            sourceAttribute?.toLowerCase() ||
            (isComposition === true
              ? `${compositionParentName}`.concat(
                  '.' + `${attribute}` + '.' + `${key}`,
                )
              : attribute.concat('.' + `${key}`)),
          targetEntity: targetEntity.split('.')[1],
          targetAttribute: targetAttribute?.toLowerCase() || `${key}`,
          keyGroup: attribute,
          targetService: targetEntity.split('.')[0],
        };
      } else {
        attributes.objectReference = {
          associationType: 'REFERENCE',
          sourceEntity: sourceEntity.split('.')[1],
          targetAttribute: key,
          keyGroup: attribute,
        };
      }
      if (attributes.dataType === 'COMPOSITION') {
        isComposition = true;
        compositionParentName = attribute;
        delete attributes.objectReference;
        const elementProps = targetEntityAttributes[key];
        associationDetails = this.buildAssociationDetails(
          cdsSchema,
          key,
          elementProps,
          sourceEntity,
          entityFullName,
          getLabel,
          mapDataType,
          isComposition,
          compositionParentName,
        );
        attributes.dataType = associationDetails.dataType;
        attributes.objectDefinition = associationDetails.objectDefinition;
        objectDefinition.push(attributes);
      } else if (attributes.dataType === 'ASSOCIATION') {
        //don't consider for now.
      } else {
        objectDefinition.push(attributes);
      }
    }

    return objectDefinition;
  }

  // fetchTargetAttributeForAssociation(cdsSchema, targetEntity) {
  //   // get cdsSchema[targetEntity].elements where @description is true;
  //   let targetAttribute;
  //   try {
  //     const query = '$keys(elements)';
  //     const result = jsonata(query).evaluate(
  //       cdsSchema.definitions[targetEntity],
  //     );
  //     targetAttribute = result.find((key) => {
  //       return (
  //         cdsSchema.definitions[targetEntity].elements[key]['@description'] ===
  //         true
  //       );
  //     });
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  //   return targetAttribute;
  // }  ---   To be used for AMOUNT and QUANTITY associations.

  buildDataTypeForAssociation(elementProps) {
    let dataType;
    if (
      elementProps?.cardinality?.max?.toString() === '1' ||
      elementProps?.cardinality?.max === undefined
    ) {
      dataType = 'OBJECT';
    } else if (elementProps?.cardinality?.max === '*') {
      dataType = 'ARRAY';
    }
    return dataType;
  }

  buildDataFormatForAssociation(
    elementProps
  ) {
    // let targetEntityDetails = cdsSchema.definitions[targetEntity];

    // // let dataFormat = await this.resolveDataFormat(cdsSchema, targetEntityDetails, targetEntity, targetAttribute);
    // let dataFormat = targetEntityDetails?.elements[targetAttribute]?.type;
    // if(i18nEntities.includes(targetEntity)){
    //     dataFormat = 'CODE'
    // }
    // else if( dataFormat === 'cds.Association'){
    //     let targetEntity = targetEntityDetails?.elements[targetAttribute]?.target; // Accounts entity
    //     let targetEntityDetail = cdsSchema.definitions[targetEntity]; // Account entity details with elements in it
    //     let targetAttr = targetEntityDetails?.elements[targetAttribute]?.keys[0]?.ref[0];
    //     dataFormat = dataFormatMapping[targetEntityDetail?.elements[targetAttr]?.type] || "UNKNOWN";
    //     // console.log('resolved data format:', dataFormat);
    // }
    // else{
    // const dataFormat = dataFormatMapping[dataFormat] || "UNKNOWN";
    // }
    // return dataFormat;
    if (
      elementProps.hasOwnProperty('@dataFormat') ||
      elementProps.hasOwnProperty('@type')
    ) {
      return elementProps['@dataFormat'] || elementProps['@type'];
    } else {
      return '';
    }
  }

  // Commented for future use if needed.
  // async buildAttributesWithUsrDefTypes(
  //   cdsSchema,
  //   attribute: string,
  //   elementProps: any,
  //   currentEntity,
  //   entityFullName: string,
  //   toLabel,
  //   mapDataType,
  // ) {
  //   if (!elementProps?.type?.startsWith('cds.')) {
  //     let typeDataType, keyType, artifact;
  //     let attributes = [];
  //     // it is user defined data type.
  //     const typeAttribute = elementProps?.type;
  //     if (typeAttribute) {
  //       while (
  //         !cdsSchema?.definitions[typeAttribute]?.type?.startsWith('cds.')
  //       ) {
  //         typeDataType = cdsSchema.definitions[typeAttribute]?.type;
  //       }
  //       artifact = cdsSchema.definitions[typeAttribute];
  //     }
  //     const entityFullName = artifact?.projection?.from?.ref[0];
  //     // const attributes = await this.buildAttributes(cdsSchema, artifact, entityFullName);
  //     const associationDetails = await this.buildAssociationDetails(
  //       cdsSchema,
  //       attribute,
  //       elementProps,
  //       currentEntity,
  //       entityFullName,
  //       toLabel,
  //       mapDataType,
  //     );
  //     const dataType = mapDataType(elementProps?.type);
  //     let dataFormat = 'STRING';
  //     if (elementProps.key === true) {
  //       keyType = 'PRIMARY';
  //       dataFormat = 'UUID';
  //     }
  //     let formattedElement: elementFormat = {
  //       name: attribute.toLowerCase(),
  //       label: toLabel(attribute),
  //       dataType: associationDetails?.dataType || dataType,
  //       dataFormat:
  //         dataType !== 'BOOLEAN'
  //           ? associationDetails?.dataFormat || dataFormat
  //           : null,
  //       nullable: !elementProps.hasOwnProperty('notNull'), // Assume nullable if not specified
  //       creatable: !elementProps['@Core.Immutable'], // If immutable, it can't be created
  //       updatable: !elementProps['@readonly'], // If readOnly, it can't be updated
  //       filterable: !elementProps['@UI.HiddenFilter'], // if HiddenFilter is true, it is not filterable.
  //       searchable: true, // Default searchable to true
  //       searchResult: false,
  //       searchWeightage: 1, // Default search weightage to 1                                                                                                                   // Default analytics relevance to true
  //       keyType:
  //         elementProps.key === true
  //           ? 'PRIMARY'
  //           : associationDetails?.keyType || undefined,
  //       descriptionAttribute:
  //         associationDetails?.descriptionAttribute || undefined,
  //       objectReference: associationDetails?.objectReference || null,
  //       sortable: false,
  //       languageDependent: false,
  //       labelTextId: '',
  //     };
  //     attributes.push(formattedElement);
  //     if (
  //       elementProps.type === 'cds.Association' ||
  //       elementProps.type === 'cds.Composition'
  //     ) {
  //       // descAttrDetails = await this.buildDescriptionAttributeForAssociation(attribute, entityFullName, toLabel);
  //       const objectReference = {
  //         associationType: 'REFERENCE',
  //         sourceEntity: entityFullName,
  //         targetAttribute: associationDetails?.descriptionAttribute,
  //         keyGroup: entityFullName.split('.').pop().concat(attribute),
  //       };
  //       let formattedElement: elementFormat = {
  //         name: attribute.toLowerCase().concat('Description'),
  //         label: toLabel(attribute),
  //         dataType: 'STRING',
  //         nullable: true,
  //         creatable: false,
  //         updatable: false,
  //         filterable: false,
  //         sortable: true,
  //         searchWeightage: 1, // Default search weightage to 1
  //         objectReference: objectReference,
  //         languageDependent: true,
  //         labelTextId: '',
  //       };
  //       attributes.push(formattedElement);
  //     }
  //     return attributes;
  //   }
  // }

  checkI18NTarget(elementProps) {
    let i18nEntity;
    const title = elementProps?.['@title'];
    if (title && title.startsWith('{i18n>')) {
      i18nEntity = title.split('{i18n>')[1].split('}')[0].trim();
      const targetEntity = i18nEntities.find((entityFullName) => {
        const entity = entityFullName.split('.').pop().trim(); // Extract and trim the last word
        return entity.toLowerCase() === i18nEntity.toLowerCase(); // Case-insensitive match
      });
      i18nEntity = {
        targetEntity: targetEntity,
        targetService: 'sap.crm.service.i18nService',
      };
    }
    return i18nEntity;
  }

  // Commented for future use if needed.
  // async checkComposition(
  //   cdsSchema,
  //   attribute: string,
  //   elementProps: any,
  //   entityFullName: string,
  // ) {
  //   let associationDetails;
  //   if (elementProps.type === 'cds.Association') {
  //     const targetEntity = elementProps.target;
  //     const objectReference = {
  //       sourceEntity: entityFullName,
  //       sourceAttribute: attribute,
  //       targetEntity: targetEntity,
  //       targetAttribute: elementProps?.keys[0]?.ref[0],
  //     };
  //     const dataType = await this.buildDataTypeForAssociation(elementProps);
  //     const dataFormat = await this.buildDataFormatForAssociation(
  //       cdsSchema,
  //       entityFullName,
  //       attribute,
  //       elementProps,
  //       targetEntity,
  //       objectReference.targetAttribute,
  //     );
  //     associationDetails = {
  //       objectReference: objectReference,
  //       dataType: dataType,
  //       dataFormat: dataFormat,
  //     };
  //   }
  //   return associationDetails;
  // }

  // Commented for future use if needed.
  // async buildAttrWithComposition(
  //   cdsSchema,
  //   attribute: string,
  //   elementProps: any,
  //   entityFullName: string,
  //   toLabel,
  //   mapDataType,
  // ) {
  //   let associationDetails,
  //     targetService,
  //     descriptionAttribute,
  //     descAttrDetails;
  //   if (elementProps.type === 'cds.Composition') {
  //     let targetEntity = elementProps.target;
  //     const i18nEntity = this.checkI18NTarget(elementProps);
  //     if (i18nEntity?.targetEntity) {
  //       targetEntity = i18nEntity.targetEntity;
  //       targetService = i18nEntity.targetService;
  //     }
  //     const objectReference = {
  //       associationType: 'ASSOCIATION',
  //       sourceEntity: entityFullName,
  //       sourceAttribute: attribute,
  //       targetEntity: targetEntity,
  //       targetAttribute: elementProps?.keys[0]?.ref[0],
  //       targetService: targetService || targetEntity.split('.')[0], // took service short name from target in association details which is basically service.entity format... fill on demand.
  //       keyGroup: entityFullName?.split('.').pop().concat(attribute),
  //     };
  //     const dataType = await this.buildDataTypeForAssociation(elementProps);
  //     const dataFormat = await this.buildDataFormatForAssociation(
  //       cdsSchema,
  //       entityFullName,
  //       attribute,
  //       elementProps,
  //       targetEntity,
  //       objectReference.targetAttribute,
  //     );
  //     associationDetails = {
  //       keyType: 'FOREIGN',
  //       objectReference: objectReference,
  //       dataType: dataType,
  //       dataFormat: dataFormat,
  //     };
  //   }
  //   return associationDetails;
  // }

  buildEvent(key) {
    let event: eventFormat;
    const keyParts = key.split('.');
    const triggerWithSuffix = keyParts[keyParts.length - 1];
    const trigger = triggerWithSuffix
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .pop()
      .toUpperCase();
    const entityReference = triggerWithSuffix
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/Create$|Update$|Delete$/, '')
      .trim();
    const formattedEntityReference = entityReference
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    const technicalName = keyParts[keyParts.length - 1]
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    const label = technicalName
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/Create$|Update$|Delete$/, '')
      .trim();
    event = {
      technicalName: technicalName,
      label: label,
      entityReference: formattedEntityReference,
      trigger: trigger,
    };
    return event;
  }

  buildServiceMetadata(serviceName) {
    const service = {
      technicalName: serviceName,
      label: getLabel(serviceName),
      description: `This service is for ${serviceName}.`,
      authorizationRelevant: true,
    };
    return service;
  }
}
