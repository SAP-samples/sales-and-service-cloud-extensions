export interface objectReference {
  associationType: string;
  sourceEntity: string;
  sourceAttribute?: string;
  targetAttribute: string;
  targetEntity?: string;
  keyGroup: string;
  targetService?: string;
}

export interface elementFormat {
  name: string;
  label: string;
  description?: boolean;
  dataType: string;
  dataFormat?: string;
  nullable: boolean;
  creatable: boolean;
  updatable: boolean;
  filterable: boolean; // Default filterable to true, unless specified otherwise
  enumOptions?: Array<enumOptions>;
  sortable?: boolean;
  searchable?: boolean; // Default searchable to true
  searchResult?: boolean;
  searchWeightage?: number; // Default search weightage to 1
  languageDependent?: boolean;
  labelTextId?: string;
  itemDataType?: string;
  keyType?: string;
  descriptionAttribute?: string;
  objectDefinition?: Array<elementFormat>;
  objectReference?: objectReference;
}

export interface entityFormat {
  name: string;
  label?: string;
  entityType: string;
  objectTypeCode?: string;
  root: boolean;
  attributes: Array<elementFormat>;
  creatable?: boolean;
  updatable?: boolean;
}

export enum TriggerType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface eventFormat {
  technicalName: string;
  label: string;
  entityReference: string;
  trigger: TriggerType;
}

export interface AdminData {
  name: string;
  dataType: string;
  creatable: boolean;
  updatable: boolean;
  nullable: boolean;
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  searchResult: boolean;
  languageDependent: boolean;
  objectDefinition: Array<elementFormat>;
  structReference: string;
  analyticsRelevant: boolean;
}

export interface enumOptions {
  code: string;
  description: string;
  labelTextId?: string;
  default: boolean;
}

export enum apiMethod {
  QUERY = 'QUERY',
  READ = 'READ',
  POST = 'POST',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface apiOperations {
  id: string;
  path: string;
  method: apiMethod;
  request: {
    pathVariables: [
      {
        name?: string;
        dataType?: string;
        dataFormat?: string;
      },
    ];
  };
  responses: [
    {
      description: string;
      responseCode: responseCodes;
    },
  ];
}

export enum responseCodes {
  OK = '200',
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  INTERNAL_SERVER_ERROR = '500',
}
export interface apiFormat {
  technicalName: string;
  title: string;
  description: string;
  apiPath: string;
  operations: Array<apiOperations>;
  entityReference: string;
}

export interface serviceFormat {
  technicalName: string;
  label: string;
  description: string;
  authorizationRelevant: boolean;
}

export interface convertedMetadata {
  service: serviceFormat;
  entities: Array<entityFormat>;
  events?: Array<eventFormat>;
  apis?: Array<apiFormat>;
}
