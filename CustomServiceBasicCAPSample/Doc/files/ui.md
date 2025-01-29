## Create Custom Service in SAP Sales and Service Cloud
Please follow the steps mentioned below to create custom service and generate UIs in SAP Sales and Service Cloud using this sample CAP service. <br>

 - Login with admin user in SAP Sales and Service Cloud and goto "Custom Services" settings.<br>
     ![customService](../Images/CSSettings.png)
 - Click on "+" to create new Custom Service. Just enter the Domain Path - Base url where service is deployed.
       ![customService](../Images/NewCS1.png)
 - Upload the metadata from previous step. Once uploaded UI will look like :
      ![customService](../Images/NewCS2.png)
 - Once service is created, next step is to create Ui App. For that, click on "Design App" from actions column in customer services OWL.
    ![customService](../Images/DA1.png)
 - From UiApp UI, click on "+" to create and select "custom ui" radio button as shown below. Give name - Project Order, which is Work center name. Select all the     patterns which are required for this usecase. Select the icon and click on save.
    ![customService](../Images/DA2.png)
  - Once App is created, enable navigation launchpoint switch from list.
    ![customService](../Images/DA3.png)
 - Once app is also created, assign the newly created service and app to the business role for user who need to see this project order UI.
    ![customService](../Images/BR1.png)
    ![customService](../Images/BR2.png)
 - Relogin with business user having service/app in previous step assigned.
 - Project Order Workcenter should be visible as shown below-
    
   ![customService](../Images/wc.png)

## UIs
 Once above mentioned steps are done, generated UIs can be launched from "Project Order" workcenter shown in image above.
- This is how object work list will look like
  ![customService](../Images/OWL.png)
  ID column can be hidden via adaptation mode as shown below 
  ![customService](../Images/IDHide.png)
- Create Project Order by launching Quick Create from + icon. 
  ![customService](../Images/qc.png)
- Once Project order is created, Quick view can be opened by clicking on project order name.
   ![customService](../Images/qv.png)
- Details Ui can be opened by click on "open details" icon. This is as per standard navigation paradigm.
   ![customService](../Images/openDetails.png)
   Details UI -
   ![customService](../Images/details.png)
 
 In Details, only header section has fields and data. There is no facet, as facet is created using child entities. This is explained in whats next section in main document.  
 
