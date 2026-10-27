export const XSAPCRMTOKEN = 'x-sap-crm-token';
export const SESSION = 'session';
export const HttpHeader = {
  JsonWebTokenHeader: XSAPCRMTOKEN,
  contentType: 'Content-Type',
  contentTypePng: 'application/json',
};
export const sessionImp = {
  languageCode: '',
};
export const accessRestricted = 'User Access Forbidden';
export const MESSAGES = {
  HTTP_PRECONDITION_REQUIRED:
    'The precondition If-Match is missing in the header',
  HTTP_PRECONDITION_FAILED:
    'The precondition If-Match has failed. Resource is not the latest, please update the resource',
  RESOURCE_NOT_FOUND: 'Resource with the provided id not found',
};
export const logLevels = {
  1: 'ERROR',
  2: 'WARN',
  3: 'INFO',
  4: 'DEBUG',
};
export const missingParam = 'Missing parameter';
export const DEFAULT_RESPONSE_SIZE = 50;
export const DEFAULT_MAX_RESPONSE_SIZE = 999;
export const DEVELOPMENT = 'Development';
export const SYSTEM_TENANT = '000000000000000000000000';
export const SYSTEM_USER = '00000000-0000-0000-0000-000000000000';
export const DUMMY_USER = '11ec6d88-68e8-fa3e-afdb-23454c534123';
export const MONGO_CLUSTER_SECRET_KEY = 'mongodb-atlas';
export const HEALTH_CHECK_URI = 'health';
export const HTTP_PRECONDITION_REQUIRED = 428;
export const HTTP_PRECONDITION_FAILED = 412;
export const K8SSAT_LOCAL = 'dummy k8ssat';
export const dummySAToken = 'dummy sat iam';
export const DEFAULT_LANGUAGE = 'en';
export const FALLBACK_LANGUAGE = 'en';
export const LOCALE_HEADERKEY = 'x-custom-lang';
export const LOCATION = 'location';
export const ETAG = 'ETag';
export const HTTP_POST = 'POST';
export const ETAG_HTTP_METHODS = ['GET', 'PATCH', 'PUT', 'POST', 'DELETE']; // order should not be changed
export const API_OK_RESPONSE_MESSAGE = 'Success: found';
export const PATCH_API_OK_RESPONSE_MESSAGE = 'Update Successful';
export const AUTHORIZATION_DENIED = 'AUTHORIZATION_DENIED';
export const AUTHORIZATION_GRANTED = 'AUTHORIZATION_GRANTED';
export enum HeaderKey {
  jwt = 'x-sap-crm-token',
  jwtCookie = '__Host-x-sap-crm-cookie',
  odata = 'x-sap-crm-odata-token',
  timeZone = 'x-sap-crm-iana-timezone',
  locale = 'x-sap-crm-locale',
  authorization = 'Authorization',
}
export const dataTypeMapping = {
  'cds.UUID': 'STRING',
  'cds.String': 'STRING',
  'cds.Boolean': 'BOOLEAN',
  'cds.Integer': 'INTEGER',
  'cds.Decimal': 'NUMBER',
  'cds.Double': 'NUMBER',
  'cds.DateTime': 'DATETIME',
  'cds.Timestamp': 'DATETIME',
  'cds.Date': 'DATETIME',
  'cds.Time': 'DATETIME',
  'cds.Composition': 'COMPOSITION', // Special case for compositions
  'cds.Association': 'ASSOCIATION', // Special case for associations
  User: 'STRING', // Custom user type, treated as STRING
};

export const dataTypeDFMapping = {
  'cds.UUID': 'UUID',
  'cds.String': 'STRING',
  'cds.Boolean': null,
  'cds.Integer': 'INT32',
  'cds.Int32': 'INT32',
  'cds.Int64': 'INT64',
  'cds.Decimal': 'FLOAT',
  'cds.Double': 'DOUBLE',
  'cds.DateTime': 'DATETIME',
  'cds.Timestamp': 'DATETIME',
  'cds.Date': 'DATE',
  'cds.Time': 'TIME',
  'cds.Composition': null,
  'cds.Association': null,
};

// export const dataFormatMapping = {
//   "cds.UUID"    : "UUID",
//   "cds.DateTime": "DATETIME",
//   "cds.Date"    : "DATE",

