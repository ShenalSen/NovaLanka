# Docker Deployment Guide

## Prerequisites
*  Rancher Desktop (tested on 1.19.3)
*  Ensure that Docker is installed and running on your machine.

## Deployment Steps

### 1. Navigate to Docker Deployment Directory

Open a terminal or command prompt and navigate to the `docker-deployment` directory in your project.

### 2. Create `.env` File from Template

Since the `.env` file is in `.gitignore` and not pushed to the repository, you need to create it locally:

```bash
# Navigate to the Frontend directory
cd Frontend

# Copy the .env.example to create .env
cp .env.example .env
```

**Note**: The `.env` file contains the API key for the MissedCalls API. Initially, it will have a placeholder value. You will update this with the actual API key after generating it from the DevPortal (see section 6.6).

### 3. Configure Email Notifications and Database connection properties

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

### 4. Build the Docker Image

Run the following command from the `docker-deployment` directory to build the Docker image:

```bash
docker build -t insurance-img .
```

### 5. Run the Docker Container

Once the image is built, start the container using:

```bash
docker run -it --rm -p 9090:9090 -p 9091:9091 -p 9092:9092 -p 9093:9093 -p 9094:9094 -p 9095:9095 -p 9096:9096 -p 8090:8090 -p 8253:8253 -p 8254:8254 -p 8290:8290 -p 9164:9164 -p 3307:3306 -p 9446:9446 -p 8246:8246 -p 8283:8283 -p 1025:1025 -p 8025:8025 -p 5173:5173 insurance-img
```

**Note: Port Offset Configuration**

A port offset of 3 has been applied to avoid conflicts. WSO2 API Manager will be accessible on port 9446 instead of the default 9443.

## API Configuration

### Import and Deploy Swagger Files via Publisher Portal

#### 1. Access the Publisher Portal

- Open your web browser and go to: https://localhost:9446/publisher
- Log in with your Publisher credentials:
  - **Username: admin**
  - **Password: admin**

#### 2. Navigate to the API Import Section

- On the dashboard, click "REST API"
- Select "Import OpenAPI" to begin importing Swagger files

#### 3. Locate Swagger Files

- Browse to the `docker-deployment\Api-definitions` folder
- This folder contains 11 Swagger files that define the APIs

#### 4. Import Each Swagger File

For each of the 11 Swagger files:

- Click "Browse File" or drag & drop the file
- Fill in any additional required fields (e.g., version, context, endpoint, etc.)
- Click "Create" to finish the import

#### 5. Configure JSON Responses

After importing each API, configure the response mediator for the following APIs:
- EmployeesAPI
- PoliciesAPI
- ProductsAPI
- CustomersAPI
- ClaimsAPI
- EmailAPI
- AddressVerificationAPI

For the APIs listed above:

- Click on the "policies" tab within each API
- Select XML to JSON mediator under Policy List -> Request -> Common policies
- Drag and drop on response flow under the OPERATION LEVEL POLICIES tab
- Select and Apply to all resources option and save it
- At the bottom of the page, click "save and deploy"
- Select default gateway and deploy it
- Repeat this process for all 7 APIs
- Configure the request flow for ClaimsAPI and PoliciesAPI to include a remove-header policy that strips the `Content-Type`(value) header.

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

#### 6. Configure MissedCalls API

After importing all APIs, configure the MissedCalls API to generate an API Key:

##### 6.1 Enable API Key Security

1. Go to WSO2 API Manager Publisher Portal: `https://localhost:9446/publisher`
2. Navigate to **APIs** and select **MissedCallsAPI**
3. Go to **API Configurations** tab
4. Click on the **Runtime** section
5. Under **Application level security**, tick the **"Api Key"** checkbox
6. Click **Save and Deploy**

##### 6.2 Publish the API

1. Switch to the **Publish** tab
2. Go to **Lifecycle**
3. Click **Publish** to publish the API

##### 6.3 Create an Application in DevPortal

1. Switch to **DevPortal**
2. Navigate to **Applications**
3. Click **ADD NEW APPLICATION**
4. Enter Application name: `Insurance App`
5. Click **Create**

##### 6.4 Subscribe to the API

1. Go to **Subscriptions**
2. Click **Subscribe** for the MissedCallsAPI
3. Select the `Insurance App` application
4. Complete the subscription

##### 6.5 Generate API Key

