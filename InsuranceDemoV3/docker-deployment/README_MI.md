
# Getting Started

### Database Setup

This project uses a Relational Database (RDBMS)—specifically, MySQL.

To set up the local database:

1. Navigate to the mysql-scripts folder in the project directory.
2. Run the provided SQL script to create the insurance database locally.

This script will automatically create the necessary tables and seed any required initial data.

## Deployment Options

### Option 1: Docker Deployment

#### 1. Start Your Docker Daemon
I used Rancher Desktop (1.19.3). You can use any.
But ensure Docker is running on your machine before proceeding.

#### 2. Navigate to the Docker Deployment Folder
Open a terminal or command prompt and go to the docker-deployment directory in your project.

#### 3. Build the Docker Image
Run the following command from the docker-deployment directory to build the Docker image:
```bash
docker build -f MI-Dockerfile -t insurance-img-mi .
```

#### 4. Run the Docker Container
Once the image is built, start the container using:
```bash
docker run -it --rm -p 8090:8090 -p 8253:8253 -p 8254:8254 -p 8290:8290 -p 9164:9164 -p 3307:3306 -p 9446:9446 insurance-img-mi
```

#### Testing with Postman
1. Navigate to the docker-deployment/postmanCollection/MI-endpoints folder.
2. Open Postman, create a new workspace, and import the provided .json collection file.
3. This collection includes pre-configured requests to test all MI endpoints used in this project.

### Option 2: WSO2 Micro Integrator (4.4.0) Data Services

### WSO2 Micro Integrator (MI) Setup

1. Download WSO2 Micro Integrator from: https://wso2.com/integrator/
2. After downloading:

#### Prepare the .CAR Files

Since most of our use cases on this project uses Data Services, it's important to configure and export them properly:

1. Navigate to local-deployment/Backend-integrationProjects.
2. Open each integration project in Visual Studio Code—excluding AddressVerification and SendEmail, as these are not data service-based.
3. Open the MI Extension panel and locate the Data Service section.
4. Update the database connection properties in each data service as shown below:

```xml
<property name="driverClassName">com.mysql.cj.jdbc.Driver</property>
<property name="url">jdbc:mysql://localhost:3306/insurance</property>
<property name="username">your_db_username</property>
<property name="password">your_db_password</property>
```

5. Export the .CAR files using the MI Extension.
6. Copy the exported .CAR files into the downloaded MI server wso2mi-4.4.0\\repository\\deployment\\server\\carbonapps folder. This step is crucial to ensure the Micro Integrator loads all necessary services during server startup.

3. Download the appropriate JDBC (MySQL) connector:
   - This project uses MySQL Connector version 9.2.0.
   - You can also find the .jar file in the repository also.
   - Paste the .jar file into the lib directory of your downloaded WSO2 Micro integrator server.

4. Start the Micro Integrator server by navigating to the bin folder on wso2-mi:
   - Linux/macOS: micro-integrator.sh
   - Windows: micro-integrator.bat

Note: This setup uses WSO2 MI version 4.4.

### Testing with Postman

1. Navigate to the local-deployment/postmanCollection/MI-endpoints folder.
2. Open Postman, create a new workspace, and import the provided .json collection file.
3. This collection includes pre-configured requests to test all MI endpoints used in this project.

## Base URL

http://localhost:8290

## API Documentation

This documentation covers all available endpoints for the Insurance Management System, including services for customers, employees, policies, products, claims, address verification, and email notifications.

### 1. Insurance Customers Service

#### Get All Customers
- Method: GET
- Endpoint: /services/InsuranceCustomersService/customers
- Description: Retrieves all customers in the system
- Headers:
  - Accept: application/json (optional)

#### Get Customer by ID
- Method: GET
- Endpoint: /services/InsuranceCustomersService/customer/{customer_id}
- Description: Retrieves a specific customer by their ID
- Path Parameters:
  - customer_id (string): The unique customer identifier (e.g., "C_002")
- Headers:
  - Accept: application/json (optional)

