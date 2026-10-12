## NOTE: InsuranceDemoV4 is the latest version, combining the backend, frontend, and identity layer into a fully functional end-to-end demo application that covers the use cases listed below.

#### You can follow the simple guide to get it up and running within a few minutes by using docker-deployment folder.Follow(README)

This demo includes WSO2 APIM 4.6.0, MI 4.5.0, and IS 7.2.0.

#### You can view and modify the requirements as needed. If you do so, please use the local-deployment folder. Follow(README)

### What's new in V4

V4 adds WSO2 Identity Server as the authentication layer for the customer, employee, and admin portals, and introduces a set of pre-login, self-service flows for prospective and existing customers, plus an AI-powered support chatbot. See the new use case sections below (Prospective Customer Use Cases, PF-UC1 in Platform-Wide Use Cases, and the added CP-UC4 renewal use case).

# Insurance Domain Demo Use Cases

This document outlines the key user stories (use cases) for the Customer, Employee, and Admin portals of the Insurance Demo platform. Each use case is presented in the “As a [role], I want [capability], so that [benefit]” format.

---

## Prospective Customer Use Cases (New in V4)

These use cases require no login — they're aimed at a prospective customer evaluating and purchasing a policy for the first time.

### PC-UC1: Get an Instant Quote  
**User Story:**  
> As a **prospective customer**, I want to enter basic details about myself and the coverage I need and instantly see a premium estimate for my chosen payment frequency, so that I can decide if a policy is right for me before creating an account.

---

### PC-UC2: Buy a Policy from My Quote  
**User Story:**  
> As a **prospective customer**, I want to take a quote I've generated and complete my purchase — with my address verified automatically and my card details validated on the spot — so that I can become a covered policyholder without friction.

---

### PC-UC3: Pay a Policy Premium  
**User Story:**  
> As a **customer**, I want to look up one of my policies and pay its premium directly through the portal, so that I can keep my policy active without needing to call or visit in person.

---

## Platform-Wide Use Cases

### PF-UC1: Get Help from the AI Chatbot (New in V4)  
**User Story:**  
> As a **customer**, I want to ask a conversational assistant about my policies and claims and get accurate, concise answers grounded in my real data, so that I can get quick answers without waiting for a human agent.

---

## Customer Portal Use Cases

### CP-UC1: Manage My Claims  
**User Story:**  
> As a **customer**, I want to view all my submitted claims, file a new claim via a guided form which includes (Special Address verification process), and track each claim’s status and history so that I always know where my requests stand.

---

### CP-UC2: Browse My Policies  
**User Story:**  
> As a **customer**, I want to see all my active insurance policies, view detailed coverage information so that I can make informed decisions and stay covered.

---

### CP-UC3: Update My Profile  
**User Story:**  
> As a **customer**, I want to view and edit my personal details so that my insurer always has the correct information.

---

### CP-UC4: Renew My Policy (New in V4)  
**User Story:**  
> As a **customer**, I want to be notified by email when my policy is approaching its end date, and renew it in a few clicks from that notification, so that my coverage never lapses.

---

### CP-UC5: Handle Missed Call Customer Inquiry (New in V3)  
**User Story:**  
> As a **customer**, I want to use a missed call service with my registered mobile number to receive policy and recent payment details by email, so that I can quickly access important insurance information without logging into the portal.(Using email)

---

### CP-UC6: Instant Statements (New in V4)  
**User Story:**  
> As a **customer**, I want my policy document by email right after purchase/renewal, so that I have proof of cover immediately.

---

## Employee Portal Use Cases

### EP-UC1: View My Workload  
**User Story:**  
> As an **insurance processor**, I want to see at a glance how many claims, customers, and policies are assigned to me so that I can prioritize my day.

---

### EP-UC2: Process a Claim  
**User Story:**  
> As an **insurance processor**, I want to open any assigned claim, update its status, and add notes so that I can keep the case moving and maintain a clear audit trail.

---

### EP-UC3: Support a Customer  
**User Story:**  
> As an **insurance processor**, I want to view any of my assigned customers’ profiles—including their active policies and past claims—so that I can answer questions accurately on the first call.

---

### EP-UC4: Browse Products & Policies  
**User Story:**  
> As an **insurance processor**, I want to look up all available products and policy details so that I can recommend the right options to customers.

---

### EP-UC5: Manage My Profile  
**User Story:**  
> As an **employee**, I want to update my own contact information and preferences so that my team and customers always have my correct details.

---

## Admin Portal Use Cases

### AP-UC1: View Business Metrics  
**User Story:**  
> As an **administrator**, I want a dashboard showing total claims, open policies, and active users so that I can monitor overall system.

---

### AP-UC2: Approve or Reject Claims  
**User Story:**  
> As an **administrator**, I want to review submitted claims, change their status (Under Review, Payment Processing, Approved, Closed, or Rejected), and record my decision so that high-value or exception cases get fast oversight.

---

### AP-UC3: Onboard or Offboard Customers  
**User Story:**  
> As an **administrator**, I want to add or remove customer records and assign initial policies so that our system data stays accurate and up to date.

---

### AP-UC4: Manage Employees  
**User Story:**  
> As an **administrator**, I want to add new employees, update roles or contact info, and remove departed staff so that access and responsibilities remain appropriately controlled.

---

### AP-UC5: Configure Policies & Products  
**User Story:**  
> As an **administrator**, I want to create, update, or retire insurance products and their associated policy details so that our offerings stay competitive and compliant.
