# Insurance Project - Local Deployment Guide

## Overview

This project is an insurance management system with separate portals for administrators, employees, and customers. The system uses a React frontend, WSO2 Micro Integrator for backend services, and WSO2 API Manager for API management.

## Prerequisites

- Node.js and npm
- MySQL database
- Visual Studio Code
- WSO2 Micro Integrator 4.4.0 or above
- WSO2 API Manager 4.5 or above
- Ballerina 2201.13.4

## Frontend Setup

1. Navigate to the `local-deployment` folder
2. Go to the `frontend` directory
3. Open the folder in Visual Studio Code
4. Create a `.env` file in the `Frontend` directory by copying from `.env.example` template 
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

1. Navigate to `InsuranceDemoV3/local-deployment/Backend-integrationProjects`
2. Open each integration project in Visual Studio Code (excluding AddressVerification)
3. Open the MI Extension panel and locate the Data Service section
4. Update the database connection properties in each data service and the SMTP connection configurations in the integration projects.
   (All configurations have been externalized following [MI standards](https://mi.docs.wso2.com/en/latest/develop/externalized-configuration/#data-service-parameters). To update the connection properties, create a `.env` file using the `.env.example` and  update the configurations with actual values.)
5. Export the .CAR files using the MI Extension
6. Copy the exported .CAR files into the downloaded MI server `wso2mi-4.4.0\repository\deployment\server\carbonapps` folder

#### JDBC Connector Setup

1. Download MySQL Connector version 9.2.0
2. Paste the .jar file into the 'wso2mi-4.4.0\lib' directory of your downloaded WSO2 Micro Integrator server

#### Configure Email Notifications and Database connection properties

The project uses externalized configuration for sensitive data like email credentials. 

**Step 1: Declare Configuration Parameters**

The parameters are declared in: `Backend-integrationProjects/<opened_integration_project>/src/main/wso2mi/resources/conf/config.properties`

```
email_from:string
email_smtp_host:string
email_smtp_username:string
driver_className:string
url:string
username:string
password:string
```

**Step 2: Create .env File**

Create a `.env` file in the `Backend-integrationProjects/missedCallsHandler/` directory (or copy from `.env.example`):

```bash
cd Backend-integrationProjects/missedCallsHandler
cp .env.example .env
```

Edit the `.env` file with your actual email configuration:

```
email_from="your-email@gmail.com"
email_smtp_host="smtp-host"
email_smtp_username="your-email@gmail.com"
driver_className="driver-class-name"
url="database-url"
username="database-username"
password="database-password"
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
email_smtp_password = "[generated app password]"
```

Replace `[generated app password]` with the actual app-specific password generated for the email account.

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
sh micro-integrator.sh --env-file=/path/to/Backend-integrationProjects/missedCallsHandler/.env
```

**Windows:**
```bash
micro-integrator.bat --env-file=C:\path\to\Backend-integrationProjects\missedCallsHandler\.env
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

Note: This setup uses WSO2 MI version 4.5

## Ballerina Chatbot

This project includes a `Insurance AI Chatbot` that integrates with Mistral AI and provides a conversational assistant. The chatbot can invoke backend MCP tools and is implemented using Ballerina.

- **Requirements:**
   - Ballerina CLI (`bal`) installed on your machine.
   - A Mistral AI API key. Generate or view your API keys at: [Mistral Portal](https://console.mistral.ai/home?profile_dialog=api-keys).

- **Configuration:**
   - The chatbot project is located at: `InsuranceDemoV3/local-deployment/Backend-integrationProjects/chatbot`.
   - Provide the Mistral API key by editing `Config.toml` in the chatbot project and setting the `[insurancedemo.chatbot] mistralAikey` value, or use Ballerina's configurable parameters. Example `Config.toml` snippet:

```toml
[insurancedemo.chatbot]
mistralAikey = "<YOUR_MISTRAL_API_KEY>"
mistralBaseUrl = "https://api.mistral.ai"
```

- **Run the chatbot service:**

```bash
# from the repository root
cd InsuranceDemoV3/local-deployment/Backend-integrationProjects/chatbot
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
2. Import all (11) APIs using the "Import by OpenAPI" option under REST API in the WSO2 Publisher Portal
3. Import each .yaml (Swagger/OpenAPI) file one by one to create the APIs

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
6. Configure the request flow for ClaimsAPI and PoliciesAPI to include a remove-header policy that strips the `Content-Type`(value) header.

**Note**: Exclude the following APIs from this step as they handle responses differently:
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

### Configure MissedCallsAPI

After importing the APIs, configure the MissedCallsAPI to generate an API Key:

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

## Service Ports

- WSO2 API Manager (Publisher Portal): http://localhost:9443/publisher
- WSO2 Micro Integrator: http://localhost:8090

## UI Access and Testing

Once the frontend is running, open your browser and go to: http://localhost:5173/

Note: Verify the port after running `npm run dev`, as it might vary.

You will see a login screen with access to 3 portals.

## Portals and Credentials

### Admin Portal

- Username: admin@abc.com
- Password: admin123

### Employee Portal

- Username: employee@abc.com
- Password: employee123

### Customer Portal

- Username: customer@abc.com
- Password: customer123

## User Roles and Capabilities

### Admin

- Manage users (customers and employees)
- Create and manage policies/products
- Review and process insurance claims
- Access analytics and dashboards

### Employee

- View assigned customers and their policies
- Assist with claim processing
- Update customer information

### Customer

- View and purchase insurance policies
- File and track claims
- Update personal information

## Getting Started

1. Complete the database setup
2. Set up and start WSO2 Micro Integrator **with the `.env` file flag** (see MI Setup section)
3. Set up and start WSO2 API Manager
4. Import and configure all APIs
5. Create and configure the `.env` file in the Frontend directory
6. Start the frontend application
7. Access the appropriate portal using the provided credentials

**Note:** Ensure WSO2 MI is running with the `--env-file` flag before trying to send emails through the system, otherwise email notifications will fail.

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
4. Drag and drop a new "Remove Header" policy to request flow
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