#### Create Customer
- Method: POST
- Endpoint: /services/InsuranceCustomersService/customer
- Description: Creates a new customer record
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "customer": {
        "first_name": "Nadeesha",
        "last_name": "Perera",
        "dob": "1992-05-12",
        "gender": "Female",
        "email": "nadeesha.perera@example.com",
        "phone": "0772223344",
        "address": "No. 45, Green Lane, Negombo",
        "status": "active"
    }
}
```

#### Update Customer
- Method: PUT
- Endpoint: /services/InsuranceCustomersService/customer/{customer_id}
- Description: Updates an existing customer record
- Path Parameters:
  - customer_id (string): The unique customer identifier
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "customer": {
        "customer_id": "C_002",
        "first_name": "Divya",
        "last_name": "Perera",
        "dob": "1992-05-12",
        "gender": "Female",
        "email": "divya.perera@example.com",
        "phone": "0772223344",
        "address": "No. 45, Green Lane, Negombo",
        "status": "inactive"
    }
}
```

#### Delete Customer
- Method: DELETE
- Endpoint: /services/InsuranceCustomersService/customer/{customer_id}
- Description: Deletes a customer record
- Path Parameters:
  - customer_id (string): The unique customer identifier

#### Get Total Customers Count
- Method: GET
- Endpoint: /services/InsuranceCustomersService/customers/count
- Description: Returns the total number of customers

#### Get Customer Details by Employee ID
- Method: GET
- Endpoint: /services/InsuranceCustomersService/customers/byemployee/{employee_id}
- Description: Retrieves customers managed by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier (e.g., "E_001")

### 2. Insurance Employees Service

#### Get All Employees
- Method: GET
- Endpoint: /services/InsuranceEmployeesService/employees
- Description: Retrieves all employees in the system
- Headers:
  - Accept: application/json (optional)

#### Get Employee by ID
- Method: GET
- Endpoint: /services/InsuranceEmployeesService/employee/{employee_id}
- Description: Retrieves a specific employee by their ID
- Path Parameters:
  - employee_id (string): The unique employee identifier (e.g., "E_001")
- Headers:
  - Accept: application/json (optional)

#### Create Employee
- Method: POST
- Endpoint: /services/InsuranceEmployeesService/employee
- Description: Creates a new employee record
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "employee": {
        "first_name": "John",
        "last_name": "Doe",
        "role": "Manager",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "address": "Galle"
    }
}
```

#### Update Employee
- Method: PUT
- Endpoint: /services/InsuranceEmployeesService/employee/{employee_id}
- Description: Updates an existing employee record
- Path Parameters:
  - employee_id (string): The unique employee identifier
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "employee": {
        "employee_id": "E_004",
        "first_name": "Divya",
        "last_name": "Doe",
        "role": "Manager",
        "email": "divya.doe@example.com",
        "phone": "1234567890",
        "address": "Galle"
    }
}
```

#### Delete Employee
- Method: DELETE
- Endpoint: /services/InsuranceEmployeesService/employee/{employee_id}
- Description: Deletes an employee record
- Path Parameters:
  - employee_id (string): The unique employee identifier

### 3. Insurance Products Service

#### Get All Products
- Method: GET
- Endpoint: /services/InsuranceProductsService/products
- Description: Retrieves all insurance products
- Headers:
  - Accept: application/json (optional)

#### Get Product by ID
- Method: GET
- Endpoint: /services/InsuranceProductsService/product/{product_id}
- Description: Retrieves a specific product by its ID
- Path Parameters:
  - product_id (string): The unique product identifier (e.g., "P_001")
- Headers:
  - Accept: application/json (optional)

#### Create Product
- Method: POST
- Endpoint: /services/InsuranceProductsService/product
- Description: Creates a new insurance product
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "Insert New Product": {
        "name": "Auto Insurance",
        "description": "Covers all vehicle-related damages including theft and accidents",
        "coverage_type": "Auto",
        "coverage_amount": 1000000.00,
        "deductible": 5000.00,
        "premium": "12000.00"
    }
}
```

#### Update Product
- Method: PUT
- Endpoint: /services/InsuranceProductsService/product/{product_id}
- Description: Updates an existing product
- Path Parameters:
  - product_id (string): The unique product identifier
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "Insert New Product": {
        "product_id": "P_003",
        "name": "Life Insurance",
        "description": "Covers all vehicle-related damages including theft and accidents",
        "coverage_type": "Auto",
        "coverage_amount": 1000000.00,
        "deductible": 5000.00,
        "premium": "12000.00"
    }
}
```

