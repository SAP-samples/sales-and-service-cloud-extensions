# CUD Events Reference - WorkOrder Service

## Overview

CUD (Create / Update / Delete) events are fired after every mutation on a WorkOrder — including changes made through child entities (WorkProduct or ScheduleLine). They represent the full WorkOrder state at the time of each change and can be consumed by any downstream system subscribed via the SSC inbound connector.

Events are published as **CloudEvents v0.2** over HTTP to the SSC tenant's inbound event connector.

---

## Trigger Points

| Trigger | CUD Operation | What fires |
|---------|--------------|-----------|
| WorkOrder created | `workOrderCreate` | `currentImage` only (full snapshot) |
| WorkOrder updated | `workOrderUpdate` | `beforeImage` + `currentImage` |
| WorkOrder deleted | `workOrderDelete` | `beforeImage` only |
| WorkProduct created / updated / deleted | `workOrderUpdate` | Before/after snapshot of **parent WorkOrder** |
| ScheduleLine created / updated / deleted | `workOrderUpdate` | Before/after snapshot of **parent WorkOrder** |

The `beforeImage` is always captured **before** the mutation so it reflects the exact state prior to the change.

---

## CloudEvent Envelope

```json
{
  "id": "<UUID>",
  "subject": "<workOrder UUID>",
  "type": "<event type string>",
  "specversion": "0.2",
  "source": "<SSC_TENANT_SOURCE_ID>",
  "time": "<ISO datetime>",
  "datacontenttype": "application/json",
  "data": {
    "dataRequestId": "<UUID>",
    "entityFullName": "customer.ssc.workorderservice.entity.workOrder",
    "serviceFullName": "customer.ssc.service.workOrderService",
    "type": "DATA",
    "currentImage": { ... },
    "beforeImage": { ... }
  }
}
```

| Field | Description |
|-------|-------------|
| `id` | Random UUID generated per event |
| `subject` | The WorkOrder UUID the event belongs to |
| `type` | One of the event type strings below |
| `source` | Value of `SSC_TENANT_SOURCE_ID` environment variable |
| `data.type` | Always `"DATA"` for CUD events |
| `data.currentImage` | Present for Create and Update; absent for Delete |
| `data.beforeImage` | Present for Update and Delete; absent for Create |

---

## Event Type Strings

**To find the correct value:** In the SSC tenant, go to **System Settings → Extensibility → Custom Services → Edit Service → Events**. Select the event and copy its **Full Name** shown in the details panel.

![SSC Event Full Name](./images/ssc-event-fullname.png)

| Operation | CloudEvent `type` |
|-----------|-------------------|
| Create | `customer.ssc.workorderservice.event.workOrderCreate` |
| Update | `customer.ssc.workorderservice.event.workOrderUpdate` |
| Delete | `customer.ssc.workorderservice.event.workOrderDelete` |

---

## Payload Rules

| Operation | `beforeImage` | `currentImage` |
|-----------|---------------|----------------|
| **Create** | absent | Full WorkOrder snapshot |
| **Update** | Full WorkOrder snapshot BEFORE change | Full WorkOrder snapshot AFTER change |
| **Delete** | Full WorkOrder snapshot BEFORE deletion | absent |

### Transformation Applied to Snapshots

- `projectLeadId` is expanded to `projectLead { id, formattedName, displayId }` (omitted if null)
- `currencyCode` + `content` are composed into `estimatedRevenue { currencyCode, content }` (omitted if null)
- `Date` fields are converted to ISO 8601 strings
- `null` / `undefined` fields are stripped recursively (`stripNulls`)
- Internal foreign key fields (`workOrderId`, `workProductId`) are stripped from child entities

---

## Sample Payloads

### CREATE Event

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "subject": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "type": "customer.ssc.workorderservice.event.workOrderCreate",
  "specversion": "0.2",
  "source": "<your-ssc-tenant-source-id>",
  "time": "2026-03-26T10:15:30.000Z",
  "datacontenttype": "application/json",
  "data": {
    "dataRequestId": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
    "entityFullName": "customer.ssc.workorderservice.entity.workOrder",
    "serviceFullName": "customer.ssc.service.workOrderService",
    "type": "DATA",
    "currentImage": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "status": "ACTIVE",
      "startDate": "2026-04-01T00:00:00.000Z",
      "endDate": "2026-12-31T00:00:00.000Z",
      "orderName": "Cloud Migration Project",
      "displayId": "WO-001",
      "Customer": "Acme Corporation",
      "estimatedRevenue": {
        "currencyCode": "USD",
        "content": 150000
      },
      "projectLead": {
        "id": "e12a34b5-6789-0abc-def1-234567890abc",
        "formattedName": "John Smith",
        "displayId": "EMP-1001"
      },
      "workProducts": [
        {
          "id": "c23d45e6-7890-1bcd-ef23-456789012bcd",
          "workProductId": "WP-101",
          "workProductName": "Data Migration Service",
          "status": "In Progress",
          "estimatedRevenue": {
            "currencyCode": "USD",
            "content": 75000
          },
          "scheduleLines": [
            {
              "id": "d34e56f7-8901-2cde-f345-678901234cde",
              "displayId": "SL-001",
              "date": "2026-06-01T00:00:00.000Z",
              "requestedQuantity": 1,
              "confirmedQuantity": 1,
              "requestedEndDate": "2026-06-30T00:00:00.000Z",
              "status": "Open"
            }
          ]
        }
      ]
    }
  }
}
```

---

### UPDATE Event

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
  "subject": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "type": "customer.ssc.workorderservice.event.workOrderUpdate",
  "specversion": "0.2",
  "source": "<your-ssc-tenant-source-id>",
  "time": "2026-03-26T14:30:00.000Z",
  "datacontenttype": "application/json",
  "data": {
    "dataRequestId": "af1e2d3c-4b5a-6789-0fed-cba987654321",
    "entityFullName": "customer.ssc.workorderservice.entity.workOrder",
    "serviceFullName": "customer.ssc.service.workOrderService",
    "type": "DATA",
    "beforeImage": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "status": "ACTIVE",
      "orderName": "Cloud Migration Project",
      "estimatedRevenue": { "currencyCode": "USD", "content": 150000 }
    },
    "currentImage": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "status": "INACTIVE",
      "orderName": "Cloud Migration Project - Extended",
      "estimatedRevenue": { "currencyCode": "USD", "content": 250000 }
    }
  }
}
```

