# Work Order Service - API Reference

## Base URL
- **Development**: `http://localhost:8080`
- **Production**: `https://<your-approuter-name>.cfapps.<region>.hana.ondemand.com`

## Authentication

All endpoints require JWT Bearer token in production environments:
```
Authorization: Bearer <JWT_TOKEN>
```

**Production**: JWT token is required in the Authorization header. Requests without a valid token will receive a `401 Unauthorized` response.

**Development**: For local testing, the application can be configured to work without JWT tokens using mock sessions (see `env.example` for configuration).

---

## Endpoints

### Work Orders
- `POST /work-order-service/workOrders` - Create work order
- `GET /work-order-service/workOrders` - List work orders (supports $top, $skip, $count, $orderby, $filter, $search)
- `GET /work-order-service/workOrders/{id}` - Get work order by ID
- `PATCH /work-order-service/workOrders/{id}` - Update work order
- `DELETE /work-order-service/workOrders/{id}` - Delete work order

### Work Products (Nested)
- `POST /work-order-service/workOrders/{workOrderId}/workProducts` - Create work product
- `GET /work-order-service/workOrders/{workOrderId}/workProducts` - List work products
- `GET /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}` - Get work product by ID
- `PATCH /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}` - Update work product
- `DELETE /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}` - Delete work product

### Schedule Lines (Nested)
- `POST /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines` - Create schedule line
- `GET /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines` - List schedule lines (supports $orderby)
- `GET /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines/{scheduleLineId}` - Get schedule line by ID
- `PATCH /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines/{scheduleLineId}` - Update schedule line
- `DELETE /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines/{scheduleLineId}` - Delete schedule line

---

## Request/Response Examples

### Create Work Order
`POST /work-order-service/workOrders`

```json
{
  "orderName": "SAP Implementation",
  "status": "ACTIVE",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "currencyCode": "USD",
  "content": 250000,
  "Customer": "ACME Corp",
  "displayId": "WO-2024-001"
}
```

Response: `201 Created`
```json
{
  "value": [{
    "id": "e643a779-2ad2-4670-8720-1ff1a67fc77e",
    "orderName": "SAP Implementation",
    "status": "ACTIVE",
    "startDate": "2024-01-15",
    "endDate": "2024-12-31",
    "Customer": "ACME Corp",
    "displayId": "WO-2024-001",
    "projectLead": null,
    "estimatedRevenue": {
      "currencyCode": "USD",
      "content": 250000
    }
  }]
}
```

### Get Work Orders (with query params)
`GET /work-order-service/workOrders?$top=20&$count=true&$orderby=startDate desc`

Response: `200 OK`
```json
{
  "value": [{ ... }],
  "count": 1
}
```

### Create Work Product
`POST /work-order-service/workOrders/{workOrderId}/workProducts`

```json
{
  "workProductId": "SAP-INT-2024-001",
  "workProductName": "Business Process Design",
  "customizationDetails": "Analyze current processes and design future state",
  "quantity": 1,
  "productCategory": "CONSULTING",
  "completionPercentage": 100,
  "productTypeCode": "BP_DESIGN",
  "currencyCode": "USD",
  "content": 80000,
  "status": "COMPLETED"
}
```

Response: `201 Created`
```json
{
  "value": [{
    "id": "1d8387a3-d14a-4a27-a27d-fd4656b4a83b",
    "workProductId": "SAP-INT-2024-001",
    "workProductName": "Business Process Design",
    "customizationDetails": "Analyze current processes and design future state",
    "quantity": 1,
    "productCategory": "CONSULTING",
    "completionPercentage": 100,
    "productTypeCode": "BP_DESIGN",
    "status": "COMPLETED",
    "estimatedRevenue": {
      "currencyCode": "USD",
      "content": 80000
    },
    "workOrderId": "e643a779-2ad2-4670-8720-1ff1a67fc77e",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:45:00.000Z"
  }]
}
```

### Create Schedule Line
`POST /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines`