#### Delete Product
- Method: DELETE
- Endpoint: /services/InsuranceProductsService/product/{product_id}
- Description: Deletes a product
- Path Parameters:
  - product_id (string): The unique product identifier

### 4. Insurance Policies Service

#### Get All Policies
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policies
- Description: Retrieves all insurance policies
- Headers:
  - Accept: application/json (optional)

#### Get Policy by ID
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policy/{policy_id}
- Description: Retrieves a specific policy by its ID
- Path Parameters:
  - policy_id (string): The unique policy identifier (e.g., "POL_002")
- Headers:
  - Accept: application/json (optional)

#### Create Policy
- Method: POST
- Endpoint: /services/InsurancePoliciesService/policy
- Description: Creates a new insurance policy
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "Create a policy": {
        "customer_id": "C_002",
        "product_id": "P_001",
        "employee_id": "E_001",
        "start_date": "2025-04-28",
        "end_date": "2026-04-28",
        "status": "Active",
        "policy_details": "This is a sample insurance policy for testing purposes."
    }
}
```

#### Update Policy
- Method: PUT
- Endpoint: /services/InsurancePoliciesService/policy/{policy_id}
- Description: Updates an existing policy
- Path Parameters:
  - policy_id (string): The unique policy identifier
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "Update a policy": {
        "policy_id": "POL_007",
        "customer_id": "C_002",
        "product_id": "P_001",
        "employee_id": "E_001",
        "start_date": "2025-04-28",
        "end_date": "2026-04-28",
        "status": "Active",
        "policy_details": "Updated policy details"
    }
}
```

#### Delete Policy
- Method: DELETE
- Endpoint: /services/InsurancePoliciesService/policy/{policy_id}
- Description: Deletes a policy
- Path Parameters:
  - policy_id (string): The unique policy identifier

#### Get Policies by Customer ID
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policies/customer/{customer_id}
- Description: Retrieves all policies for a specific customer
- Path Parameters:
  - customer_id (string): The unique customer identifier
- Headers:
  - Accept: application/json (optional)

#### Get Total Policies Count
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policies/count
- Description: Returns the total number of policies
- Headers:
  - Accept: application/json (optional)

#### Get Policies by Employee ID
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policies/employee/{employee_id}
- Description: Retrieves all policies managed by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier

#### Get Total Policies Count by Employee ID
- Method: GET
- Endpoint: /services/InsurancePoliciesService/policies/count/employee/{employee_id}
- Description: Returns the total number of policies managed by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier

#### Get Customer Count by Employee ID
- Method: GET
- Endpoint: /services/InsurancePoliciesService/customers/count/employee/{employee_id}
- Description: Returns the number of customers managed by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier

### 5. Insurance Claims Service

#### Get All Claims
- Method: GET
- Endpoint: /claim-api/1.0/claims
- Description: Retrieves all insurance claims
- Headers:
  - Accept: application/json (optional)

#### Get Claim by ID
- Method: GET
- Endpoint: /claim-api/1.0/claim/{claim_id}
- Description: Retrieves a specific claim by its ID
- Path Parameters:
  - claim_id (string): The unique claim identifier (e.g., "CLM_001")
- Headers:
  - Accept: application/json (optional)

