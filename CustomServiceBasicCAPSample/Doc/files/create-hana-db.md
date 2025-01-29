# Create HANA database

## Create SAP HANA Cloud Tool subscription
- Go to your subaccount, click on service marketplace, search for "SAP Hana Cloud" and select that. 
- Click on "create" button on the selection page. 
![Service marketplace Hana ](./Images/create-hana-db/service-marketplace-hana.png)
- Select "Tool" subscription
![tool subscription](./Images/create-hana-db/tool-subscription.png)
- Complete the process as per flow. once done, the tool can be seen in "instances and subscripion" section
![tool added](./Images/create-hana-db/tool-added.png)

## Create SAP HANA Cloud Database
* Click on the link of the Tool
![tool link](./Images/create-hana-db/tool-link.png)
* This will open a new Hana dashboard. Login and authorize as prompted by the dashboard.
    ![authorize Hana](./images/create-hana-db/authorize.png "Hana")
* Next step to select a database type and click on "Next Step".
    ![Hana Db type](./images/create-hana-db/type-hana-database.png "Hana")
* In this step provide a "Instance Name" and set Administrator password.
    ![Hana instance Name and Admin password](./images/create-hana-db/instance-name-admin-pass.png "Hana")
* Click on Next and come to step "SAP HANA Database Advanced Settings". Here select "Allow all IP address" and add your trial account and space using "Add Mapping"
![Allow all Ip and Add Mapping](./images/create-hana-db/allow-ip-add-mapping.png )
* Click Next and "Review and Create"
* This will take some time to create the instance. After some time the database will be up and running. Running status will be shown as per below image
    ![Hana DB running](./images/create-hana-db/DB-running.png "Hana")