1. Go to the **API Keys** tab
2. Under **Key restrictions**, switch from default selection to **HTTP Referrers (Web Sites)**
3. In the **Referer** field, add: `http://localhost:5173/*`
4. Click **GENERATE KEY**
5. In the pop-up dialog, deselect the API Key with infinite validity period checkbox and specify the required validity period.
6. Copy the generated API Key

##### 6.6 Update Environment Variable in Running Container

1. Get the running container ID:
   ```bash
   docker ps
   ```

2. Update the `.env` file inside the container with the generated API key:
   ```bash
   docker exec -it <container_id> /bin/bash -c "sed -i 's|^VITE_MISSED_CALL_API_KEY.*|VITE_MISSED_CALL_API_KEY=<your_generated_api_key>|' /home/wso2/app/.env"
   ```

3. Verify the change:
   ```bash
   docker exec -it <container_id> grep "VITE_MISSED_CALL_API_KEY" /home/wso2/app/.env
   ```

4. The frontend will automatically detect the change or you can manually refresh your browser at http://localhost:5173

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

## Testing the Application

### UI Access

Open your browser and go to: http://localhost:5173

### Postman Testing

Use the endpoints provided in the `docker-deployment\PostmanCollection` to interact with the backend services.

## Portal Access and Credentials

Once the frontend is running, open your browser and go to: http://localhost:5173/

You will see a login screen with access to 3 portals:

### 1. Admin Portal

- **Username: admin@abc.com**
- **Password: admin123**

### 2. Employee Portal

- **Username: employee@abc.com**
- **Password: employee123**

### 3. Customer Portal

- **Username: customer@abc.com**
- **Password: customer123**

Use the appropriate credentials to access each role-specific portal.

## Getting Started - Quick Setup Checklist

Follow these steps in order to get the entire system up and running:

1. Navigate to `docker-deployment` directory
2. Create `.env` file from `.env.example` template in `Frontend` folder
3. **Configure email credentials** in `Backend-integrationProjects/missedCallsHandler/.env` (optional but recommended for email notifications)
4. Build the Docker image: `docker build -t insurance-img .`
5. Run the Docker container with port mappings
6. Wait for all services to start (2-3 minutes)
7. Access APIM Publisher at `https://localhost:9446/publisher`
8. Import all 10 Swagger files from `Api-definitions` folder
9. Configure JSON responses for the 7 core APIs (excluding MissedCallsAPI, PolicyValidatorAPI, SyncControllerAPI)
10. Configure MissedCalls API security and generate API Key
11. Update `.env` file in running container with generated API Key using docker exec command
12. **Configure MCP Servers in APIM** (ClaimsMCP and PoliciesMCP with their tools)
13. **Verify MCP APIs are deployed and active**
14. **Start the chatbot** using: `docker exec -it <container-id> sh /home/wso2/chatbot.sh`
15. Access frontend at `http://localhost:5173`
16. Log in with test credentials

## Troubleshooting

### Address Verification API Not Working

If you encounter errors in the MI logs similar to:
```
[202x-0x-xx 0x:xx:xx,xxx]  INFO {LogMediator} - {api:AddressVerificationAPI} message = Address verification request received
[202x-0x-xx 0x:xx:xx,xxx] ERROR {JsonStreamBuilder} - Error occurred while processing document for application/json java.lang.reflect.InvocationTargetException
```

This is typically caused by the response from the external endpoint being encoded with "brotli" compression, which the MI JSON parser cannot handle.

**Solution Option 1: Remove Header from APIM (Recommended)**

1. Go to WSO2 API Manager Publisher Portal: `https://localhost:9446/publisher`
2. Edit the AddressVerificationAPI
3. Click on the "Policies" tab
4. Drag and drop a new "Remove Header" policy to request flow
5. Set the "Header name" to `Accept-Encoding`
6. Save and deploy

This prevents the external service from sending brotli-compressed responses.

**Solution Option 2: Force GZIP Encoding from MI Side**

1. Inside the running container, navigate to the AddressVerificationAPI integration project (in MI/carbonapps)
2. Edit the API sequence file
3. Add the following header configuration to the request path:
   ```xml
   <header name="Accept-Encoding" value="gzip" scope="transport"/>
   ```
4. Redeploy the carbon app

This forces the external service to use gzip compression instead of brotli.

### CORS Issues Appearing as Network Error

If you see CORS-related network errors in the browser console:

1. Copy the gateway link: `https://localhost:9446`
2. Paste it in a new browser tab and accept any SSL certificate warnings
3. Return to the application frontend at `http://localhost:5173/`
4. Refresh the page

This ensures your browser has established a proper SSL connection to the API Gateway, resolving CORS issues.