#### Create Claim
- Method: POST
- Endpoint: /claim-api/1.0/claim
- Description: Creates a new insurance claim
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "claim": {
        "first_name": "John",
        "last_name": "Perera",
        "email": "john.perera@example.com",
        "mobile_number": "0771234567",
        "address": "123, Flower Road, Colombo 07",
        "policy_id": "POL_001",
        "type_of_policy": "Health",
        "policy_value": 500000.00,
        "submitted_date": "2025-06-10",
        "incident_date": "2025-06-05",
        "employee_name": "Kavindu Silva",
        "current_status": "Submitted",
        "incident_details": "Hospitalized due to accident",
        "loss_damage_details": "Medical expenses for surgery",
        "note": "Urgent processing requested"
    }
}
```

#### Update Claim
- Method: PUT
- Endpoint: /claim-api/1.0/claim/{claim_id}
- Description: Updates an existing claim
- Path Parameters:
  - claim_id (string): The unique claim identifier
- Headers:
  - Content-Type: application/json
  - Accept: application/json (optional)
- Request Body:
```json
{
    "claim": {
        "claim_id": "CLM_002",
        "first_name": "Kiya",
        "last_name": "Perera",
        "email": "kiya.perera@example.com",
        "mobile_number": "0771234567",
        "address": "123, Flower Road, Colombo 07",
        "policy_id": "POL_001",
        "type_of_policy": "Health",
        "policy_value": 500000.00,
        "submitted_date": "2025-06-10",
        "incident_date": "2025-06-05",
        "employee_name": "Kavindu Silva",
        "current_status": "Under Review",
        "incident_details": "Hospitalized due to accident",
        "loss_damage_details": "Medical expenses for surgery",
        "note": "Urgent processing requested"
    }
}
```

#### Delete Claim
- Method: DELETE
- Endpoint: /claim-api/1.0/claim/{claim_id}
- Description: Deletes a claim
- Path Parameters:
  - claim_id (string): The unique claim identifier

#### Get Claims by Customer ID
- Method: GET
- Endpoint: /claim-api/1.0/claims/customer/{customer_id}
- Description: Retrieves all claims for a specific customer
- Path Parameters:
  - customer_id (string): The unique customer identifier

#### Get Total Claims Count
- Method: GET
- Endpoint: /claim-api/1.0/claims/count
- Description: Returns the total number of claims

#### Get Claims by Employee ID
- Method: GET
- Endpoint: /claim-api/1.0/claims/employee/{employee_id}
- Description: Retrieves all claims handled by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier

#### Get Total Claims Count by Employee ID
- Method: GET
- Endpoint: /claim-api/1.0/claims/count/employee/{employee_id}
- Description: Returns the total number of claims handled by a specific employee
- Path Parameters:
  - employee_id (string): The unique employee identifier

### 6. Address Verification Service

#### Verify Valid Address
- Method: POST
- Endpoint: /addressverification/address
- Description: Verifies if an address is valid
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "address": "1600 Pennsylvania Avenue, Washington DC"
}
```

