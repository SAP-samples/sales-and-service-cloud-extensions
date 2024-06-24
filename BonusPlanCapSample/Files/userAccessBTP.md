# Add user authorization 
Authorization is implemented in this application. As explained in reference scenario, we have 2 roles/personas- Admin and Employee.For Admin users, role collection -**read_write_bplan_rolecollection** needs to be assigned.
If this role is not assigned, user is treated as employee means user has employee persona.

Follow following steps to add user to the role collection 
* Go to BTP and navigate to subaccount
* Open Security and then Role Collections
* Search and open "read_write_bplan_rolecollection" Role collection. This role should be there after deployment of application, as its created via code.  

    ![cookie and xframe ](../Images/auth-in-btp.png "cookie and xframe")

* Click on Edit button and add user in users section and save it.

**Note:** Above step is enough to provide user authorizations. If you want to understand more on how to create Role Collection follow [Here](./authorization.md#create-scopes-roles-and-role-collections-for-the-application)
