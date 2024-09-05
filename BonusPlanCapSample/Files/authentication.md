# Implement Authentication
To implement authentication we need to have 
* valid user in SAP Sales and service cloud and in BTP.
* XSUAA based service from BTP is used for authentication.

Please refer below section for details on above mentioned points:

## Create Business Users and Assign Business Role – Sales and Service Cloud 

### Prerequisites
You need to have administration rights in this Sales and Service cloud tenant.

### Procedure
1.	Log in to the system as an administrator.
2.	Navigate to user profile on the right-top corner and access the Settings page.
3.	Go to All Settings > Users and Control > Users.
    ![setting users](../Images/auth/setting-users.png "setting users")
4.	Choose Business Users from the dropdown on the page.
5.	Click the add icon (+) on the Business Users page.
    ![create-business-user-1](../Images/auth/create-business-user-1.png "create-business-user-1")
6.	Search and select an employee for whom you wish to create the business user.
7.	Once you select an employee, the User Data section is auto-populated. By default, the user ID is created with the last name followed by the first name of the employee. If you wish to modify the user ID details, you can modify them.
8.	Once you've verified all the details, click Create. The business user is now created and linked to the employee. Refresh the business users' list to view your newly created business user.
    ![create-business-user-2](../Images/auth/create-business-user-2.png "create-business-user-2")
9.	Choose your business user, and then navigate to the Assigned Business Roles tab.
10.	Add business roles to your user by using the Search and Add functionality on the screen. All the business roles that you assigned to your business user now appear in the list format on the Assigned Business Roles tab.
You've now created a business user and assigned the user to a business role.


## Create Users – SAP BTP 
As an administrator, you can create users in your subaccount.

### Prerequisites
* You need to have administration rights in this subaccount.
* You must know which identity provider stores the user.

### Procedure 
1.	Open the SAP BTP cockpit.
2.	Go to your global account and/or subaccount 
3.	Choose Security > Users.
    ![btp-user-create](../Images/auth/btp-user-create.png "btp-user-create")
4.	Choose Create.
The SAP BTP cockpit displays a new row where you can enter the user data.
5.	Enter the user ID and e-mail address.
6.	Choose the identity provider where the user is stored. The dropdown list displays the identity providers configured in the trust configuration of your subaccount.
7.	Save your changes. User is now been created in SAP BTP.

## Adding Authentication
In this step we are going to add authentication in our application and run and check it from local environment.

* We have used XSUAA based authentication here
* Follow this link to setup router and xsuaa
https://cap.cloud.sap/docs/node.js/authentication#authentication-enforced-in-production

* Create xsuaa service in BTP and bind to local environment for Hybrid profile following same doc

* To run the applicaiton locally now with xsuaa, need to run 2 command.
    * cds watch --profile hybrid
    * cds bind --exec -- npm start --prefix app/router

**Note:** Hybrid profile is used to connect to BTP services from local environment.