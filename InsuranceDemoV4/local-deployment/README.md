# Insurance Project - Local Deployment Guide

## Overview

This project is an insurance management system with separate portals for administrators, employees, and customers. The system uses a React frontend, WSO2 Micro Integrator for backend services, and WSO2 API Manager for API management.

## Prerequisites

- Node.js and npm
- MySQL database
- Visual Studio Code
- WSO2 Micro Integrator 4.4.0 or above
- WSO2 API Manager 4.5 or above
- WSO2 Identity Server 7.1.0 or above
- Ballerina 2201.13.4 or above


## Frontend Setup

1. Navigate to the `local-deployment` folder
2. Go to the `frontend` directory
3. Open the folder in Visual Studio Code
4. Create a `.env` file from `.env.example`. (Use quotation marks (`""`) for all values in the `.env` file)
5. Launch the terminal and run the following commands:

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

## Backend Setup

### Database Setup

This project uses MySQL as the relational database management system.

1. Navigate to the `mysql-scripts` folder in the project directory
2. Run the provided SQL script to create the insurance database locally
3. The script will automatically create the necessary tables and seed any required initial data

### WSO2 Micro Integrator (MI) Setup

#### Download and Installation

1. Download WSO2 Micro Integrator from: https://wso2.com/integrator/

#### Prepare the .CAR Files

Since most use cases in this project use Data Services, proper configuration and export is important:

