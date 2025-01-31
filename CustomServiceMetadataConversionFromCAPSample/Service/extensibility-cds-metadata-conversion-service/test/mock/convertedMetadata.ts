export const convertedMetadata = {
  "service": {
    "technicalName": "ProjectOrderService",
    "label": "Project Order Service",
    "description": "This service is for ProjectOrderService.",
    "authorizationRelevant": true
  },
  "entities": [
    {
      "name": "ProjectOrder",
      "label": "Project Order",
      "entityType": "BUSINESS",
      "root": true,
      "creatable": true,
      "updatable": true,
      "attributes": [
        {
          "name": "id",
          "label": "id",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "keyType": "PRIMARY",
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "displayid",
          "label": "display Id",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "customer",
          "label": "Customer",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "account",
          "label": "account",
          "dataType": "OBJECT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "id",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_account_id",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "ProjectOrder",
                "sourceAttribute": "customer",
                "targetEntity": "Accounts",
                "targetAttribute": "id",
                "keyGroup": "account",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "displayId",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_account_displayId",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "displayId",
                "keyGroup": "account"
              }
            },
            {
              "name": "formattedName",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_account_formattedName",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "formattedName",
                "keyGroup": "account"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "opportunityid",
          "label": "opportunity Id",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "status",
          "label": "status",
          "dataType": "STRING",
          "dataFormat": "CODE",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "enumOptions": [
            {
              "code": "ACTIVE",
              "description": "Active",
              "default": false
            },
            {
              "code": "INACTIVE",
              "description": "Inactive",
              "default": false
            }
          ],
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "products",
          "label": "products",
          "dataType": "ARRAY",
          "itemDataType": "OBJECT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "id",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_id",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "ProjectOrder",
                "sourceAttribute": "id",
                "targetEntity": "Products",
                "targetAttribute": "projectorder",
                "keyGroup": "products",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "productId",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_productId",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "productId",
                "keyGroup": "products"
              }
            },
            {
              "name": "customizationDetails",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_customizationDetails",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "customizationDetails",
                "keyGroup": "products"
              }
            },
            {
              "name": "quantity",
              "dataType": "OBJECT",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_quantity",
              "objectDefinition": [
                {
                  "name": "ID",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_quantity_ID",
                  "keyType": "FOREIGN",
                  "dataFormat": "UUID",
                  "objectReference": {
                    "associationType": "ASSOCIATION",
                    "sourceEntity": "ProjectOrder",
                    "sourceAttribute": "products.quantity.ID",
                    "targetEntity": "ProductQuantity",
                    "targetAttribute": "ID",
                    "keyGroup": "quantity",
                    "targetService": "ProjectOrderService"
                  }
                },
                {
                  "name": "content",
                  "dataType": "INTEGER",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_quantity_content",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "content",
                    "keyGroup": "quantity"
                  }
                },
                {
                  "name": "unitOfMeasure",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_quantity_unitOfMeasure",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "unitOfMeasure",
                    "keyGroup": "quantity"
                  }
                }
              ]
            },
            {
              "name": "estimatedRevenue",
              "dataType": "OBJECT",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_estimatedRevenue",
              "objectDefinition": [
                {
                  "name": "ID",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_ID",
                  "keyType": "FOREIGN",
                  "dataFormat": "UUID",
                  "objectReference": {
                    "associationType": "ASSOCIATION",
                    "sourceEntity": "ProjectOrder",
                    "sourceAttribute": "products.estimatedRevenue.ID",
                    "targetEntity": "EstimatedRevenue",
                    "targetAttribute": "ID",
                    "keyGroup": "estimatedRevenue",
                    "targetService": "ProjectOrderService"
                  }
                },
                {
                  "name": "currencyCode",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_currencyCode",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "currencyCode",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "content",
                  "dataType": "NUMBER",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_content",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "content",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "estimatedRevenueDesc",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_estimatedRevenueDesc",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "estimatedRevenueDesc",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "testDouble",
                  "dataType": "NUMBER",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_testDouble",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "ProjectOrder",
                    "targetAttribute": "testDouble",
                    "keyGroup": "estimatedRevenue"
                  }
                }
              ]
            },
            {
              "name": "status",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_status",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "status",
                "keyGroup": "products"
              }
            },
            {
              "name": "name",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_name",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "name",
                "keyGroup": "products"
              }
            },
            {
              "name": "displayId",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_products_displayId",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "displayId",
                "keyGroup": "products"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "startdate",
          "label": "start Date",
          "dataType": "STRING",
          "dataFormat": "DATE",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "enddate",
          "label": "end Date",
          "dataType": "STRING",
          "dataFormat": "DATE",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "estimatedrevenue",
          "label": "estimated Revenue",
          "dataType": "OBJECT",
          "dataFormat": "AMOUNT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "ID",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_ID",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "ProjectOrder",
                "sourceAttribute": "estimatedRevenue.ID",
                "targetEntity": "EstimatedRevenue",
                "targetAttribute": "ID",
                "keyGroup": "estimatedRevenue",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "currencyCode",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_currencyCode",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "currencyCode",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "content",
              "dataType": "NUMBER",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_content",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "content",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "estimatedRevenueDesc",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_estimatedRevenueDesc",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "estimatedRevenueDesc",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "testDouble",
              "dataType": "NUMBER",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_testDouble",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "ProjectOrder",
                "targetAttribute": "testDouble",
                "keyGroup": "estimatedRevenue"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "name",
          "label": "Name",
          "description": true,
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": false,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "reccurenceofsubscription",
          "label": "reccurenceof Subscription",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "isindividualcustomer",
          "label": "is Individual Customer",
          "dataType": "BOOLEAN",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "vendoremailaddress",
          "label": "vendor Email Address",
          "dataType": "STRING",
          "dataFormat": "EMAIL",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "orderlinkaddress",
          "label": "order Link Address",
          "dataType": "STRING",
          "dataFormat": "URI",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        }
      ]
    },
    {
      "name": "EstimatedRevenue",
      "label": "Estimated Revenue",
      "entityType": "BUSINESS",
      "root": false,
      "creatable": false,
      "updatable": false,
      "attributes": [
        {
          "name": "id",
          "label": "ID",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "keyType": "PRIMARY",
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "currencycode",
          "label": "currency Code",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "content",
          "label": "content",
          "dataType": "NUMBER",
          "dataFormat": "FLOAT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "estimatedrevenuedesc",
          "label": "estimated Revenue Desc",
          "description": true,
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "testdouble",
          "label": "test Double",
          "dataType": "NUMBER",
          "dataFormat": "DOUBLE",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        }
      ]
    },
    {
      "name": "Products",
      "label": "Products",
      "entityType": "BUSINESS",
      "root": false,
      "creatable": false,
      "updatable": false,
      "attributes": [
        {
          "name": "id",
          "label": "id",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "keyType": "PRIMARY",
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "productid",
          "label": "product Id",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "customizationdetails",
          "label": "customization Details",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "quantity",
          "label": "quantity",
          "dataType": "OBJECT",
          "dataFormat": "QUANTITY",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "ID",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_quantity_ID",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "Products",
                "sourceAttribute": "quantity.ID",
                "targetEntity": "ProductQuantity",
                "targetAttribute": "ID",
                "keyGroup": "quantity",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "content",
              "dataType": "INTEGER",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_quantity_content",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "content",
                "keyGroup": "quantity"
              }
            },
            {
              "name": "unitOfMeasure",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_quantity_unitOfMeasure",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "unitOfMeasure",
                "keyGroup": "quantity"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "estimatedrevenue",
          "label": "estimated Revenue",
          "dataType": "OBJECT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "ID",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_ID",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "Products",
                "sourceAttribute": "estimatedRevenue.ID",
                "targetEntity": "EstimatedRevenue",
                "targetAttribute": "ID",
                "keyGroup": "estimatedRevenue",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "currencyCode",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_currencyCode",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "currencyCode",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "content",
              "dataType": "NUMBER",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_content",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "content",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "estimatedRevenueDesc",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_estimatedRevenueDesc",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "estimatedRevenueDesc",
                "keyGroup": "estimatedRevenue"
              }
            },
            {
              "name": "testDouble",
              "dataType": "NUMBER",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_estimatedRevenue_testDouble",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "testDouble",
                "keyGroup": "estimatedRevenue"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "status",
          "label": "status",
          "dataType": "STRING",
          "dataFormat": "CODE",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "enumOptions": [
            {
              "code": "ACTIVE",
              "description": "Active",
              "default": false
            },
            {
              "code": "INACTIVE",
              "description": "Inactive",
              "default": false
            }
          ],
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "projectorder",
          "label": "project Order",
          "dataType": "OBJECT",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "objectDefinition": [
            {
              "name": "id",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_id",
              "keyType": "FOREIGN",
              "dataFormat": "UUID",
              "objectReference": {
                "associationType": "ASSOCIATION",
                "sourceEntity": "Products",
                "sourceAttribute": "projectOrder.id",
                "targetEntity": "ProjectOrder",
                "targetAttribute": "id",
                "keyGroup": "projectOrder",
                "targetService": "ProjectOrderService"
              }
            },
            {
              "name": "displayId",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_displayId",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "displayId",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "Customer",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_Customer",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "Customer",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "opportunityId",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_opportunityId",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "opportunityId",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "status",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_status",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "status",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "products",
              "dataType": "ARRAY",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_products",
              "objectDefinition": [
                {
                  "name": "id",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_id",
                  "keyType": "FOREIGN",
                  "dataFormat": "UUID",
                  "objectReference": {
                    "associationType": "ASSOCIATION",
                    "sourceEntity": "Products",
                    "sourceAttribute": "id",
                    "targetEntity": "Products",
                    "targetAttribute": "projectorder",
                    "keyGroup": "products",
                    "targetService": "ProjectOrderService"
                  }
                },
                {
                  "name": "productId",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_productId",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "productId",
                    "keyGroup": "products"
                  }
                },
                {
                  "name": "customizationDetails",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_customizationDetails",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "customizationDetails",
                    "keyGroup": "products"
                  }
                },
                {
                  "name": "quantity",
                  "dataType": "OBJECT",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_quantity",
                  "objectDefinition": [
                    {
                      "name": "ID",
                      "dataType": "STRING",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_quantity_ID",
                      "keyType": "FOREIGN",
                      "dataFormat": "UUID",
                      "objectReference": {
                        "associationType": "ASSOCIATION",
                        "sourceEntity": "Products",
                        "sourceAttribute": "products.quantity.ID",
                        "targetEntity": "ProductQuantity",
                        "targetAttribute": "ID",
                        "keyGroup": "quantity",
                        "targetService": "ProjectOrderService"
                      }
                    },
                    {
                      "name": "content",
                      "dataType": "INTEGER",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_quantity_content",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "content",
                        "keyGroup": "quantity"
                      }
                    },
                    {
                      "name": "unitOfMeasure",
                      "dataType": "STRING",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_quantity_unitOfMeasure",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "unitOfMeasure",
                        "keyGroup": "quantity"
                      }
                    }
                  ]
                },
                {
                  "name": "estimatedRevenue",
                  "dataType": "OBJECT",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_estimatedRevenue",
                  "objectDefinition": [
                    {
                      "name": "ID",
                      "dataType": "STRING",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_estimatedRevenue_ID",
                      "keyType": "FOREIGN",
                      "dataFormat": "UUID",
                      "objectReference": {
                        "associationType": "ASSOCIATION",
                        "sourceEntity": "Products",
                        "sourceAttribute": "products.estimatedRevenue.ID",
                        "targetEntity": "EstimatedRevenue",
                        "targetAttribute": "ID",
                        "keyGroup": "estimatedRevenue",
                        "targetService": "ProjectOrderService"
                      }
                    },
                    {
                      "name": "currencyCode",
                      "dataType": "STRING",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_estimatedRevenue_currencyCode",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "currencyCode",
                        "keyGroup": "estimatedRevenue"
                      }
                    },
                    {
                      "name": "content",
                      "dataType": "NUMBER",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_estimatedRevenue_content",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "content",
                        "keyGroup": "estimatedRevenue"
                      }
                    },
                    {
                      "name": "estimatedRevenueDesc",
                      "dataType": "STRING",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_estimatedRevenue_estimatedRevenueDesc",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "estimatedRevenueDesc",
                        "keyGroup": "estimatedRevenue"
                      }
                    },
                    {
                      "name": "testDouble",
                      "dataType": "NUMBER",
                      "creatable": false,
                      "updatable": false,
                      "nullable": true,
                      "sortable": false,
                      "filterable": false,
                      "searchable": false,
                      "searchResult": false,
                      "languageDependent": false,
                      "label": "lbl_estimatedRevenue_testDouble",
                      "objectReference": {
                        "associationType": "REFERENCE",
                        "sourceEntity": "Products",
                        "targetAttribute": "testDouble",
                        "keyGroup": "estimatedRevenue"
                      }
                    }
                  ]
                },
                {
                  "name": "status",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_status",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "status",
                    "keyGroup": "products"
                  }
                },
                {
                  "name": "name",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_name",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "name",
                    "keyGroup": "products"
                  }
                },
                {
                  "name": "displayId",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_products_displayId",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "displayId",
                    "keyGroup": "products"
                  }
                }
              ]
            },
            {
              "name": "startDate",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_startDate",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "startDate",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "endDate",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_endDate",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "endDate",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "estimatedRevenue",
              "dataType": "OBJECT",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_estimatedRevenue",
              "objectDefinition": [
                {
                  "name": "ID",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_ID",
                  "keyType": "FOREIGN",
                  "dataFormat": "UUID",
                  "objectReference": {
                    "associationType": "ASSOCIATION",
                    "sourceEntity": "Products",
                    "sourceAttribute": "projectOrder.estimatedRevenue.ID",
                    "targetEntity": "EstimatedRevenue",
                    "targetAttribute": "ID",
                    "keyGroup": "estimatedRevenue",
                    "targetService": "ProjectOrderService"
                  }
                },
                {
                  "name": "currencyCode",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_currencyCode",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "currencyCode",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "content",
                  "dataType": "NUMBER",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_content",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "content",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "estimatedRevenueDesc",
                  "dataType": "STRING",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_estimatedRevenueDesc",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "estimatedRevenueDesc",
                    "keyGroup": "estimatedRevenue"
                  }
                },
                {
                  "name": "testDouble",
                  "dataType": "NUMBER",
                  "creatable": false,
                  "updatable": false,
                  "nullable": true,
                  "sortable": false,
                  "filterable": false,
                  "searchable": false,
                  "searchResult": false,
                  "languageDependent": false,
                  "label": "lbl_estimatedRevenue_testDouble",
                  "objectReference": {
                    "associationType": "REFERENCE",
                    "sourceEntity": "Products",
                    "targetAttribute": "testDouble",
                    "keyGroup": "estimatedRevenue"
                  }
                }
              ]
            },
            {
              "name": "Name",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_Name",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "Name",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "reccurenceofSubscription",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_reccurenceofSubscription",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "reccurenceofSubscription",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "isIndividualCustomer",
              "dataType": "BOOLEAN",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_isIndividualCustomer",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "isIndividualCustomer",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "vendorEmailAddress",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_vendorEmailAddress",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "vendorEmailAddress",
                "keyGroup": "projectOrder"
              }
            },
            {
              "name": "orderLinkAddress",
              "dataType": "STRING",
              "creatable": false,
              "updatable": false,
              "nullable": true,
              "sortable": false,
              "filterable": false,
              "searchable": false,
              "searchResult": false,
              "languageDependent": false,
              "label": "lbl_projectOrder_orderLinkAddress",
              "objectReference": {
                "associationType": "REFERENCE",
                "sourceEntity": "Products",
                "targetAttribute": "orderLinkAddress",
                "keyGroup": "projectOrder"
              }
            }
          ],
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "name",
          "label": "name",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "displayid",
          "label": "display Id",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        }
      ]
    },
    {
      "name": "Accounts",
      "label": "Accounts",
      "entityType": "BUSINESS",
      "root": false,
      "creatable": false,
      "updatable": false,
      "attributes": [
        {
          "name": "id",
          "label": "id",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "keyType": "PRIMARY",
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "displayid",
          "label": "display Id",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "formattedname",
          "label": "formatted Name",
          "description": true,
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        }
      ]
    },
    {
      "name": "customer",
      "label": "customer",
      "entityType": "BUSINESS",
      "root": false,
      "creatable": false,
      "updatable": false,
      "attributes": []
    },
    {
      "name": "ProductQuantity",
      "label": "Product Quantity",
      "entityType": "BUSINESS",
      "root": false,
      "creatable": false,
      "updatable": false,
      "attributes": [
        {
          "name": "id",
          "label": "ID",
          "dataType": "STRING",
          "dataFormat": "UUID",
          "nullable": false,
          "creatable": true,
          "updatable": false,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "keyType": "PRIMARY",
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "content",
          "label": "content",
          "dataType": "INTEGER",
          "dataFormat": "INT32",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        },
        {
          "name": "unitofmeasure",
          "label": "unit Of Measure",
          "dataType": "STRING",
          "dataFormat": "STRING",
          "nullable": true,
          "creatable": true,
          "updatable": true,
          "filterable": true,
          "searchable": false,
          "sortable": false,
          "searchResult": false,
          "searchWeightage": 1,
          "languageDependent": false,
          "labelTextId": ""
        }
      ]
    }
  ],
  "events": [
    {
      "technicalName": "ProjectOrderCreate",
      "label": "Project Order",
      "entityReference": "ProjectOrder",
      "trigger": "CREATE"
    }
  ],
  "apis": [
    {
      "technicalName": "ProjectOrderApiCAP",
      "title": "BTP ProjectOrder API",
      "description": "API for interacting with BTP ProjectOrder service",
      "apiPath": "/project-order-service/ProjectOrder",
      "operations": [
        {
          "id": "readProjectOrder",
          "path": "/",
          "method": "READ",
          "request": {
            "pathVariables": []
          },
          "responses": [
            {
              "description": "200 OK",
              "responseCode": "200"
            },
            {
              "description": "400 BAD_REQUEST",
              "responseCode": "400"
            },
            {
              "description": "401 UNAUTHORIZED",
              "responseCode": "401"
            },
            {
              "description": "403 FORBIDDEN",
              "responseCode": "403"
            },
            {
              "description": "404 NOT_FOUND",
              "responseCode": "404"
            },
            {
              "description": "500 INTERNAL_SERVER_ERROR",
              "responseCode": "500"
            }
          ]
        },
        {
          "id": "readProjectOrder",
          "path": "/{id}",
          "method": "READ",
          "request": {
            "pathVariables": [
              {
                "name": "id",
                "dataType": "STRING",
                "dataFormat": "UUID"
              }
            ]
          },
          "responses": [
            {
              "description": "200 OK",
              "responseCode": "200"
            },
            {
              "description": "400 BAD_REQUEST",
              "responseCode": "400"
            },
            {
              "description": "401 UNAUTHORIZED",
              "responseCode": "401"
            },
            {
              "description": "403 FORBIDDEN",
              "responseCode": "403"
            },
            {
              "description": "404 NOT_FOUND",
              "responseCode": "404"
            },
            {
              "description": "500 INTERNAL_SERVER_ERROR",
              "responseCode": "500"
            }
          ]
        },
        {
          "id": "createProjectOrderService.ProjectOrder",
          "path": "/",
          "method": "POST",
          "request": {
            "pathVariables": []
          },
          "responses": [
            {
              "description": "201 Created",
              "responseCode": "201"
            },
            {
              "description": "400 BAD_REQUEST",
              "responseCode": "400"
            },
            {
              "description": "401 UNAUTHORIZED",
              "responseCode": "401"
            },
            {
              "description": "403 FORBIDDEN",
              "responseCode": "403"
            },
            {
              "description": "500 INTERNAL_SERVER_ERROR",
              "responseCode": "500"
            }
          ]
        },
        {
          "id": "updateProjectOrderService.ProjectOrder",
          "path": "/{id}",
          "method": "PATCH",
          "request": {
            "pathVariables": [
              {
                "name": "id",
                "dataType": "STRING",
                "dataFormat": "UUID"
              }
            ]
          },
          "responses": [
            {
              "description": "200 OK",
              "responseCode": "200"
            },
            {
              "description": "400 BAD_REQUEST",
              "responseCode": "400"
            },
            {
              "description": "401 UNAUTHORIZED",
              "responseCode": "401"
            },
            {
              "description": "403 FORBIDDEN",
              "responseCode": "403"
            },
            {
              "description": "404 NOT_FOUND",
              "responseCode": "404"
            },
            {
              "description": "500 INTERNAL_SERVER_ERROR",
              "responseCode": "500"
            }
          ]
        },
        {
          "id": "deleteProjectOrderService.ProjectOrder",
          "path": "/{id}",
          "method": "DELETE",
          "request": {
            "pathVariables": [
              {
                "name": "id",
                "dataType": "STRING",
                "dataFormat": "UUID"
              }
            ]
          },
          "responses": [
            {
              "description": "200 OK",
              "responseCode": "200"
            },
            {
              "description": "400 BAD_REQUEST",
              "responseCode": "400"
            },
            {
              "description": "401 UNAUTHORIZED",
              "responseCode": "401"
            },
            {
              "description": "403 FORBIDDEN",
              "responseCode": "403"
            },
            {
              "description": "404 NOT_FOUND",
              "responseCode": "404"
            },
            {
              "description": "500 INTERNAL_SERVER_ERROR",
              "responseCode": "500"
            }
          ]
        }
      ],
      "entityReference": "ProjectOrderService.ProjectOrder"
    }
  ]
}