```json
{
  "displayId": "SL-001",
  "scheduleLineName": "Phase 1 - Initial Configuration",
  "date": "2024-02-15T00:00:00.000Z",
  "requestedQuantity": 10,
  "confirmedQuantity": 10,
  "requestedEndDate": "2024-03-15T00:00:00.000Z",
  "status": "CONFIRMED"
}
```

Response: `201 Created`
```json
{
  "value": [{
    "id": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
    "displayId": "SL-001",
    "scheduleLineName": "Phase 1 - Initial Configuration",
    "date": "2024-02-15T00:00:00.000Z",
    "requestedQuantity": 10,
    "confirmedQuantity": 10,
    "requestedEndDate": "2024-03-15T00:00:00.000Z",
    "status": "CONFIRMED",
    "workProductId": "1d8387a3-d14a-4a27-a27d-fd4656b4a83b",
    "createdAt": "2024-02-10T09:00:00.000Z",
    "updatedAt": "2024-02-10T09:00:00.000Z"
  }]
}
```

### Update Work Order
`PATCH /work-order-service/workOrders/{id}`

```json
{
  "status": "COMPLETED"
}
```

### Delete Work Order
`DELETE /work-order-service/workOrders/{id}`

Response: `200 OK`
```json
{
  "value": [{
    "id": "e643a779-2ad2-4670-8720-1ff1a67fc77e",
    "status": "deleted"
  }]
}
```

---

## Query Parameters (GET endpoints)

### Work Orders
- `$top` - Limit results (default: 50, max: 1000)
- `$skip` - Skip results for pagination
- `$count` - Include total count (true/false)
- `$orderby` - Sort (e.g., `orderName asc`, `startDate desc`)
- `$filter` - Filter (e.g., `status eq 'ACTIVE'`)
- `$search` - Full-text search

**Sortable fields**: `orderName`, `status`, `startDate`, `endDate`, `numberOfSubscriptions`, `estimatedRevenue`, `Customer`, `displayId`

**Filterable fields**: `status`, `startDate`, `endDate`, `orderName`, `estimatedRevenue/currencyCode`, `estimatedRevenue/content`, `numberOfSubscriptions`

**Example:**
```
GET /work-order-service/workOrders?$top=20&$skip=0&$count=true&$orderby=startDate desc&$filter=status eq 'ACTIVE'&$search=ACME
```

### Schedule Lines
- `$orderby` - Sort schedule lines

---

## Field Definitions

### Work Order
- `orderName` (required) - Order name
- `status` - ACTIVE | COMPLETED | CANCELLED
- `startDate` - ISO 8601 date
- `endDate` - ISO 8601 date
- `currencyCode` - Currency (e.g., USD)
- `content` - Amount
- `numberOfSubscriptions` - String
- `projectLeadId` - UUID of employee
- `Customer` - Customer name
- `displayId` - Display identifier

### Work Product
- `workProductId` - Product identifier
- `workProductName` - Display name for the work product
- `customizationDetails` - Detailed description
- `quantity` - Number of units (integer)
- `productCategory` - Category code (e.g., CONSULTING, IMPLEMENTATION, DATA_SERVICES)
- `completionPercentage` - Progress completion (0-100)
- `productTypeCode` - Type code identifier
- `currencyCode` - Currency code
- `content` - Amount/revenue
- `status` - Status string
- `workOrderId` - Parent work order UUID (auto-assigned in nested endpoint)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Schedule Line
- `displayId` - User-friendly identifier (e.g., SL-001)
- `scheduleLineName` - Descriptive name for the schedule line
- `date` (required) - ISO 8601 date
- `requestedQuantity` (required) - Requested quantity (decimal)
- `confirmedQuantity` - Confirmed quantity (decimal)
- `requestedEndDate` - ISO 8601 date
- `status` - Status string
- `workProductId` - Parent work product UUID (auto-assigned in nested endpoint)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

---

## Response Format

All responses follow this structure:
```json
{
  "value": [ ... ],
  "count": 123 
}
```

## Error Responses

Standard HTTP status codes:
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Missing/invalid JWT
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