#### Verify Invalid Address
- Method: POST
- Endpoint: /addressverification/address
- Description: Tests address verification with invalid address
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "address": "Faketown, XYZ"
}
```

### 7. Email Service

#### Send Claim Submission Email
- Method: POST
- Endpoint: /sendemail/send
- Description: Sends claim submission confirmation email
- Headers:
  - Content-Type: application/json
  - Accept: application/json
- Request Body:
```json
{
    "from": "insurancecompany413@gmail.com",
    "to": "customer@gmail.com",
    "subject": "Claim Submission Confirmation",
    "content": "<p>Dear Valued Customer,</p>\\n<p>Thank you for submitting your insurance claim. We have successfully received your claim and it is currently being reviewed by our processing team.</p>\\n<p><strong>Your claim reference number is:</strong> [CLAIM_ID]</p>\\n<p>Our team will assess the information provided and contact you if any additional details are required. You will receive an update regarding the status of your claim within the next few business days.</p>\\n<p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team at <a href=\\\"mailto:support@novalanka.lk\\\">support@novalanka.lk</a> or call us at +94 77 123 4567.</p>\\n<p>Thank you for choosing our insurance services.</p>\\n<p>Best regards,<br>Customer Service Team<br><strong>NOVA Lanka Pvt (Ltd)</strong><br>No. 123, Galle Road, Colombo 03, Sri Lanka</p>",
    "contentType": "text/html"
}
```

#### Send Claim Closed Email
- Method: POST
- Endpoint: /sendemail/send
- Description: Sends claim completion notification email
- Headers:
  - Content-Type: application/json
  - Accept: application/json
- Request Body:
```json
{
    "from": "insurancecompany413@gmail.com",
    "to": "customer@gmail.com",
    "subject": "Claim Completed – [DATE]",
    "content": "<p>Dear Valued Customer,</p>\\n\\n<p>We are writing to inform you that your insurance claim has been successfully processed and is now closed.</p>\\n\\n<p><strong>Claim Reference Number:</strong> [CLAIM_ID]</p>\\n<p><strong>Date of Completion:</strong> [DATE]</p>\\n\\n<p>If you have any questions regarding the claim decision or require any additional documentation, please feel free to contact our support team.</p>\\n\\n<p>You can reach us at <a href=\\\"mailto:support@novalanka.lk\\\">support@novalanka.lk</a> or call +94 77 123 4567 during our business hours.</p>\\n\\n<p>Thank you for trusting NOVA Lanka Pvt (Ltd) with your insurance needs.</p>\\n\\n<p>Best regards,<br>\\nCustomer Service Team<br>\\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\\nNo. 123, Galle Road, Colombo 03, Sri Lanka</p>",
    "contentType": "text/html"
}
```

#### Send Claim Declined Email
- Method: POST
- Endpoint: /sendemail/send
- Description: Sends claim declined notification email
- Headers:
  - Content-Type: application/json
  - Accept: application/json
- Request Body:
```json
{
    "from": "insurancecompany413@gmail.com",
    "to": "customer@gmail.com",
    "subject": "Claim Decision Notification – [DATE]",
    "content": "<p>Dear Valued Customer,</p>\\n\\n<p>We regret to inform you that after a thorough review, your insurance claim with the reference number <strong>[CLAIM_ID]</strong> has been declined.</p>\\n\\n<p>The decision was made based on the assessment of the provided information and in accordance with the terms and conditions of your policy.</p>\\n\\n<p>If you believe this decision was made in error or if you require further clarification, you are welcome to contact our support team. We are here to assist you and address any concerns you may have.</p>\\n\\n<p><strong>Contact us:</strong><br>\\nEmail: <a href=\\\"mailto:support@novalanka.lk\\\">support@novalanka.lk</a><br>\\nPhone: +94 77 123 4567</p>\\n\\n<p>We appreciate your understanding and thank you for trusting NOVA Lanka Pvt (Ltd).</p>\\n\\n<p>Best regards,<br>\\nClaims Department<br>\\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\\nNo. 123, Galle Road, Colombo 03, Sri Lanka</p>",
    "contentType": "text/html"
}
```

#### Send Policy Application Email
- Method: POST
- Endpoint: /sendemail/send
- Description: Sends policy application notification email to admin
- Headers:
  - Content-Type: application/json
- Request Body:
```json
{
    "from": "insurancecompany413@gmail.com",
    "to": "insurancecompany413@gmail.com",
    "subject": "Customer New Policy Application – [CUSTOMER_ID]",
    "content": "<p>Dear Admin,</p>\\n\\n<p>This is to inform you that the customer <strong>[CUSTOMER_NAME]</strong> (Customer ID: <strong>[CUSTOMER_ID]</strong>) has requested to apply for a new insurance policy.</p>\\n\\n<p>Please take the necessary actions to guide the customer through the policy application process and ensure all required documentation is collected.</p>\\n\\n<p><strong>Customer Details:</strong><br>\\nEmail: <a href=\\\"mailto:[CUSTOMER_EMAIL]\\\">[CUSTOMER_EMAIL]</a><br>\\nPhone: [CUSTOMER_PHONE]</p>\\n\\n<p>Best regards,<br>\\nCustomer Support Team<br>\\n<strong>NOVA Lanka Pvt (Ltd)</strong><br>\\nNo. 123, Galle Road, Colombo 03, Sri Lanka<br>\\nPhone: +94 77 123 4567</p>",
    "contentType": "text/html"
}
```

## Response Formats

All services typically return responses in JSON format. Common response structures include:

### Success Response
```json
{
    "status": "success",
    "data": { ... },
    "message": "Operation completed successfully"
}
```

### Error Response
```json
{
    "status": "error",
    "error_code": "ERR_001",
    "message": "Error description"
}
```

## Notes

1. All endpoints are configured to run on localhost:8290
2. Most GET endpoints accept an optional Accept: application/json header
3. POST and PUT endpoints require Content-Type: application/json header
4. Email templates support placeholder variables like [CLAIM_ID], [DATE], [CUSTOMER_NAME], etc.
5. The system supports HTML content in email bodies for rich formatting