1. Navigate to `InsuranceDemoV3_IS/local-deployment/Backend-integrationProjects` 
2. Open each integration project in Visual Studio Code (excluding AddressVerification).
3. Open the MI Extension panel and locate the Data Service section
4. Update the database connection properties in each data service and the SMTP connection configurations in the integration projects
   (All configurations have been externalized following [MI standards](https://mi.docs.wso2.com/en/latest/develop/externalized-configuration/#data-service-parameters). To update the connection properties, create a `.env` file using the `.env.example` and  update the configurations with actual values.)
5. Export the .CAR files using the MI Extension
6. Copy the exported .CAR files into the downloaded MI server `wso2mi-4.4.0\repository\deployment\server\carbonapps` folder

#### JDBC Connector Setup

1. Download MySQL Connector version 9.2.0
2. Paste the .jar file into the 'wso2mi-4.4.0\lib' directory of your downloaded WSO2 Micro Integrator server

#### Configure Email Notifications and Database Connection Properties

All sensitive configuration is externalized using `.env` files per project. Each project reads its config via `config.properties`.

**Step 1: Declare Configuration Parameters**

The parameters are declared in: `Backend-integrationProjects/<opened_integration_project>/src/main/wso2mi/resources/conf/config.properties`

```
# SMTP Configuration
email_from:string
email_smtp_host:string
email_smtp_username:string

# Database Configuration
driver_className:string
url:string
username:string
password:string

# Gateway endpoints
api_gateway_url:string

# Frontend URL
frontend_url:string
```

**Step 2: Create .env File**

Create a `.env` file in the `Backend-integrationProjects/PolicyLifecycle/` directory (or copy from `.env.example`):

```bash
cd Backend-integrationProjects/PolicyLifecycle/
cp .env.example .env
```

Edit the `.env` file with your actual configurations:

```
# SMTP Configuration
email_from="your-email@gmail.com"
email_smtp_host="smtp-host"
email_smtp_username="your-email@gmail.com"

# Frontend URL 
frontend_url="http://localhost:5173"

# Database Configuration
driver_className="driver-class-name"
url="database-url"
username="database-username"
password="database-password"

# Gateway endpoints
api_gateway_url=https://localhost:8243 # or defined endpoint
```

**For Gmail Users:**
- Use your Gmail address for `email_from` and `email_smtp_username`
- Generate an [App-specific password](https://support.google.com/accounts/answer/185833) and store it in Secure Vault as `email_smtp_password`
- Do NOT use your regular Gmail password

**Step 3: Store `secrets` in WSO2 MI Secure Vault**

Open the downloaded MI server `conf/deployment.toml` file and locate the `[secrets]` section.

Add the SMTP password entry in this section:

```toml
[secrets]
email_smtp_password = "[your-app-specific-password]"
```

Replace `[your-app-specific-password]` with the actual app specific password generated for the email account.

**Step 4: Encrypt the secret with Cipher Tool**

Run the Cipher Tool from the downloaded MI server `bin` directory to encrypt the secret value in `deployment.toml`.

**Linux/macOS:**
```bash
./ciphertool.sh -Dconfigure
```

**Windows:**
```bash
ciphertool.bat -Dconfigure
```

**Step 5: Verify the encrypted value**

After running the Cipher Tool, check the MI server `conf/deployment.toml` file to confirm only the secret value has been encrypted:

```bash
cat <MI_HOME>/conf/deployment.toml
```

**Step 6: Start the MI server**

Navigate to the bin folder of WSO2 MI and run with the `.env` file:

**Linux/macOS:**
```bash
sh micro-integrator.sh --env-file=/path/to/Backend-integrationProjects/PolicyLifecycle/.env
```

**Windows:**
```bash
micro-integrator.bat --env-file=C:\path\to\Backend-integrationProjects\PolicyLifecycle\.env
```

When the server starts, it may prompt for:

```text
[Enter KeyStore and Private Key Password :]
```

Enter the default password:

```text
wso2carbon
```

This is the default keystore/private key password used by the MI Secure Vault setup.

**Important:** Always include the `--env-file` flag when starting MI so the non-secret email settings are loaded.

Note: This setup uses WSO2 MI version 4.6

## Ballerina Chatbot

This project includes a `Insurance AI Chatbot` that integrates with Mistral AI and provides a conversational assistant. The chatbot can invoke backend MCP tools and is implemented using Ballerina.

- **Requirements:**
   - Ballerina CLI (`bal`) installed on your machine.
   - A Mistral AI API key. Generate or view your API keys at: [Mistral Portal](https://console.mistral.ai/home?profile_dialog=api-keys).

- **Configuration:**
   - The chatbot project is located at: `InsuranceDemoV4/local-deployment/Backend-integrationProjects/chatbot`.
   - Provide the Mistral API key by editing `Config.toml` in the chatbot project and setting the `[insurancedemo.chatbot] mistralAikey` value, or use Ballerina's configurable parameters. Example `Config.toml` snippet:

```toml
[insurancedemo.chatbot]
mistralAikey = "<YOUR_MISTRAL_API_KEY>"
mistralBaseUrl = "https://api.mistral.ai"
```

- **Run the chatbot service:**

```bash
# from the repository root
cd InsuranceDemoV4/local-deployment/Backend-integrationProjects/chatbot
bal run
```

The Ballerina service will start and expose the chatbot endpoints used by the frontend and API definitions. If you prefer to pass configuration at runtime, use Ballerina's configuration options (see the Ballerina docs) or set the values in `Config.toml` before running.

## WSO2 API Manager (APIM) Setup

### Download and Installation

1. Download WSO2 API Manager 4.5 from: https://wso2.com/api-manager/
2. Navigate to the bin folder
3. Start the API Manager server:
   - Linux/macOS: `api-manager.sh`
   - Windows: `api-manager.bat`

Note: This project was built on WSO2 APIM version 4.5, but it is version-independent and should work with later versions.

### API Import Process

1. Go to the `Api-definitions` folder in the project
2. Import all (14) APIs using the "Import by OpenAPI" option under REST API in the WSO2 Publisher Portal
3. Import each `.yaml` (Swagger/OpenAPI) file one by one to create the APIs

The available API definition files are:

| File | API |
|---|---|
| `swagger-PolicyLifecycleApi.yaml` | Policy purchase and renewal |
| `swagger-QuotesApi.yaml` | Instant quote generation |
| `swagger-PaymentsApi.yaml` | Payment recording |
| `swagger-PoliciesApi.yaml` | Policy data read/write |
| `swagger-CustomersApi.yaml` | Customer data |
| `swagger-EmployeesApi.yaml` | Employee data |
| `swagger-ProductsApi.yaml` | Insurance products |
| `swagger-ClaimsApi.yaml` | Claims management |
| `swagger-EmailApi.yaml` | Email notifications |
| `swagger-MissedCallsApi.yaml` | Missed call tracking |
| `swagger-PolicyValidationApi.yaml` | Policy validation |
| `swagger-PolicySyncApi.yaml` | Policy sync |
| `swagger-AddressVerification.yaml` | Address verification |
| `swagger-ChatbotApi.yaml` | AI chatbot |

### Configure JSON Responses

After importing each API, configure the response mediator for the following APIs:
- EmployeesAPI
- PoliciesAPI
- ProductsAPI
- CustomersAPI
- ClaimsAPI
- EmailAPI
- AddressVerificationAPI

For the APIs listed above:

1. Click on the "policies" tab in APIM
2. Select XML to JSON mediator and drag and drop on response flow
3. Select "add all resources" option
4. Save and deploy
5. Repeat this process for all 7 APIs
6. Configure the "GET" requestS flow for ClaimsAPI and PoliciesAPI to include a remove-header policy that strips the `Content-Type`(value) header.

**Note**: Exclude the following APIs from this step as they handle responses differently:
- MissedCallsAPI
- PolicyValidationAPI
- PolicySyncAPI
- ChatbotAPI
- QuotesAPI
- PolicyLifecycleAPI
- PaymentsAPI

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

### Configure MissedCallsAPI

After importing the APIs, configure the MissedCalls API to generate an API Key:

#### 1. Enable API Key Security

1. Go to WSO2 API Manager Publisher Portal: `http://localhost:9443/publisher`
2. Navigate to **APIs** and select **MissedCallsAPI**
3. Go to **API Configurations** tab
4. Click on the **Runtime** section
5. Under **Application level security**, tick the **"Api Key"** checkbox
6. Click **Save and Deploy**

#### 2. Publish the API

1. Switch to the **Publish** tab
2. Go to **Lifecycle**
3. Click **Publish** to publish the API

#### 3. Create an Application in DevPortal

1. Switch to **DevPortal**
2. Navigate to **Applications**
3. Click **ADD NEW APPLICATION**
4. Enter Application name: `Insurance App`
5. Click **Create**

#### 4. Subscribe to the API

1. Go to **Subscriptions**
2. Click **Subscribe** for the MissedCallsAPI
3. Select the `Insurance App` application
4. Complete the subscription

#### 5. Generate API Key

1. Go to the **API Keys** tab
2. Under **Key restrictions**, switch from default selection to **HTTP Referrers (Web Sites)**
3. In the **Referer** field, add: `http://localhost:5173/*`
4. Click **GENERATE KEY**
5. In the pop-up dialog, deselect the API Key with infinite validity period checkbox and specify the required validity period.
6. Copy the generated API Key

#### 6. Update Frontend Configuration

1. Open the `.env` file you created in the Frontend directory
2. Replace the `VITE_MISSED_CALL_API_KEY` value with the generated API Key:
   ```
   VITE_MISSED_CALL_API_KEY=<your_generated_api_key>
   ```
3. Save the file

## WSO2 Identity Server Setup

### Add JDBC Connector to IS

1. Download MySQL Connector version 9.2.0 (same connector used for MI).
2. Paste the connector `.jar` into your downloaded Identity Server `wso2is-X.X.0/repository/components/lib` directory.

### 1. Login to the Identity Server Console
1. Go to [https://wso2.com/identity-server/](https://wso2.com/identity-server/) and download the WSO2 Identity Server.  
2. Unzip the downloaded file in your local machine.

3. Go to **deployment.toml** and add offset 2 as shown below
```
[server]
base_path = "https://$ref{server.hostname}:${carbon.management.port}"
hostname = "localhost"
node_ip = "127.0.0.1"
offset = 2
```

4. Navigate to the `bin` directory inside the extracted folder.  
5. Run the server:  
   - On **Windows**: Run `wso2server.bat`  
   - On **Linux/Mac**: Run `sh wso2server.sh`  
6. Once the server is running, open the console in your browser at:  
   **https://localhost:9445/console**  
7. Login using the admin credentials:  
   - **Username:** `admin`  
   - **Password:** `admin`   

---

## 2. Create an Application
1. Navigate to **Applications** → **New Application**.  
2. Under **Application Types**, select **Single-page Application**.  
3. Enter the following details:  
   - **Name:** `Insurance` *(or your preferred application name)*  
   - **Authorized Redirect URLs:**  
     ```
     http://localhost:5173/
     ```
     *(Port may vary depending on your Vite app)*  
4. Click **Create**.  
5. The application will now be created successfully.  
6. Open the created application, go to the **Protocol** tab, copy the **Client ID**, and update `VITE_AUTH_CLIENT_ID` in your frontend `.env` file.

---

## 3. Create an Attribute
1. Navigate to **User Attributes & Stores** → **Attributes**.  
2. Under **Manage Attributes**, click **New Attribute**.  
3. Fill in the details:  
   - **Attribute Name:** `db_id`  
   - **Attribute Display Name:** `db_id`  
4. Click **Finish**.  

---

## 4. Create an OIDC Scope for the Attribute
1. Go to **User Attributes & Stores** → **Attributes**.  
2. Under **Manage Attribute Mappings**, select **OpenID Connect**.  
3. Click on **Scopes** (right side of the search bar).  
4. Click **New OIDC Scope** and enter:  
   - **Scope:** `db_id`  
   - **Display Name:** `db_id`  
5. Click **Next**.  
6. In the attribute list, select the previously created `db_id` attribute.  
7. Click **Finish**.  

---

## 5. Add the Scope to the Application
1. Navigate to **Applications** and select the created application.  
2. Go to the **User Attributes** tab.  
3. Tick the checkboxes for:  
   - `db_id`  
   - `groups`  
4. Scroll down and click **Update**.  

---

## 6. Create a User Store
1. Navigate to **User Attributes & Stores** → **User Stores**.  
2. Click **New User Store** and select **Database** as the **User Store Type**.  
3. Execute <IS_HOME>/dbscripts/mysql.sql against the created database to create the database tables:

```bash
mysql -u root -p`root_password` insurance < path/to/<IS_HOME>/dbscripts/mysql.sql
```

4. Enter the following details:  
   - **Name:** `insurance`  
   - **Connection URL:**  
     ```
       jdbc:mysql://localhost:3306/insurance?useSSL=false&allowPublicKeyRetrieval=true
     ```
   - **Connection Name:** `root`  
   - **Connection Password:** `root_password`  
   - **Driver Name:** `com.mysql.cj.jdbc.Driver`  

---

## 7. Create Groups
1. Navigate to **User Management** → **Groups**.  
2. Select the **insurance** user store from the top-right dropdown (instead of `PRIMARY`).  
3. Click **Add Group**.  
4. Create the following groups (click **Finish** after each one):  
   - `Customers`  
   - `Employees`  
   - `admins`  

---

## 8. Create Users
> **Note:** Since this is an insurance domain portal, self-registration is **not** allowed. All users must be created manually with passwords.

1. Navigate to **User Management** → **Users**.  
2. Select the **insurance** user store from the top-right dropdown (instead of `PRIMARY`).  
3. Click **Add User** → **Single User**.  
4. Fill in the details:  
   - **Username:** *(use from database)*  
   - **db_id:** *(as per database records — refer to part 9)*  
   - **Password:** *(set manually or generate)*  
5. Click **Next** and assign the user to one of the groups according to their roles:  
   - `Customers`  
   - `Employees`  
   - `admins`  
6. Click **Save and Continue**.  

---

## 9. User Data from Database
Based on the existing MySQL script:

**Employees**
| Name       |   db_id   |
|------------|-----------|
| Alice      | E_000001  |
| Bob        | E_000002  |
| Carol      | E_000003  |
| Divya      | E_000004  |
| Eve        | E_000005  |

**Customers**
| Name   |   db_id   |
|--------|-----------|
| David  | C_000001  |
| Emily  | C_000002  |
| Frank  | C_000003  |
| Grace  | C_000004  |
| Harry  | C_000005  |

---

✅ **You have now completed the WSO2 Identity Server configuration for your project.**




## Service Ports

- WSO2 API Manager (Publisher Portal): http://localhost:9443/publisher
- WSO2 Micro Integrator: http://localhost:8090
- WSO2 Identity Server : http://localhost:9445/console

## UI Access and Testing

Once the frontend is running, open your browser and go to: http://localhost:5173/

Note: Verify the port after running `npm run dev`, as it might vary.

You will see a login screen with access to 3 portals.

## Portal Access and Credentials

Once the frontend is running, open your browser and navigate to:  
**http://localhost:5173/**  

You will see a login screen with access to three portals.  

For each user created in the Identity Server, you have a **username** and **password**. Using these credentials, you can log in and navigate to the corresponding role-specific UI, which will display the relevant details for that user.  

If you are logging in as **Insurance admin**, you can use the default admin credentials:
- **Username:** `admin`
- **Password:** `admin`

Use the appropriate credentials to access each portal based on the user's role.

## Troubleshooting

### Address Verification API Not Working

If you encounter errors in the MI logs similar to:
```
[202x-0x-xx 0x:xx:xx,xxx]  INFO {LogMediator} - {api:AddressVerificationAPI} message = Address verification request received
[202x-0x-xx 0x:xx:xx,xxx] ERROR {JsonStreamBuilder} - Error occurred while processing document for application/json java.lang.reflect.InvocationTargetException
```

This is typically caused by the response from the external endpoint being encoded with "brotli" compression, which the MI JSON parser cannot handle.

**Solution Option 1: Remove Header from APIM (Recommended)**

1. Go to WSO2 API Manager Publisher Portal
2. Edit the AddressVerificationAPI
3. Click on the "Policies" tab
4. Add a new "Remove Header" policy
5. Set the "Header name" to `Accept-Encoding`
6. Save and deploy

This prevents the external service from sending brotli-compressed responses.

**Solution Option 2: Force GZIP Encoding from MI Side**

1. Navigate to the AddressVerificationAPI integration project
2. Edit the API sequence file
3. Add the following header configuration to the request path:
   ```xml
   <header name="Accept-Encoding" value="gzip" scope="transport"/>
   ```
4. Export the .CAR file and redeploy

This forces the external service to use gzip compression instead of brotli.

### CORS Issues Appearing as Network Error

If you see CORS-related network errors in the browser console:

1. Copy the gateway link: `https://localhost:8243`
2. Paste it in a new browser tab and accept any SSL certificate warnings
3. Return to the application frontend at `http://localhost:5173/`
4. Refresh the page

