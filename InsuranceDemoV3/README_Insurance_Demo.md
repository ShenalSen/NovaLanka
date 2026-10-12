# Insurance Demo - Documentation

## Project Overview

This is a modern insurance management project built using WSO2 Micro Integrator and WSO2 API Manager. The UI is developed with React, TypeScript, and Vite. It supports multiple user roles (Admin, Employee, Customer) and provides a real-time, interactive interface for managing insurance policies, claims, customers, and employees.

![alt text](diagram-1.png)

## System Requirements

- Node.js (v18+)
- npm - 10.9.2 or any
- JDK 21
- MySQL Server
- Docker (Rancher Desktop - (1.19.3) / Colima or any)

## Required Tools

- WSO2 Micro Integrator - 4.4.0
- WSO2 API Manager - 4.5.0
- MySQL Workbench - 8.0
- Postman or cURL
- Visual Studio Code or any IDE

## Customer Portal — Functionalities

The Customer portal empowers users to manage their own insurance needs. A customer user can:

**Manage claims:**  
Customers can view a list of all their claims, file new claims easily using a guided form, and track the status and history of each claim as it is processed.

**Stay on top of policies:**  
Customers can browse all their insurance policies, see the details of each, and understand their coverage.

**Keep information up to date:**  
Customers can view and edit their personal profile, ensuring contact and address information is always current.

## Employee Portal — Functionalities

The Employee portal is designed for staff who manage customers and process claims. An employee user can:

**See workload at a glance:**  
The dashboard shows assigned claims, customers, and policies, helping employees prioritize their work.

**Process claims efficiently:**  
Employees can view all claims assigned to them, open each claim to see details, update statuses, and add notes throughout the claim process.

**Support customers:**  
Employees can see a list of customers assigned to them, view customer profiles, and understand their policies and claim history. This enables better service and informed responses to customer inquiries.

**Stay informed about products and policies:**  
Employees can browse available insurance products and policies relevant to their customers, making it easier to provide recommendations and stay updated.

**Manage their own profile:**  
Employees can view and update their own profile information to keep contact details current.

## Admin Portal — Functionalities

The Admin portal provides full control over the insurance platform. An admin user can:

**Monitor the business:**  
The dashboard displays real-time metrics about claims, policies, and users, allowing quick assessment of the platform's health.

**Manage claims:**  
Admins can access claim details, approve or reject (change the current status) claims, and assign them to employees for processing.

**Oversee customers:**  
Admins can browse a list of all customers, view their details, and see associated policies and claims. They can add new customers, their information, or remove them if needed.

**Oversee employees:**  
Admins can view all employees, add new ones, update their details, and remove them if necessary.

**Manage policies and products:**  
Admins can create, edit, and delete insurance policies and products. They can assign policies to customers and analyze which products are most popular.

---

## Backend Overview

The backend for this project is a RESTful Data service from Micro Integrator that powers all business logic and data storage for the Insurance Demo platform. It is responsible for securely handling requests from the frontend, managing customers, policies, claims, and more.

### Key Technologies & Architecture:

- Built with RESTful DataService through WSO2 MI and API Manager
- Data stored in a relational database (MySQL)
- CORS enabled for frontend-backend communication through WSO2 APIM

### Integration with Frontend:

- The frontend communicates with the backend exclusively via HTTPS REST API calls
- All business operations (CRUD for claims, policies, users, etc.) are performed through these endpoints
- Email notifications and address validation are triggered by backend endpoints which are through WSO2 Micro Integrator.

## Quick Start

## Prerequisites

I used Rancher Desktop (1.19.3). You can use any.

But ensure Docker is running on your machine before proceeding.

## Deployment Steps

### 1. Clone the Repository and Navigate to Docker Deployment Directory

Open a terminal or command prompt and run:

```bash
git clone <your-repo-url>
cd docker-deployment
```

Replace 'your-repo-url' with the Git repository URL of the InsuranceDemoV2 branch.

### 2. Build the Docker Image

Run the following command from the `docker-deployment` directory to build the Docker image:

```bash
docker build -t insurance-img .
```

### 3. Run the Docker Container

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
- This folder contains 7 Swagger files that define the APIs

#### 4. Import Each Swagger File

For each of the 7 Swagger files:

- Click "Browse File" or drag & drop the file
- Fill in any additional required fields (e.g., version, context, endpoint, etc.)
- Click "Create" to finish the import

#### 5. Configure JSON Responses

After importing each API:

- Click on the "policies" tab within each API
- Select XML to JSON mediator under Policy List -> Request -> Common policies
- Drag and drop on response flow
- Select and Apply to all resources option and save it
- At the bottom of the page, click "save and deploy"
- Select default gateway and deploy it
- Repeat this process for all 7 APIs

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

## Recordings
[https://drive.google.com/file/d/1VLFQFXyw-7mlkQkx1_Rae0VF9rUJhLJg/view?usp=drive_link](https://drive.google.com/file/d/1VLFQFXyw-7mlkQkx1_Rae0VF9rUJhLJg/view?usp=drive_link)
