# Deployment in WSO2 Identity Server

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
3. Enter the following details:  
   - **Name:** `insurance`  
   - **Connection URL:**  
     ```
     jdbc:mysql://localhost:3306/insurance
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
   - `Customer`  
   - `Employee`  
   - `admin`  

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
   - `Customer`  
   - `Employee`  
   - `admin`  
6. Click **Save and Continue**.  

---

## 9. User Data from Database
Based on the existing MySQL script:

### Employees
| Name       | db_id  |
|------------|--------|
| Alice      | E_001  |
| Bob        | E_002  |
| Carol      | E_003  |
| Divya      | E_004  |
| Eve        | E_005  |

### Customers
| Name   | db_id  |
|--------|--------|
| David  | C_001  |
| Divya  | C_002  |
| Frank  | C_003  |
| Grace  | C_004  |
| Harry  | C_005  |

---

✅ **You have now completed the WSO2 Identity Server configuration for your project.**
