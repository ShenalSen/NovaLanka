# Insurance Project - Docker Deployment Guide

## Overview

This project is an insurance management system with separate portals for administrators, employees, and customers. The docker-deployment uses containerized versions of:
- WSO2 Identity Server 
- WSO2 API Manager 
- WSO2 Micro Integrator (backend services)
- MySQL database
- React frontend (Vite)

## Prerequisites

Docker installed and running on your machine. You can use:
- Docker Desktop
- Rancher Desktop (1.19.3 or later)
- Any compatible Docker environment

Minimum Requirements:
- 8GB RAM available for the container
- Ports available: 9443, 9444, 9445, 9446, 8090, 8243, 8246, 5173, 3306

## Deployment Steps

### Step 1: Navigate to Docker Deployment Directory

Open a terminal and navigate to the `docker-deployment` directory:

```bash
cd docker-deployment
```

### Step 2: Create .env File from Template

Before building, create the `.env` file in the Frontend directory:

```bash
cd Frontend
cp .env.example .env
cd ..
```

### Step 3: Configure Email Notifications and Database connection properties

The project uses externalized configuration for email notifications. Update the email credentials before building the Docker image.

**Step 1: Edit the .env File**

Edit the `.env` file in the `Configs` directory:

```bash
cd Configs
cp .env.example .env
```

Edit the `.env` file with your email configuration:

```
email_from="your-email@gmail.com"
email_smtp_host="smtp.gmail.com"
email_smtp_username="your-email@gmail.com"
email_smtp_password="your-app-specific-password"
driver_className="driver-class-name"
url="database-url"
username="database-username"
password="database-password"
```

