# Work Order Management Service - Custom Service for SAP Sales and Service Cloud

> **⚠️ Reference Example**: This is a sample application provided for demonstration and learning purposes. It should be thoroughly reviewed, tested, and customized to your specific requirements before use in a production environment.

[![NestJS](https://img.shields.io/badge/NestJS-9.0.0-red?logo=nestjs)](http://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![SAP BTP](https://img.shields.io/badge/SAP%20BTP-Cloud%20Platform-blue?logo=sap)](https://help.sap.com/docs/btp/sap-business-technology-platform/sap-business-technology-platform?version=Cloud)
[![SAP HANA](https://img.shields.io/badge/SAP%20HANA-Database-blue?logo=sap)](https://www.sap.com/products/technology-platform/hana.html)

## 📚 Quick Links

- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Environment Setup](./env.example)** - Configuration template

## Table of Contents

- [Overview](#overview)
- [Business Use Case](#business-use-case---work-order-management)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Deployment & Configuration](#deployment--configuration)
- [API Usage Examples](#api-usage-examples)
- [Architecture & Technical Design](#architecture--technical-design)
- [Testing](#testing)
- [Analytics Integration](#analytics-integration-optional)
- [Troubleshooting](#troubleshooting)

## Overview

### What is "Custom Service" in SAP Sales and Service Cloud?

**Custom Service** is SAP's side-by-side extensibility pattern that allows you to build and deploy services outside SAP Sales and Service Cloud (SSC V2) while maintaining seamless integration. The key concept: your service runs independently (on SAP BTP or any cloud platform), but its metadata (entity structures, API definitions) is registered in SSC V2, enabling native-like functionality.

**Why Use Custom Services?**
- **Extend Beyond Standard**: Add custom business objects and logic not available in SSC V2 out-of-the-box
- **Auto-Generated UIs**: SSC V2 automatically creates List views, Detail views, Quick Create, and Quick View screens for your entities
- **Native Integration**: Leverage built-in SSC V2 features like autoflow, timeline, search, and analytics without custom development
- **Flexible Architecture**: Deploy on any platform while maintaining tight integration with SSC V2
- **Consistent UX**: End users get the same look-and-feel as standard SSC V2 applications

**Learn more**: [Custom Services in SAP Sales and Service Cloud](https://help.sap.com/docs/help/23ec04ee830846958605622f27ff5c3d/84d839f793b54021be498811bc866846.html)

### About This Sample Application

This repository provides a **Work Order Management Service** - a complete reference implementation of a Custom Service for SSC V2. It demonstrates:

- ✅ How to build a custom service following SSC V2 metadata and API guidelines
- ✅ Integration with SAP BTP services (HANA, XSUAA, Destination Service)
- ✅ Real-world use case: managing complex work orders with products and schedule lines
- ✅ Integration with SSC V2 Employee and Account APIs using SAP Cloud SDK
- ✅ Production-ready code structure with NestJS, TypeScript, and TypeORM

**Technology Stack**: NestJS (Node.js framework) with TypeScript, deployed on SAP BTP Cloud Foundry with SAP HANA database.

## Business Use Case - Work Order Management

### The Problem

Enterprise service organizations need to manage complex service delivery projects that involve:
- Multiple deliverables or products within a single engagement
- Detailed scheduling and resource planning across deliverables  
- Revenue tracking at granular levels
- Integration with employee/resource management systems
- Status tracking throughout the service lifecycle

Standard SSC V2 doesn't provide this level of detail for complex service scenarios out-of-the-box. **This is where a Custom Service bridges the gap.**

### The Solution - Custom Work Order Service

This sample demonstrates how a Custom Service solves the above problem by providing:

- **Work Order Lifecycle Management**: Create, update, track, and manage work orders from initiation to completion
- **Multi-Product Support**: Associate multiple work products with each work order for complex service scenarios
- **Detailed Scheduling**: Manage schedule lines with requested vs. confirmed quantities and delivery dates
- **Employee Integration**: Real-time employee data from SSC V2 (project leads) via API integration
- **Account Integration**: Real-time account data from SSC V2 via API integration
- **Hierarchical Revenue Tracking**: Track estimated revenue at both work order and individual product levels

### Entity Structure

The service is built around three main entities with hierarchical relationships:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Work Order                              │
│  • Order Name, Customer, Status, Display ID                     │
│  • Start/End Dates, Project Lead, Account            │
│  • Currency Code, Content (Revenue), Subscriptions              │
└────────────────────┬────────────────────────────────────────────┘
                     │ 1 : N relationship
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Work Product                              │
│  • Work Product ID, Work Product Name                           │
│  • Customization Details, Quantity                              │
│  • Product Category, Completion Percentage, Product Type Code   │
│  • Status, Currency Code, Content                               │
└────────────────────┬────────────────────────────────────────────┘
                     │ 1 : N relationship
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Schedule Line                              │
│  • Display ID, Schedule Line Name                               │
│  • Date, Requested End Date                                     │
│  • Requested/Confirmed Quantities, Status                       │
└─────────────────────────────────────────────────────────────────┘
```

### Example Scenario

**Scenario**: An IT consulting company wins a contract to implement SAP Sales Cloud for ACME Corporation.

1. **Work Order**: "SAP Sales Cloud Implementation - ACME Corp"
   - Customer: ACME Corporation
   - Project Lead: John Doe (from C4C Employee API)
   - Estimated Revenue: $250,000
   - Duration: 6 months
   - Status: In Progress

2. **Work Products** (Individual deliverables/milestones within the work order):
   
   Each work product represents a specific deliverable or service component:
   
   - **Work Product 1**: 
     - Work Product ID: WP-001
     - Work Product Name: Business Process Design
     - Customization Details: Analyze current processes and design future state
     - Quantity: 1
     - Product Category: CONSULTING
     - Completion Percentage: 100
     - Product Type Code: BP_DESIGN
     - Estimated Revenue: $80,000
     - Status: COMPLETED
   
   - **Work Product 2**: 
     - Work Product ID: WP-002
     - Work Product Name: System Configuration
     - Customization Details: Configure SAP Sales Cloud according to requirements
     - Quantity: 3
     - Product Category: IMPLEMENTATION
     - Completion Percentage: 65
     - Product Type Code: SYS_CONFIG
     - Estimated Revenue: $100,000
     - Status: ACTIVE
   
   - **Work Product 3**: 
     - Work Product ID: WP-003
     - Work Product Name: Data Migration
     - Customization Details: Extract, transform, and load legacy data
     - Quantity: 2
     - Product Category: DATA_SERVICES
     - Completion Percentage: 30
     - Product Type Code: DATA_MIG
     - Estimated Revenue: $70,000
     - Status: ACTIVE

3. **Schedule Lines** (Detailed breakdown for each work product):
   
   Example for "System Configuration" (WP-002):
   
   - **Schedule Line 1**: 
     - Display ID: SL-001
     - Schedule Line Name: Phase 1 - Initial Configuration
     - Date: 2024-02-15
     - Requested Quantity: 40
     - Confirmed Quantity: 40
     - Requested End Date: 2024-03-01
     - Status: CONFIRMED
   
   - **Schedule Line 2**: 
     - Display ID: SL-002
     - Schedule Line Name: Phase 2 - Advanced Features
     - Date: 2024-03-15
     - Requested Quantity: 60
     - Confirmed Quantity: 50
     - Requested End Date: 2024-04-15
     - Status: PENDING
   
## Key Features

### Custom Service Integration
- ✅ **Metadata Compliant**: Service metadata follows SSC V2 custom service guidelines ([Metadata Reference](https://help.sap.com/docs/CX_NG_SVC/2c87cece32844c91836e535aef8f9642/cc336c1290e9483994d277d354f34dcb.html))
- ✅ **API Standards**: RESTful APIs following SSC V2 requirements for HTTP methods, error handling, and response formats ([API Guidelines](https://help.sap.com/docs/CX_NG_SVC/2c87cece32844c91836e535aef8f9642/672931631b2a462ba1c8d56c7ae28152.html))
- ✅ **UI Generation**: Automatic generation of List, Detail, Quick Create, and Quick View UIs in SSC V2

### Core Functionality
- 🔄 **Full CRUD Operations** for Work Orders, Work Products, and Schedule Lines
- 📊 **Advanced Pagination** with configurable limits (default: 50, max: 1000)
- 🔍 **Query Parameters Support**: `$top`, `$skip`, `$count`, `$filter`, `$search` for list operations (OData-like querying)
- ✅ **Data Validation** using class-validator decorators
- 📝 **Audit Trail** with created/updated timestamps
- 📈 **Analytics Event Replication**: CloudEvent-based CUD and bulk replication support for analytics pipelines (see [Analytics Integration](#analytics-integration-optional))

### SAP BTP Integration Components

**To implement this use case, the service leverages several SAP BTP services and technologies:**

- 🔐 **XSUAA (Authorization & Trust Management)**: Provides JWT-based authentication and authorization for securing the service APIs
- 🗄️ **SAP HANA Cloud**: Enterprise-grade database for storing work orders, products, and schedule lines with TypeORM entity management
- 🔄 **Destination Service**: Enables secure connectivity to external systems (SSC V2 APIs) without hardcoding credentials
- 📡 **SAP Cloud SDK**: Pre-built libraries for consuming SAP APIs with built-in authentication, error handling, and resilience
- 🚀 **Cloud Foundry Runtime**: Hosting platform on SAP BTP for deploying and scaling the NestJS application


## Prerequisites

### Understanding Key Concepts

Before getting started, it's helpful to understand these SAP BTP and SSC V2 concepts:

**🔹 Destination Service**  
A centralized service in SAP BTP for managing connections to external systems. Instead of hardcoding URLs and credentials in your application, you configure them once in BTP Cockpit. Your application retrieves connection details at runtime, supporting OAuth2, Basic Auth, and other authentication types. *In this sample, we use it to connect to SSC V2 Employee APIs.*

**🔹 XSUAA (Extended Services for UAA)**  
SAP's authentication and authorization service on BTP. It issues JWT (JSON Web Tokens) for secure API access, manages user roles and scopes, and integrates with identity providers. *This service secures all Work Order Service APIs.*

**🔹 HDI Container (HANA Deployment Infrastructure)**  
A schema in SAP HANA Cloud that isolates your application's database objects. Each application gets its own container with dedicated users and permissions. *The Work Order Service uses an HDI container to store work order data.*

**🔹 Custom Service Metadata**  
A JSON file describing your service's entities, fields, and relationships in a format SSC V2 understands. SSC V2 reads this metadata to auto-generate UIs. 

**Creating Metadata:**  
Currently, metadata creation is a **manual process** where you define entities, properties, associations, and navigation in JSON format following SSC V2 guidelines. *(\*) In the future, SAP plans to provide a designer tool for metadata creation to simplify this process.*

**Sample Metadata:**  
This sample includes a complete [`metadata.json`](./metadata.json) file demonstrating:
- Entity definitions (WorkOrder, WorkProduct, ScheduleLine)
- Properties with data types and constraints
- Hierarchical associations between entities
- Navigation properties for related entities
- Example of associating with standard SSC V2 entities (see Employee association)

> 📖 **For metadata guidelines**, see [Metadata Reference](https://help.sap.com/docs/CX_NG_SVC/2c87cece32844c91836e535aef8f9642/cc336c1290e9483994d277d354f34dcb.html)

### SAP BTP Subaccount Setup

Before deploying this service, you need to set up an SAP BTP subaccount with the required entitlements and services.

**1. SAP BTP Trial or Enterprise Account**
- Sign up for SAP BTP Trial Account: [https://account.hanatrial.ondemand.com/](https://account.hanatrial.ondemand.com/)
- Or use your organization's SAP BTP Enterprise Account

**2. Create Subaccount in Cloud Foundry Environment**
- Navigate to SAP BTP Cockpit
- Create a new subaccount or use an existing one
- Enable Cloud Foundry environment
- Create a Cloud Foundry organization and space

**3. Required Entitlements**

Ensure your subaccount has the following entitlements:
- **SAP HANA Cloud**: `hana` service with `hdi-shared` plan (minimum: 1 instance)
- **Authorization and Trust Management (XSUAA)**: `xsuaa` service with `application` plan
- **Destination Service**: `destination` service with `lite` plan
- **Application Runtime**: Sufficient memory quota 

To add entitlements:
1. Go to Subaccount → Entitlements → Configure Entitlements
2. Add the required services listed above
3. Assign appropriate quotas
4. Save changes

### Required Access & Services

To use this sample service and create UIs in SAP Sales and Service Cloud, you need:

1. **SAP Sales and Service Cloud V2**
   - Admin access for creating custom services
   - Access to generate custom UIs
   - User with appropriate authorizations

2. **SAP HANA Cloud Database**
   - HANA Cloud instance deployed in your BTP subaccount
   - To create: BTP Cockpit → SAP HANA Cloud → Create Instance
   - Choose: `SAP HANA Database` with appropriate size

### Development Tools

1. **Node.js & Package Managers**
   - Node.js >= 16.x ([Install Node.js](https://nodejs.org/))
   - npm >= 8.x (included with Node.js)

2. **Development Tools**
   - [Git](https://git-scm.com/downloads) for version control
   - [Visual Studio Code](https://code.visualstudio.com/) (recommended IDE)
   - VS Code extensions: TypeScript, ESLint, Prettier

3. **SAP BTP Tools**
   - [Cloud Foundry CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html) - Command-line interface for Cloud Foundry
   - Install on macOS: `brew install cloudfoundry/tap/cf-cli`
   - Install on Windows: Download from official website
   - Verify installation: `cf --version`

4. **Additional Tools**
   - TypeScript >= 4.7 (`npm install -g typescript`)

### User Setup in SAP BTP

**1. Create Users in BTP Cockpit**
- Navigate to: BTP Cockpit → Security → Users
- Add new user with business email
- Users need to be assigned to the appropriate Cloud Foundry org and space

**2. Assign Role Collections**
- Create custom role collections if needed
- Assign role collections to users based on your access requirements

## Deployment & Configuration

This section covers deploying the Work Order Service to SAP BTP and integrating it with SSC V2.

### Section A: External Service Deployment (SAP BTP)

These steps deploy the Work Order Service to SAP BTP Cloud Foundry.

#### Step 1: Download and Setup
```bash
# Clone the repository
git clone <repository-url>
cd CustomServiceNodeSample

# Install dependencies
npm install
```

#### Step 2: Build Application
```bash
# Build for production
npm run build
```

#### Step 3: Deploy to SAP BTP

**3.1 Login to Cloud Foundry**
```bash
cf login -a https://api.cf.<region>.hana.ondemand.com
# Enter your credentials and select target org/space
```

**3.2 Create Required Services**

**Create SAP HANA database instance**  
*Why: Stores work order, product, and schedule line data in an enterprise-grade database*
```bash
cf create-service hana hdi-shared <your-hana-db-instance>
```

**Create XSUAA service for authentication**  
*Why: Secures your APIs with JWT tokens and role-based access control*
```bash
cf create-service xsuaa application <your-xsuaa-instance> -c security/xs-security.json
```

**Create Destination service**  
*Why: Enables secure connectivity to SSC V2 Employee and Account APIs without hardcoding credentials*
```bash
cf create-service destination lite <your-destination-instance>
```

**3.3 Deploy Application**
```bash
# Deploy using manifest
cf push

# Verify deployment
cf apps
cf logs <your-app-name> --recent
```

#### Step 4: Create Destination in BTP

Create a destination in BTP Cockpit for Employee API integration:

1. Navigate to BTP Cockpit → Connectivity → Destinations
2. Create new destination with the following:
   - **Name**: `ssc-custom-service-node` (must match SSC_DESTINATION environment variable)
   - **URL**: `https://<your-ssc-tenant>.cxm-salescloud.com` (your SSC V2 system URL)
   - **Authentication**: OAuth2SAMLBearerAssertion or BasicAuthentication (based on your SSC setup)
   - **Additional Properties**: As required by your SSC V2 system

> **Note**: The exact URL format is masked for security. Use your actual SSC tenant URL.

### Section B: SSC V2 Configuration

These steps configure the custom service in SAP Sales and Service Cloud.

#### Step 5: Configure Custom Service in SSC V2

**5.1 Create Entity-Based Custom Service**
- Login to SAP Sales and Service Cloud
- Navigate to: **User Menu → System Settings → All Settings → Extensibility → Custom Services**
- Click **Create** and select **Entity-Based Custom Service**
- Enter service title and required details
- Upload the `metadata.json` file from this repository

**5.2 Configure Host Connection**
- In the Actions column for your service, select **Configure Host**
- Choose connection type:
  - **Direct Connection**: Enter host URL: `https://<your-app>.cfapps.eu10.hana.ondemand.com`
  - **Backend Connection**: Configure communication system with OAuth 2.0 authentication
- Save your changes

**5.3 Design UI Views**
- Click **Design App** in the Actions column (wait for service status to be "Activated")
- Create UI views: Work List, Detail View, Quick View, Quick Create
- Turn on **Navigation Launchpoint** to add to workspace menu

**5.4 Assign Business Roles**
- Click **More** → **[Assign Business Roles](https://help.sap.com/docs/CX_NG_SALES/ea5ff8b9460a43cb8765a3c07d3421fe/9a207a44da694ec88c3084fd3d83b3de.html)** to grant user access
- Configure workspace sequence if needed

> 📖 **For detailed instructions**, see [Create an Entity-Based Custom Service](https://help.sap.com/docs/CX_NG_SALES/ea5ff8b9460a43cb8765a3c07d3421fe/f8402bb69f984af29b33fbe2dac85173.html)

#### Step 6: Access Generated UIs

Once the custom service is configured:

1. **Navigate to Work Center**
   - Go to your designated work center in SSC V2
   - Custom service entities will appear in the navigation

2. **Available Views**
   - **Object Work List (OWL)**: List view of all work orders with search/filter
   - **Detail View**: Comprehensive view of individual work order
   - **Quick Create**: Fast creation of new work orders
   - **Quick View**: Summarized view for quick reference

3. **Create Work Order**
   - Use Quick Create or navigate to OWL
   - Fill in required fields (Order Name, Customer, Dates, etc.)
   - Add Work Products from the products facet
   - Define Schedule Lines for each product

### Section C: Integration Between External Service and SSC V2

#### How the Integration Works

1. **User accesses SSC V2 UI** → SSC V2 authenticates user and generates JWT token
2. **User interacts with Work Order UI** → SSC V2 calls your external service APIs with JWT token
3. **Your service validates JWT** → XSUAA validates the token and extracts user context
4. **Service processes request** → Business logic executes, data persists to HANA
5. **Service calls SSC V2 APIs (optional)** → Uses Destination Service to fetch employee data from SSC V2
6. **Response returned** → SSC V2 UI displays the data

#### Authentication Flow

```
SSC V2 User → SSC V2 generates JWT → Your Service validates JWT via XSUAA
```

#### Data Flow for Employee Integration

```
Your Service → Destination Service → SSC V2 Employee API → Employee Data Returned
```

**Why this matters**: The service can enrich work orders with real-time employee information (project leads, managers) directly from SSC V2, ensuring data consistency.

### Section D: Optional - Employee Integration from SSC V2

This integration enriches work orders with real-time employee data (name, ID, formatted name) from SSC V2 Employee APIs.

**Prerequisites for Employee Integration:**
- Destination configured in BTP (Step 4)
- Employee API access enabled in your SSC V2 tenant
- OpenAPI specification for Employee API

#### How Employee Integration Works

**Use Case**: When creating a work order, you provide `projectLead.id` (employee UUID). The service automatically fetches the employee's display name and formatted name from SSC V2, returning it with the work order response.

**Implementation**:
- Location: `src/employee/` directory
- Generated client: `src/employee/open-api/client/`
- Service: `employee.service.ts` handles API calls via SAP Cloud SDK

#### Regenerating Employee API Client (Advanced)

If you need to update the Employee API client or generate clients for other SSC V2 APIs:

**1. Obtain OpenAPI specification**:
- Navigate to SAP Business Accelerator Hub → API 
- Download the OpenAPI specification for the desired service
- Save to `src/employee/open-api/specification/`

**2. Generate the client**:
```bash
npx @sap-cloud-sdk/openapi-generator \
  --input src/employee/open-api/specification/employeeService.json \
  --outputDir src/employee/open-api/client \
  --transpile
```

**Why SAP Cloud SDK?**: It provides pre-built OpenAPI code generation, automatic authentication handling via Destination Service, resilience patterns (retry, circuit breaker), and type-safe TypeScript clients.

### Section E: Optional - Account Integration from SSC V2

This integration enriches work orders with real-time account data (name, ID, display ID) from SSC V2 Account APIs — allowing you to associate a work order with a specific customer account.

**Prerequisites for Account Integration:**
- Destination configured in BTP (Step 4)
- Account API access enabled in your SSC V2 tenant
- OpenAPI specification for Account API

#### How Account Integration Works

**Use Case**: When creating a work order, you provide `account.id` (account UUID). The service fetches the account's display name from SSC V2 and returns it alongside the work order.

**Implementation**:
- Location: `src/account/` directory
- Generated client: `src/account/open-api/client/`
- Service: `account.service.ts` handles API calls via SAP Cloud SDK

#### Regenerating Account API Client (Advanced)

**1. Obtain OpenAPI specification**:
- Navigate to SAP Business Accelerator Hub → Account API
- Download the OpenAPI specification
- Save to `src/account/open-api/specification/`

**2. Generate the client**:
```bash
npx @sap-cloud-sdk/openapi-generator \
  --input src/account/open-api/specification/accountService.json \
  --outputDir src/account/open-api/client \
  --transpile
```

## Local Development & Testing

### Local Development Setup

For detailed local development setup with authentication and authorization:**1. Environment Configuration**

Create `.env` file in root directory:
```env
# Database Configuration
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SCHEMA=your_db_schema

# SSC Destination
SSC_DESTINATION=btp_destination

# Development Mode
NODE_ENV=development
```
**2. Database Setup**

For local development:
```bash
npm run start:dev
```

## API Usage Examples

> **Note**: This service provides nested API endpoints following the hierarchical relationship of entities. Each entity must be created independently.

**Base URL**: 
- Local: `http://localhost:3000`
- BTP: `https://<your-approuter-name>.cfapps.<region>.hana.ondemand.com`

**Authentication**: All requests require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

#### Create Work Order (Root Entity)
```bash
POST /work-order-service/workOrders
Content-Type: application/json

{
  "orderName": "SAP Cloud Implementation",
  "status": "ACTIVE",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "numberOfSubscriptions": 5,
  "estimatedRevenue": {
    "currencyCode": "USD",
    "content": 250000
  },
  "projectLead": { "id": "<your-employee-uuid>" },
  "account": { "id": "<your-account-uuid>" },
  "Customer": "ACME Corporation",
  "displayId": "WO-2024-001"
}
```

#### Get All Work Orders with Query Parameters
```bash
GET /work-order-service/workOrders?$top=30&$skip=0&$count=true&$search=ACME
```

#### Update Work Order
```bash
PATCH /work-order-service/workOrders/{workOrderId}
Content-Type: application/json

{
  "status": "COMPLETED",
  "orderName": "Updated Order Name"
}
```

#### Get Work Products for a Work Order
```bash
GET /work-order-service/workOrders/{workOrderId}/workProducts
```

Response:
```json
{
  "value": [
    {
      "id": "1d8387a3-d14a-4a27-a27d-fd4656b4a83b",
      "workProductId": "SAP-INT-2024-001",
      "customizationDetails": "Business Process Design",
      "estimatedRevenue": {
        "currencyCode": "USD",
        "content": 80000
      },
      "status": "ACTIVE",
      "workOrderId": "e643a779-2ad2-4670-8720-1ff1a67fc77e"
    }
  ]
}
```

#### Create Work Product under Work Order
```bash
POST /work-order-service/workOrders/{workOrderId}/workProducts
Content-Type: application/json

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

#### Get Schedule Lines for a Work Product
```bash
GET /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines
```

Response:
```json
{
  "value": [
    {
      "id": "a1b2c3d4-e5f6-4a5b-8c9d-1e2f3a4b5c6d",
      "displayId": "SL-001",
      "scheduleLineName": "Phase 1 - Initial Configuration",
      "date": "2024-02-15T00:00:00.000Z",
      "requestedQuantity": 10,
      "confirmedQuantity": 10,
      "requestedEndDate": "2024-03-15T00:00:00.000Z",
      "status": "CONFIRMED",
      "workProductId": "1d8387a3-d14a-4a27-a27d-fd4656b4a83b"
    }
  ]
}
```

#### Create Schedule Line under Work Product
```bash
POST /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines
Content-Type: application/json

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

#### Update Schedule Line
```bash
PATCH /work-order-service/workOrders/{workOrderId}/workProducts/{workProductId}/scheduleLines/{scheduleLineId}
Content-Type: application/json

{
  "confirmedQuantity": 12,
  "status": "CONFIRMED"
}
```

For complete API documentation with all query parameters and response formats, refer to [API Reference Documentation](./docs/API_REFERENCE.md).

## Architecture & Technical Design

### System Architecture

The Work Order Service follows a microservices architecture deployed on SAP BTP Cloud Foundry:

```
┌──────────────────────────────────────────────────────────────────┐
│              Custom UI  (Sales and Service Cloud V2)             │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTPS Request
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  App Router (approuter)                                          │
│  • XSUAA Authentication & JWT Generation                         │
│  • Routes requests to backend service                            │
└───────────────────────────┬──────────────────────────────────────┘
                            │ Request + JWT Token
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  Work Order Service (NestJS)                                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ SessionMiddleware: Extract JWT & create session            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Controllers: WorkOrder, WorkProduct, ScheduleLine          │  │
│  │ • CRUD operations with query parameter support             │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Services: Business logic & validation (REQUEST-scoped)     │  │
│  │ • EmployeeService: Integrates with SSC V2 via Cloud SDK    │  │
│  │ • AccountService: Integrates with SSC V2 via Cloud SDK     │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ TypeORM Repositories: Data access layer                    │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────┐ ┌─────────────┐ ┌──────────────────┐
│  SAP HANA Cloud  │ │  XSUAA      │ │  Destination Svc │
│  Database        │ │  Service    │ │  (C4C API)       │
│  • work_order    │ │  • JWT auth │ │  • OAuth2        │
│  • work_product  │ └─────────────┘ └──────────────────┘
│  • schedule_lines│
└──────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS 9.x | Enterprise-grade Node.js framework |
| **Language** | TypeScript 4.7+ | Type-safe development |
| **Database** | SAP HANA Cloud | Enterprise data persistence |
| **ORM** | TypeORM | Entity management and migrations |
| **Authentication** | XSUAA | SAP BTP authentication service |
| **API Integration** | SAP Cloud SDK | OpenAPI-generated C4C API clients |
| **Validation** | class-validator | DTO validation |
| **Connectivity** | @sap-cloud-sdk/connectivity | JWT extraction and destination access |

## API Guidelines and Standards

This service follows **SSC V2 Custom Service API Guidelines**:

✅ **RESTful Design**: Standard HTTP methods (GET, POST, PATCH, DELETE)  
✅ **Hierarchical Structure**: Nested APIs following entity relationships  
✅ **CamelCase Naming**: All API paths use camelCase (e.g., `/workOrders`, `/workProducts`, `/scheduleLines`)  
✅ **Query Parameters**: `$top`, `$skip`, `$count`, `$filter`, `$search` for flexible data retrieval  
✅ **Standardized Error Responses**: Consistent error format with HTTP status codes  
✅ **Pagination**: Support for large datasets with configurable page sizes  
✅ **ID Handling**: UUID-based identifiers for all entities  
✅ **Metadata Compliance**: Service metadata matches API implementation  

## Testing

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm test -- --watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

## Analytics Integration (Optional)

This sample supports analytics event replication to SAP's analytics pipeline via CloudEvents. When configured, the service fires CUD (Create/Update/Delete) events for every work order change, and supports bulk data replication on demand.

### How It Works

- **CUD Events**: Automatically fired after every Create, Update, or Delete on a Work Order (including changes to child Work Products and Schedule Lines).
- **Data Export**: The `POST /work-order-service/workOrders/dataExportRequest` endpoint triggers a full bulk export of all Work Order data to the analytics pipeline.
- **Event Types**:
  - `customer.ssc.workorderservice.event.workOrderCreate`
  - `customer.ssc.workorderservice.event.workOrderUpdate`
  - `customer.ssc.workorderservice.event.workOrderDelete`
  - `customer.ssc.workorderservice.event.workOrderCurrentImageData` (data export)

For full event payload specifications see [`docs/ANALYTICS_EVENT_PAYLOADS.md`](docs/ANALYTICS_EVENT_PAYLOADS.md).

### Configuration

Set the following environment variables in your `manifest.yml` (or `.env` for local development):

```yaml
env:
  SSC_TENANT_SOURCE_ID: "<your-analytics-source-id>"
  SSC_ANALYTICS_DESTINATION: "<your-destination-service-name>"
```

| Variable | Description |
|---|---|
| `SSC_TENANT_SOURCE_ID` | The source ID of your SSC tenant registered in the analytics system |
| `SSC_ANALYTICS_DESTINATION` | The BTP Destination name pointing to the SSC tenant's analytics inbound connector |

> If `SSC_TENANT_SOURCE_ID` or `SSC_ANALYTICS_DESTINATION` are not configured, analytics events are silently skipped and all other service functionality works normally.

## Troubleshooting

### Common Issues

**Issue 1: Authentication Fails**
- Verify XSUAA service binding is correct
- Check JWT token is valid and not expired
- Ensure user exists in BTP with proper roles

**Issue 2: Database Connection Error**
- Verify HANA service is running
- Check database credentials in environment
- Ensure HDI container is deployed

**Issue 4: Custom Service Not Visible in SSC V2**
- Verify metadata is uploaded correctly
- Check base URL is accessible from SSC V2
- Ensure authentication is configured properly

### Logs and Debugging

```bash
# View application logs in Cloud Foundry
cf logs <your-app-name> --recent

# Stream live logs
cf logs <your-app-name>

# Enable debug mode (add to .env)
DEBUG=*
LOG_LEVEL=debug
```

## Additional Resources

### Documentation
- [Complete API Reference](./docs/API_REFERENCE.md)
- [SAP Sales and Service Cloud V2 Documentation](https://help.sap.com/docs/CX_NG_SVC/2c87cece32844c91836e535aef8f9642/cd9d3e9e327a42b590728731700c5d9a.html)
- [SAP BTP Cloud Foundry Documentation](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/9c7092c7b7ae4d49bc8ae35fdd0e0b18.html)

### Development Resources
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support and Contribution

### Getting Help

For issues and questions:
1. Review [API Documentation](./docs/API_REFERENCE.md)
2. Contact your SAP representative

### Contributing

This is a sample application provided as-is for reference. If you're building your own service:
1. Use this as a template
2. Customize entities for your use case
3. Follow SSC V2 custom service guidelines
4. Test thoroughly before deploying to production


## Disclaimer

This is a sample application intended for demonstration and learning purposes. It should be thoroughly reviewed, tested, and adapted before use in a production environment. SAP does not provide support for sample applications.

---

**Version**: 1.0.0  
**Last Updated**: December 2025 

For the latest updates and more samples, visit the [SAP Samples GitHub Organization](https://github.com/SAP-samples).