export const cdsSchema = {
  definitions: {
    ProjectOrderService: {
      '@source': 'srv/projectorder-service.cds',
      kind: 'service',
      '@path': '/project-order-service',
    },
    'ProjectOrderService.ProjectOrder': {
      kind: 'entity',
      '@odata.draft.bypass': true,
      '@type': {
        '=': 'Etype.BUSINESS',
      },
      '@odata.containment': false,
      projection: {
        from: {
          ref: ['sap.capire.customservice.ProjectOrder'],
        },
        excluding: ['poSequence'],
      },
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        displayId: {
          type: 'cds.String',
        },
        Customer: {
          type: 'cds.UUID',
        },
        account: {
          type: 'cds.Association',
          target: 'ProjectOrderService.Accounts',
          on: [
            {
              ref: ['account', 'id'],
            },
            '=',
            {
              ref: ['Customer'],
            },
          ],
        },
        opportunityId: {
          type: 'cds.UUID',
        },
        status: {
          '@assert.range': true,
          type: 'sap.capire.customservice.StatusCodeType',
          default: {
            val: 'ACTIVE',
          },
        },
        products: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'ProjectOrderService.Products',
          on: [
            {
              ref: ['products', 'projectOrder'],
            },
            '=',
            {
              ref: ['$self'],
            },
          ],
        },
        startDate: {
          '@dataFormat': 'DATE',
          type: 'cds.String',
        },
        endDate: {
          '@dataFormat': 'DATE',
          type: 'cds.String',
        },
        estimatedRevenue: {
          '@dataFormat': 'AMOUNT',
          type: 'cds.Composition',
          target: 'ProjectOrderService.EstimatedRevenue',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        Name: {
          '@description': true,
          type: 'cds.String',
          notNull: true,
        },
        reccurenceofSubscription: {
          type: 'cds.String',
        },
        isIndividualCustomer: {
          type: 'cds.Boolean',
        },
        vendorEmailAddress: {
          '@dataFormat': 'EMAIL',
          type: 'cds.String',
        },
        orderLinkAddress: {
          '@dataFormat': 'URI',
          type: 'cds.String',
        },
      },
    },
    'ProjectOrderService.EstimatedRevenue': {
      kind: 'entity',
      projection: {
        from: {
          ref: ['sap.capire.customservice.EstimatedRevenue'],
        },
      },
      elements: {
        ID: {
          key: true,
          type: 'cds.UUID',
        },
        currencyCode: {
          type: 'cds.String',
        },
        content: {
          type: 'cds.Decimal',
          precision: 10,
          scale: 3,
        },
        estimatedRevenueDesc: {
          '@description': true,
          type: 'cds.String',
        },
        testDouble: {
          type: 'cds.Double',
        },
      },
    },
    'ProjectOrderService.Products': {
      kind: 'entity',
      projection: {
        from: {
          ref: ['sap.capire.customservice.Products'],
        },
      },
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        productId: {
          type: 'cds.UUID',
        },
        customizationDetails: {
          type: 'cds.String',
        },
        quantity: {
          type: 'cds.Composition',
          '@dataFormat': 'QUANTITY',
          target: 'ProjectOrderService.ProductQuantity',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        estimatedRevenue: {
          type: 'cds.Composition',
          target: 'ProjectOrderService.EstimatedRevenue',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        status: {
          '@assert.range': true,
          type: 'sap.capire.customservice.StatusCodeType',
          default: {
            val: 'ACTIVE',
          },
        },
        projectOrder: {
          type: 'cds.Association',
          target: 'ProjectOrderService.ProjectOrder',
          keys: [
            {
              ref: ['id'],
            },
          ],
        },
        name: {
          type: 'cds.String',
        },
        displayId: {
          type: 'cds.String',
        },
      },
    },
    'ProjectOrderService.Accounts': {
      kind: 'entity',
      '@isCnsEntity': true,
      projection: {
        from: {
          ref: ['sap.capire.customservice.Accounts'],
        },
      },
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        displayId: {
          type: 'cds.String',
        },
        formattedName: {
          '@description': true,
          type: 'cds.String',
        },
      },
    },
    'ProjectOrderService.customer.ssc.projectorderservice.event.projectOrderCreate':
      {
        kind: 'event',
        elements: {},
      },
    'sap.capire.customservice.Etype': {
      kind: 'type',
      '@assert.range': true,
      type: 'cds.String',
      enum: {
        BUSINESS: {
          val: 'Business',
        },
        CODEVALUE: {
          val: 'Code Value',
        },
      },
    },
    'sap.capire.customservice.StatusCodeType': {
      kind: 'type',
      '@assert.range': true,
      type: 'cds.String',
      enum: {
        ACTIVE: {
          val: 'ACTIVE',
        },
        INACTIVE: {
          val: 'INACTIVE',
        },
      },
    },
    'sap.capire.customservice.ProjectOrder': {
      kind: 'entity',
      '@type': {
        '=': 'Etype.BUSINESS',
      },
      '@odata.containment': false,
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        poSequence: {
          type: 'cds.Int64',
        },
        displayId: {
          type: 'cds.String',
        },
        Customer: {
          type: 'cds.UUID',
        },
        account: {
          type: 'cds.Association',
          target: 'sap.capire.customservice.Accounts',
          on: [
            {
              ref: ['account', 'id'],
            },
            '=',
            {
              ref: ['Customer'],
            },
          ],
        },
        opportunityId: {
          type: 'cds.UUID',
        },
        status: {
          '@assert.range': true,
          type: 'sap.capire.customservice.StatusCodeType',
          default: {
            val: 'ACTIVE',
          },
        },
        products: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'sap.capire.customservice.Products',
          on: [
            {
              ref: ['products', 'projectOrder'],
            },
            '=',
            {
              ref: ['$self'],
            },
          ],
        },
        startDate: {
          '@dataFormat': 'DATE',
          type: 'cds.String',
        },
        endDate: {
          '@dataFormat': 'DATE',
          type: 'cds.String',
        },
        estimatedRevenue: {
          '@dataFormat': 'AMOUNT',
          type: 'cds.Composition',
          target: 'sap.capire.customservice.EstimatedRevenue',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        Name: {
          '@description': true,
          type: 'cds.String',
          notNull: true,
        },
        reccurenceofSubscription: {
          type: 'cds.String',
        },
        isIndividualCustomer: {
          type: 'cds.Boolean',
        },
        vendorEmailAddress: {
          '@dataFormat': 'EMAIL',
          type: 'cds.String',
        },
        orderLinkAddress: {
          '@dataFormat': 'URI',
          type: 'cds.String',
        },
      },
    },
    'sap.capire.customservice.EstimatedRevenue': {
      kind: 'entity',
      elements: {
        ID: {
          key: true,
          type: 'cds.UUID',
        },
        currencyCode: {
          type: 'cds.String',
        },
        content: {
          type: 'cds.Decimal',
          precision: 10,
          scale: 3,
        },
        estimatedRevenueDesc: {
          '@description': true,
          type: 'cds.String',
        },
        testDouble: {
          type: 'cds.Double',
        },
      },
    },
    'sap.capire.customservice.Accounts': {
      kind: 'entity',
      '@isCnsEntity': true,
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        displayId: {
          type: 'cds.String',
        },
        formattedName: {
          '@description': true,
          type: 'cds.String',
        },
      },
    },
    'sap.capire.customservice.Products': {
      kind: 'entity',
      elements: {
        id: {
          key: true,
          type: 'cds.UUID',
        },
        productId: {
          type: 'cds.UUID',
        },
        customizationDetails: {
          type: 'cds.String',
        },
        quantity: {
          type: 'cds.Composition',
          target: 'sap.capire.customservice.ProductQuantity',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        estimatedRevenue: {
          type: 'cds.Composition',
          target: 'sap.capire.customservice.EstimatedRevenue',
          keys: [
            {
              ref: ['ID'],
            },
          ],
        },
        status: {
          '@assert.range': true,
          type: 'sap.capire.customservice.StatusCodeType',
          default: {
            val: 'ACTIVE',
          },
        },
        projectOrder: {
          type: 'cds.Association',
          target: 'sap.capire.customservice.ProjectOrder',
          keys: [
            {
              ref: ['id'],
            },
          ],
        },
        name: {
          type: 'cds.String',
        },
        displayId: {
          type: 'cds.String',
        },
      },
    },
    'sap.capire.customservice.ProductQuantity': {
      kind: 'entity',
      elements: {
        ID: {
          key: true,
          type: 'cds.UUID',
        },
        content: {
          type: 'cds.Integer',
        },
        unitOfMeasure: {
          type: 'cds.String',
        },
      },
    },
    Language: {
      kind: 'type',
      '@title': '{i18n>Language}',
      '@description': '{i18n>LanguageCode.Description}',
      type: 'cds.Association',
      target: 'sap.common.Languages',
      keys: [
        {
          ref: ['code'],
        },
      ],
    },
    Currency: {
      kind: 'type',
      '@title': '{i18n>Currency}',
      '@description': '{i18n>CurrencyCode.Description}',
      type: 'cds.Association',
      target: 'sap.common.Currencies',
      keys: [
        {
          ref: ['code'],
        },
      ],
    },
    Country: {
      kind: 'type',
      '@title': '{i18n>Country}',
      '@description': '{i18n>CountryCode.Description}',
      type: 'cds.Association',
      target: 'sap.common.Countries',
      keys: [
        {
          ref: ['code'],
        },
      ],
    },
    Timezone: {
      kind: 'type',
      type: 'cds.Association',
      target: 'sap.common.Timezones',
      keys: [
        {
          ref: ['code'],
        },
      ],
    },
    'sap.common': {
      kind: 'context',
    },
    'sap.common.Locale': {
      kind: 'type',
      '@title': '{i18n>LanguageCode}',
      type: 'cds.String',
      length: 14,
    },
    'sap.common.Languages': {
      kind: 'entity',
      '@cds.autoexpose': true,
      '@cds.persistence.skip': 'if-unused',
      '@UI.Identification': [
        {
          Value: {
            '=': 'name',
          },
        },
      ],
      '@cds.odata.valuelist': true,
      includes: ['sap.common.CodeList'],
      elements: {
        name: {
          '@title': '{i18n>Name}',
          localized: true,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: true,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@Common.Text': {
            '=': 'name',
          },
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
        texts: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'sap.common.Languages.texts',
          on: [
            {
              ref: ['texts', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
          ],
        },
        localized: {
          type: 'cds.Association',
          target: 'sap.common.Languages.texts',
          on: [
            {
              ref: ['localized', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
            'and',
            {
              ref: ['localized', 'locale'],
            },
            '=',
            {
              ref: ['$user', 'locale'],
            },
          ],
        },
      },
    },
    'sap.common.Countries': {
      kind: 'entity',
      '@cds.autoexpose': true,
      '@cds.persistence.skip': 'if-unused',
      '@UI.Identification': [
        {
          Value: {
            '=': 'name',
          },
        },
      ],
      '@cds.odata.valuelist': true,
      includes: ['sap.common.CodeList'],
      elements: {
        name: {
          '@title': '{i18n>Name}',
          localized: true,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: true,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@title': '{i18n>CountryCode}',
          '@Common.Text': {
            '=': 'name',
          },
          key: true,
          type: 'cds.String',
          length: 3,
        },
        texts: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'sap.common.Countries.texts',
          on: [
            {
              ref: ['texts', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
          ],
        },
        localized: {
          type: 'cds.Association',
          target: 'sap.common.Countries.texts',
          on: [
            {
              ref: ['localized', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
            'and',
            {
              ref: ['localized', 'locale'],
            },
            '=',
            {
              ref: ['$user', 'locale'],
            },
          ],
        },
      },
    },
    'sap.common.Currencies': {
      kind: 'entity',
      '@cds.autoexpose': true,
      '@cds.persistence.skip': 'if-unused',
      '@UI.Identification': [
        {
          Value: {
            '=': 'name',
          },
        },
      ],
      '@cds.odata.valuelist': true,
      includes: ['sap.common.CodeList'],
      elements: {
        name: {
          '@title': '{i18n>Name}',
          localized: true,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: true,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@title': '{i18n>CurrencyCode}',
          '@Common.Text': {
            '=': 'name',
          },
          key: true,
          type: 'cds.String',
          length: 3,
        },
        symbol: {
          '@title': '{i18n>CurrencySymbol}',
          type: 'cds.String',
          length: 5,
        },
        minorUnit: {
          '@title': '{i18n>CurrencyMinorUnit}',
          type: 'cds.Int16',
        },
        texts: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'sap.common.Currencies.texts',
          on: [
            {
              ref: ['texts', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
          ],
        },
        localized: {
          type: 'cds.Association',
          target: 'sap.common.Currencies.texts',
          on: [
            {
              ref: ['localized', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
            'and',
            {
              ref: ['localized', 'locale'],
            },
            '=',
            {
              ref: ['$user', 'locale'],
            },
          ],
        },
      },
    },
    'sap.common.Timezones': {
      kind: 'entity',
      '@cds.autoexpose': true,
      '@cds.persistence.skip': 'if-unused',
      '@UI.Identification': [
        {
          Value: {
            '=': 'name',
          },
        },
      ],
      '@cds.odata.valuelist': true,
      includes: ['sap.common.CodeList'],
      elements: {
        name: {
          '@title': '{i18n>Name}',
          localized: true,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: true,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@title': '{i18n>TimeZoneCode}',
          key: true,
          type: 'cds.String',
          length: 100,
        },
        texts: {
          type: 'cds.Composition',
          cardinality: {
            max: '*',
          },
          target: 'sap.common.Timezones.texts',
          on: [
            {
              ref: ['texts', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
          ],
        },
        localized: {
          type: 'cds.Association',
          target: 'sap.common.Timezones.texts',
          on: [
            {
              ref: ['localized', 'code'],
            },
            '=',
            {
              ref: ['code'],
            },
            'and',
            {
              ref: ['localized', 'locale'],
            },
            '=',
            {
              ref: ['$user', 'locale'],
            },
          ],
        },
      },
    },
    'sap.common.CodeList': {
      kind: 'aspect',
      '@cds.autoexpose': true,
      '@cds.persistence.skip': 'if-unused',
      '@UI.Identification': [
        {
          Value: {
            '=': 'name',
          },
        },
      ],
      '@cds.odata.valuelist': true,
      elements: {
        name: {
          '@title': '{i18n>Name}',
          localized: true,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: true,
          type: 'cds.String',
          length: 1000,
        },
      },
    },
    'sap.common.TextsAspect': {
      kind: 'aspect',
      elements: {
        locale: {
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
      },
    },
    cuid: {
      kind: 'aspect',
      elements: {
        ID: {
          key: true,
          type: 'cds.UUID',
        },
      },
    },
    managed: {
      kind: 'aspect',
      elements: {
        createdAt: {
          '@cds.on.insert': {
            '=': '$now',
          },
          '@UI.HiddenFilter': true,
          '@Core.Immutable': true,
          '@title': '{i18n>CreatedAt}',
          '@readonly': true,
          type: 'cds.Timestamp',
        },
        createdBy: {
          '@cds.on.insert': {
            '=': '$user',
          },
          '@UI.HiddenFilter': true,
          '@Core.Immutable': true,
          '@title': '{i18n>CreatedBy}',
          '@readonly': true,
          '@description': '{i18n>UserID.Description}',
          type: 'User',
          length: 255,
        },
        modifiedAt: {
          '@cds.on.insert': {
            '=': '$now',
          },
          '@cds.on.update': {
            '=': '$now',
          },
          '@UI.HiddenFilter': true,
          '@title': '{i18n>ChangedAt}',
          '@readonly': true,
          type: 'cds.Timestamp',
        },
        modifiedBy: {
          '@cds.on.insert': {
            '=': '$user',
          },
          '@cds.on.update': {
            '=': '$user',
          },
          '@UI.HiddenFilter': true,
          '@title': '{i18n>ChangedBy}',
          '@readonly': true,
          '@description': '{i18n>UserID.Description}',
          type: 'User',
          length: 255,
        },
      },
    },
    temporal: {
      kind: 'aspect',
      elements: {
        validFrom: {
          '@cds.valid.from': true,
          type: 'cds.Timestamp',
        },
        validTo: {
          '@cds.valid.to': true,
          type: 'cds.Timestamp',
        },
      },
    },
    User: {
      kind: 'type',
      '@title': '{i18n>UserID}',
      '@description': '{i18n>UserID.Description}',
      type: 'cds.String',
      length: 255,
    },
    extensible: {
      kind: 'aspect',
      elements: {
        extensions__: {
          '@cds.api.ignore': true,
          type: 'cds.String',
        },
      },
    },
    'sap.common.Languages.texts': {
      kind: 'entity',
      '@odata.draft.enabled': false,
      includes: ['sap.common.TextsAspect'],
      elements: {
        locale: {
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
        name: {
          '@title': '{i18n>Name}',
          localized: null,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: null,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@odata.containment.ignore': true,
          '@Common.Text': {
            '=': 'name',
          },
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
      },
    },
    'sap.common.Countries.texts': {
      kind: 'entity',
      '@odata.draft.enabled': false,
      includes: ['sap.common.TextsAspect'],
      elements: {
        locale: {
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
        name: {
          '@title': '{i18n>Name}',
          localized: null,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: null,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@odata.containment.ignore': true,
          '@title': '{i18n>CountryCode}',
          '@Common.Text': {
            '=': 'name',
          },
          key: true,
          type: 'cds.String',
          length: 3,
        },
      },
    },
    'sap.common.Currencies.texts': {
      kind: 'entity',
      '@odata.draft.enabled': false,
      includes: ['sap.common.TextsAspect'],
      elements: {
        locale: {
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
        name: {
          '@title': '{i18n>Name}',
          localized: null,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: null,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@odata.containment.ignore': true,
          '@title': '{i18n>CurrencyCode}',
          '@Common.Text': {
            '=': 'name',
          },
          key: true,
          type: 'cds.String',
          length: 3,
        },
      },
    },
    'sap.common.Timezones.texts': {
      kind: 'entity',
      '@odata.draft.enabled': false,
      includes: ['sap.common.TextsAspect'],
      elements: {
        locale: {
          '@title': '{i18n>LanguageCode}',
          key: true,
          type: 'sap.common.Locale',
          length: 14,
        },
        name: {
          '@title': '{i18n>Name}',
          localized: null,
          type: 'cds.String',
          length: 255,
        },
        descr: {
          '@title': '{i18n>Description}',
          localized: null,
          type: 'cds.String',
          length: 1000,
        },
        code: {
          '@odata.containment.ignore': true,
          '@title': '{i18n>TimeZoneCode}',
          key: true,
          type: 'cds.String',
          length: 100,
        },
      },
    },
    'ProjectOrderService.ProductQuantity': {
      kind: 'entity',
      '@cds.autoexposed': true,
      projection: {
        from: {
          ref: ['sap.capire.customservice.ProductQuantity'],
        },
      },
      elements: {
        ID: {
          key: true,
          type: 'cds.UUID',
        },
        content: {
          type: 'cds.Integer',
        },
        unitOfMeasure: {
          type: 'cds.String',
        },
      },
    },
  },
  meta: {
    creator: 'CDS Compiler v4.9.8',
    flavor: 'inferred',
  },
  $version: '2.0',
};

export enum entityTypeEnum {
  BUSINESS = 'BUSINESS',
  CODEVALUE = 'CODEVALUE',
}

export const i18nEntities = [
  'sap.crm.i18nservice.entity.country',
  'sap.crm.i18nservice.entity.currency',
  'sap.crm.i18nservice.entity.exchangeRate',
  'sap.crm.i18nservice.entity.fiscalPeriod',
  'sap.crm.i18nservice.entity.gender',
  'sap.crm.i18nservice.entity.language',
  'sap.crm.i18nservice.entity.countryRegion',
  'sap.crm.i18nservice.entity.region',
  'sap.crm.i18nservice.entity.conversionFactor',
  'sap.crm.i18nservice.entity.currencyQuotation',
  'sap.crm.i18nservice.entity.currencyQuotationPrefix',
  'sap.crm.i18nservice.entity.ewuKey',
  'sap.crm.i18nservice.entity.exchangeRateType',
  'sap.crm.i18nservice.entity.regionCodeS4ReplicationMessageIn',
  'sap.crm.i18nservice.entity.regionCodeS4ReplicationRequestIn',
  'sap.crm.i18nservice.entity.exchangeRateS4ReplicationMessageIn',
  'sap.crm.i18nservice.entity.timezone',
];