**For Gmail Users:**
- Use your Gmail address for `email_from` and `email_smtp_username`
- Generate an [App-specific password](https://support.google.com/accounts/answer/185833) and use it for `email_smtp_password`
- Do NOT use your regular Gmail password

**Important:** The Docker build automatically copies the `.env` file and passes it to the MI startup command. Ensure you configure it before building the image.

## Configure and Build the BI Services

### Part 1: Chatbot Service

1. Navigate to the **`InsuranceDemoV3/docker-deployment/BI/chatbot-src`** directory.
2. Create a **`Config.toml`** file in this directory and insert your Mistral API key into the snippet below:

```toml
[insurancedemo.chatbot]
mistralAikey = "<YOUR_MISTRAL_API_KEY>"
mistralBaseUrl = "https://api.mistral.ai"

```

3. Run the `bal build` command inside the **`chatbot-src`** folder to compile the project.
4. Locate your **`Config.toml`** file and the newly generated `.jar` file inside the **`chatbot-src/target`** directory.
5. Copy both files and paste them into the **`InsuranceDemoV3/docker-deployment/BI/chatbot`** folder.

---

### Part 2: Proxy Service

1. Navigate to the **`InsuranceDemoV3/docker-deployment/BI/proxy-src`** directory.
2. Run the `bal build` command inside the folder to compile the project.
3. Locate the newly generated `.jar` file inside the **`proxy-src/target`** directory.
4. Copy the `.jar` file and paste it into the **`InsuranceDemoV3/docker-deployment/BI/proxy`** folder.

### Step 4: Build the Docker Image

Run the following command to build the Docker image:

```bash
docker build -t insurance-img-v3is .
```

### Step 5: Run the Docker Container

Once the image is built, start the container with all required port mappings:

```bash
docker run -it --rm \
  -p 9443:9443 \
  -p 9444:9444 \
  -p 9445:9445 \
  -p 9446:9446 \
  -p 8090:8090 \
  -p 8243:8243 \
  -p 8246:8246 \
  -p 8253:8253 \
  -p 8254:8254 \
  -p 8290:8290 \
  -p 9164:9164 \
  -p 3307:3306 \
  -p 5173:5173 \
  -p 1025:1025 \
  -p 8025:8025 \
  insurance-img-v3is
```

**Note on Port Offsets:**
- **WSO2 Identity Server (IS)**: Port offset 2 → Console at https://localhost:9445
- **WSO2 API Manager (APIM)**: Port offset 3 → Publisher at https://localhost:9446, Gateway at https://localhost:8246
- **WSO2 Micro Integrator (MI)**: No offset → Management Console at http://localhost:9164
- **MySQL**: Mapped to port 3307 on host (3306 inside container)
- **Frontend**: Running at http://localhost:5173


## WSO2 Identity Server Configuration

The container automatically:
- Installs the MySQL JDBC connector to IS
- Executes the IS MySQL dbscripts to create identity management database tables
- Starts all required services

Once the container is running, configure the Identity Server following these steps.

### 1. Login to the Identity Server Console

1. Open your browser and navigate to: **https://localhost:9445/console**
2. Accept the SSL certificate warning (self-signed certificate)
3. Login using the admin credentials:
   - **Username:** `admin`
   - **Password:** `admin`

---

### 2. Create an Application

1. Navigate to **Applications** → **New Application**
2. Under **Application Types**, select **Single-page Application**
3. Enter the following details:
   - **Name:** `Insurance` *(or your preferred application name)*
   - **Authorized Redirect URLs:**
     ```
     http://localhost:5173
     ```
     *(Port may vary depending on your Vite app)*
4. Click **Create**
5. The application will now be created successfully

---

### 3. Create an Attribute

1. Navigate to **User Attributes & Stores** → **Attributes**
2. Under **Manage Attributes**, click **New Attribute**
3. Fill in the details:
   - **Attribute Name:** `db_id`
   - **Attribute Display Name:** `db_id`
4. Click **Finish**
5. After created the attribute then find it under the Manage Attributes > Attributes section. Then select the `db_id` attribute. scroll down to Attribute Configurations. then tick      `display` and `required` checkboxes under the Administrator Console field.

---

### 4. Create an OIDC Scope for the Attribute

1. Go to **User Attributes & Stores** → **Attributes**
2. Under **Manage Attribute Mappings**, select **OpenID Connect**
3. Click on **Scopes** (right side of the search bar)
4. Click **New OIDC Scope** and enter:
   - **Scope:** `db_id`
   - **Display Name:** `db_id`
5. Click **Next**
6. In the attribute list, select the previously created `db_id` attribute
7. Click **Finish**

---

### 5. Add the Scope to the Application

1. Navigate to **Applications** and select the created application
2. Go to the **User Attributes** tab
3. Tick the checkboxes for:
   - `db_id`
   - `groups`
4. Scroll down and click **Update**

---

### 6. Create a User Store

1. Navigate to **User Attributes & Stores** → **User Stores**
2. Click **New User Store** and select **Database** as the **User Store Type**
3. Enter the following details:
   - **Name:** `insurance`
   - **Connection URL:**
     ```
     jdbc:mysql://localhost:3306/insurance?useSSL=false&allowPublicKeyRetrieval=true
     ```
   - **Connection Name:** `root`
   - **Connection Password:** `12345`
   - **Driver Name:** `com.mysql.cj.jdbc.Driver`
4. Click **Finish**

---

### 7. Create Groups

1. Navigate to **User Management** → **Groups**
2. Select the **insurance** user store from the top-right dropdown (instead of `PRIMARY`)
3. Click **Add Group**
4. Create the following groups (click **Finish** after each one):
   - `Customers`
   - `Employees`
   - `admins`

---

### 8. Create Users

> **Note:** Since this is an insurance domain portal, self-registration is **not** allowed. All users must be created manually with passwords.

1. Navigate to **User Management** → **Users**
2. Select the **insurance** user store from the top-right dropdown (instead of `PRIMARY`)
3. Click **Add User** → **Single User**
4. Fill in the details:
   - **Username:** *(use from database)*
   - **db_id:** *(as per database records — refer to section 9)*
   - **Password:** *(set manually or generate)*
5. Click **Next** and assign the user to one of the groups according to their roles:
   - `Customers`
   - `Employees`
   - `admins`
6. Click **Save and Continue**

---

### 9. User Data from Database

Based on the existing MySQL script:

**Employees**
| Name       | db_id  |
|------------|--------|
| Alice      | E_001  |
| Bob        | E_002  |
| Carol      | E_003  |
| Divya      | E_004  |
| Eve        | E_005  |

**Customers**
| Name   | db_id  |
|--------|--------|
| David  | C_001  |
| Divya  | C_002  |
| Frank  | C_003  |
| Grace  | C_004  |
| Harry  | C_005  |

---

## WSO2 API Manager (APIM) Configuration

### Import and Deploy Swagger Files

#### 1. Access the Publisher Portal

- Open your web browser and go to: **https://localhost:9446/publisher**
- Accept the SSL certificate warning
- Login with credentials:
  - **Username:** `admin`
  - **Password:** `admin`

#### 2. Navigate to the API Import Section

- On the dashboard, click **REST API**
- Select **Import OpenAPI** to begin importing Swagger files

#### 3. Import Swagger Files

Browse to the `docker-deployment/Api-definitions` folder and import each Swagger file:
- `swagger-AddressVerification.yaml`
- `swagger-ClaimsApi.yaml`
- `swagger-CustomersApi.yaml`
- `swagger-EmailApi.yaml`
- `swagger-EmployeesApi.yaml`
- `swagger-PoliciesApi.yaml`
- `swagger-ProductsApi.yaml`
- `swagger-PolicyValidationApi.yaml`
- `swagger-PolicySyncApi.yaml`
- `swagger-MissedCallsApi.yaml`
- `swagger-ChatbotApi.yaml`

#### 4. Configure JSON Responses

After importing each API, configure the XML to JSON mediator for the following 7 APIs:
- AddressVerificationAPI
- ClaimsAPI
- CustomersAPI
- EmailAPI
- EmployeesAPI
- PoliciesAPI
- ProductsAPI

**For each API:**

1. Click on the "policies" tab within each API
2. Select XML to JSON mediator under Policy List → Common policies
3. Drag and drop to the response flow
4. Select **Apply to all resources** option
5. Click **Save and Deploy**
6. Select **default** gateway and deploy it
7. Repeat this process for all 7 APIs
8. Configure the request flow for ClaimsAPI and PoliciesAPI to include a remove-header policy that strips the `Content-Type`(value) header.

**Important Note**: Exclude the following APIs from XML to JSON conversion as they handle responses differently: But need to deploy them in publisher.
- MissedCallsAPI
- PolicyValidationAPI
- PolicySyncAPI
- ChatbotAPI

### Configure MCP Servers
For the following APIs generate and publish MCP servers using the API Publisher's "Generate MCP Server" workflow.

1. Open the API detailed view in the WSO2 Publisher and click **Generate MCP Server**.
2. Select the tool operations to expose and provide the MCP server metadata, then click **Create** and **Publish**.

ClaimsAPI
- Tools to select:
   - `get_claims`
   - `get_claim_by_id`
   - `get_claims_customer_by_id`
- MCP server name: `ClaimsMCP`
- Context: `/claims-mcp`
- Version: `1.0.0`

PoliciesAPI
- Tools to select:
   - `get_policies`
   - `get_policy_by_id`
   - `get_policies_customer_by_customer_id`
- MCP server name: `PoliciesMCP`
- Context: `/policies-mcp`
- Version: `1.0.0`

#### 5. Configure MissedCalls API (API Key Security)

1. In Publisher Portal, navigate to **APIs** and select **MissedCallsAPI**
2. Go to **API Configurations** tab
3. Click on the **Runtime** section
4. Under **Application level security**, tick the **"Api Key"** checkbox
5. Click **Save and Deploy**

#### 6. Publish the MissedCalls API

1. Go to the **Publish** tab
2. Click **Lifecycle**
3. Click **Publish** to publish the API

#### 7. Create Application in DevPortal

1. Switch to **DevPortal**: https://localhost:9446/devportal
2. Navigate to **Applications**
3. Click **ADD NEW APPLICATION**
4. Enter Application name: `Insurance App`
5. Click **Create**

#### 8. Subscribe to the MissedCalls API

1. Go to **Subscriptions**
2. Click **Subscribe** for the MissedCallsAPI
3. Select the `Insurance App` application
4. Complete the subscription

#### 9. Generate API Key

1. Go to the **API Keys** tab
2. Under **Key restrictions**, switch from default selection to **HTTP Referrers (Web Sites)**
3. In the **Referer** field, add: `http://localhost:5173/*`
4. Click **GENERATE KEY**
5. In the pop-up dialog, **deselect** the API Key with infinite validity period checkbox and **specify the required validity period**.
6. Copy the generated API Key

---

## Post-Deployment Configuration

After completing the Identity Server and API Manager setup steps above, you need to update the frontend `.env` file with two critical values inside the running container:

1. **VITE_AUTH_CLIENT_ID** - From the Identity Server application (step 2)
2. **VITE_MISSED_CALL_API_KEY** - From the API Manager API Key (step 9 above)

### Step 1: Get Your Container ID

First, identify your running container:

```bash
docker ps
```

This will show your container ID. Use it in the commands below (replace `<container_id>` with your actual ID).

### Step 2: Update VITE_AUTH_CLIENT_ID

After creating the application in Identity Server (section 2), you have the Client ID. Update it in the `.env` file:

```bash
docker exec -it <container_id> /bin/bash -c "sed -i 's|^VITE_AUTH_CLIENT_ID=.*|VITE_AUTH_CLIENT_ID=<your_client_id>|' /home/wso2/app/.env"
```

**Example:**
```bash
docker exec -it 5f7f14c99d64 /bin/bash -c "sed -i 's|^VITE_AUTH_CLIENT_ID=.*|VITE_AUTH_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6|' /home/wso2/app/.env"
```

**Verify the update:**
```bash
docker exec -it <container_id> grep "VITE_AUTH_CLIENT_ID" /home/wso2/app/.env
```

### Step 3: Update VITE_MISSED_CALL_API_KEY

After generating the API Key in API Manager (section 9), update it in the `.env` file:

```bash
docker exec -it <container_id> /bin/bash -c "sed -i 's|^VITE_MISSED_CALL_API_KEY=.*|VITE_MISSED_CALL_API_KEY=<your_generated_api_key>|' /home/wso2/app/.env"
```

**Example:**
```bash
docker exec -it 5f7f14c99d64 /bin/bash -c "sed -i 's|^VITE_MISSED_CALL_API_KEY=.*|VITE_MISSED_CALL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...|' /home/wso2/app/.env"
```

**Verify the update:**
```bash
docker exec -it <container_id> grep "VITE_MISSED_CALL_API_KEY" /home/wso2/app/.env
```

### Step 4: Rebuild the Frontend

Rebuild the frontend application to apply the new configuration:

```bash
docker exec -it <container_id> bash -c "cd /home/wso2/app && npm run build"
```

### Step 5: Clear Browser Cache and Refresh

1. Open your browser and navigate to: **http://localhost:5173/**
2. Refresh the page.

### Verification Checklist

After completing all steps, verify:

- [ ] VITE_AUTH_CLIENT_ID is set in `.env`
- [ ] VITE_MISSED_CALL_API_KEY is set in `.env`
- [ ] Frontend rebuild completed successfully
- [ ] Can login to frontend with Identity Server credentials

---

## Service Ports

- WSO2 Identity Server (Console): https://localhost:9445/console
- WSO2 API Manager (Publisher): https://localhost:9446/publisher
- WSO2 API Manager (DevPortal): https://localhost:9446/devportal
- WSO2 API Manager (Gateway): https://localhost:8246
- WSO2 Micro Integrator: http://localhost:9164
- Frontend Application: http://localhost:5173
- MySQL Database: localhost:3307 (host machine, 3306 inside container)

## Ballerina Chatbot Integration

### Prerequisites

Before running the chatbot, ensure:

1. **APIM must be running and fully initialized**
2. **MCP API resources must be created in APIM:**
   - ClaimsMCP API configured with tools (get_claims, get_claim_by_id, get_claims_customer_by_id)
   - PoliciesMCP API configured with tools (get_policies, get_policy_by_id, get_policies_customer_by_customer_id)
3. **Both APIs deployed and active in API Manager**

### Starting the Chatbot

The chatbot runs as a separate service and **must be manually started only after APIM setup is complete**.

#### Inside the Running Container

Open a new terminal and execute the chatbot startup script:

```bash
docker exec -it <container-id> sh /home/wso2/chatbot.sh
```

Replace `<container-id>` with your actual container ID (obtainable via `docker ps`).

#### What the Script Does

The `start-chatbot.sh` script:
1. Verifies both MCP endpoints are reachable:
   - `https://localhost:8246/claims-mcp/1.0.0/mcp`
   - `https://localhost:8246/policies-mcp/1.0.0/mcp`
2. Only starts the Ballerina chatbot JAR if **both MCPs** respond successfully
3. Provides clear feedback on endpoint status
4. Exits with error if MCPs are not available

## UI Access and Testing

### Accessing the Frontend

Once the frontend is running, open your browser and go to: **http://localhost:5173/**

You will see a login screen with access to three portals:
- **Admin Portal** 
- **Employee Portal** 
- **Customer Portal** 

### Login with Sample Users

Use the users you created in the Identity Server with their assigned groups. Example credentials:
- **Admin:** `admin` / `admin` (Group: admins)
- **Employee:** Use any employee username / `<password>` (Group: Employees)
- **Customer:** Use any customer username / `<password>` (Group: Customers)

### Postman Testing

Use the endpoints provided in the `docker-deployment/PostmanCollection` to interact with the backend services:
- **APIM Endpoints:** `docker-deployment/PostmanCollection/APIM-endpoints/`
- **MI Endpoints:** `docker-deployment/PostmanCollection/MI-endpoints/`

## Portal Access and Credentials

Once the frontend is running, open your browser and navigate to: **http://localhost:5173/**

You will see a login screen with access to three portals.

For each user created in the Identity Server, you have a **username** and **password**. Using these credentials, you can log in and navigate to the corresponding role-specific UI, which will display the relevant details for that user.
Use the appropriate credentials to access each portal based on the user's role.

## Troubleshooting

### 1. SSL Certificate Warning

**Problem:** Browser shows SSL certificate warning when accessing https://localhost:9445 or https://localhost:9446

**Solution:** Accept the SSL certificate warning. This is expected for self-signed certificates in development environments.

### 2. Database Connection Error in User Store

**Problem:** "Connection refused" error when connecting to database user store

**Solution:**
1. Verify MySQL is running inside the container
2. Check that the JDBC driver is properly installed
3. Verify the connection URL uses the correct password: `12345`
4. Ensure you're using: `jdbc:mysql://localhost:3306/insurance?useSSL=false&allowPublicKeyRetrieval=true`

### 3. Frontend Not Loading After .env Update

**Problem:** Frontend still shows old configuration after updating .env

**Solution:**
1. Rebuild the frontend: `docker exec -it <container_id> bash -c "cd /home/wso2/app && npm run build"`
2. Clear browser cache and do a hard refresh (Ctrl+Shift+Del, then Ctrl+F5)
3. If issue persists, restart the entire container

### 4. Address Verification API Errors

**Problem:** Address verification returns brotli compression errors in MI logs

**Solution:** Add a "Remove Header" policy in APIM to prevent brotli compression:
1. Edit AddressVerificationAPI in Publisher
2. Go to Policies tab
3. Add "Remove Header" policy
4. Set header name to `Accept-Encoding`
5. Save and deploy

### 5. CORS Errors in Browser Console

**Problem:** CORS-related errors when calling APIs from frontend

**Solution:**
1. Navigate to https://localhost:8246 in a new browser tab
2. Accept the SSL certificate warning
3. Return to http://localhost:5173/ and refresh
4. CORS configuration is pre-configured in the container