---

### DELETE Event

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
  "subject": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "type": "customer.ssc.workorderservice.event.workOrderDelete",
  "specversion": "0.2",
  "source": "<your-ssc-tenant-source-id>",
  "time": "2026-03-27T09:00:00.000Z",
  "datacontenttype": "application/json",
  "data": {
    "dataRequestId": "bf2e3d4c-5a6b-7890-1edc-ba0987654321",
    "entityFullName": "customer.ssc.workorderservice.entity.workOrder",
    "serviceFullName": "customer.ssc.service.workOrderService",
    "type": "DATA",
    "beforeImage": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "status": "INACTIVE",
      "orderName": "Cloud Migration Project - Extended",
      "estimatedRevenue": { "currencyCode": "USD", "content": 250000 }
    }
  }
}
```

---

## Configuration

CUD events require the following environment variables to be set. If either is missing, the service silently skips event publishing without affecting normal operation.

| Variable | Description |
|----------|-------------|
| `SSC_TENANT_SOURCE_ID` | Source ID of your SSC tenant registered in the analytics system |
| `SSC_BTP_DESTINATION` | Name of the BTP Destination that holds the SSC tenant URL and inbound communication credentials |

Set these in `manifest.yml` (Cloud Foundry) or `.env` (local development):

```yaml
env:
  SSC_TENANT_SOURCE_ID: "<your-ssc-tenant-source-id>"
  SSC_BTP_DESTINATION: "<your-btp-destination-name>"
```

### Setting Up `SSC_BTP_DESTINATION`

`SSC_BTP_DESTINATION` points to a **BTP Destination** entry that stores:
- The base URL of your SSC tenant
- The credentials of the **inbound communication system** created in SSC (see setup steps below)

These credentials are used by the service to authenticate when pushing events to the SSC tenant.

**Setup steps:**

1. **Create an inbound communication system in SSC**
   - Go to **System Settings → Administration → Communication Systems → New**
   - Enter a **Display ID** (e.g. `WO-INBOUND-EVENTS`) and a **Description**
   - Under the **Inbound** tab, set a **Password**
     - Min. 30 characters, including 5 lowercase, 5 uppercase, 5 digits, and 2 special characters
   - Save the communication system
   - Note the **Display ID** and **Password** — these are the credentials used in your BTP Destination

   > **Important:** The communication system's **Display ID** is the username. There is no separate "generate username" step — the Display ID you choose becomes the username.

2. **Assign the communication system and enable events in SSC**
   - Go to **System Settings → Integration → Inbound Custom Events**
   - Click **Edit** and set the **Communication System** to the one you created above
   - Enable the events relevant to this service:
     - `workOrderCreate`
     - `workOrderUpdate`
     - `workOrderDelete`
     - `workOrderCurrentImageData`
   - Save

3. **Create a BTP Destination**
   - In your BTP subaccount, go to **Connectivity → Destinations → New Destination**
   - Set **Type** to `HTTP`
   - Set **URL** to your SSC tenant's base URL (e.g. `https://your-tenant.cxm-salescloud.com/`)
   - Set **Authentication** to `BasicAuthentication`
   - **User**: the **Display ID** of the communication system from step 1 
   - **Password**: the password you set in the communication system's Inbound tab
   - Note the destination **Name** — this is the value for `SSC_BTP_DESTINATION`

---

## Implementation Notes

- CUD events are **fire-and-forget**: failures are logged but do not affect the API response
- The `WorkOrderCudEventService` reads `sourceId` and `btpDestination` from the current request session
- The `WorkOrderEventTransformer` performs all entity → payload transformations
- Events are sent via `EventServiceClient` using SAP Cloud SDK's HTTP client with JWT principal propagation
