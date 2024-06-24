# Scheduler Configuration(optional)

As explained in reference scenario, bonus is calculated manually from UI or by configuring jobs which will automatically calculate bonus periodically. This section explains how job scheduler can be configured in BTP

* Go to BTP and select your account, subaccount and space.
* Click on "Instances" and then click on "create service instance"
![create service instance ](../Images/create-service-instance.png "create service instance")
* Select service as "job scheduling service" and give a instance name, click next and create the instance.
 ![scheduler create service 1 ](../Images/scheduler-create-service-screen-1.png "scheduler create service 1")
* Now the bonusplan-srv application to be bound to the instance. bonusplan-srv is created during deployment.
    ![scheduler binding ](../Images/scheduler-binding.png "scheduler binding")
    ![scheduler binding ](../Images/scheduler-service-binding.png "scheduler binding")

* Now go to Job Scheduler Dashboard from BTP Instance
![Job Scheduler Screen 1 ](../Images/Job-Scheduler-Screen-1.png "Job Scheduler Screen 1")

* To create a job, go to "Jobs", found in left navigaiton, and click on Create Job. In the Target applicaiton dropdown select application "bonusplan-srv".
In the Action, we need to add action endpoint which will look like "[application-url]/api/admin/calculateBonusesAction", here /api/admin is the endpoint and calculateBonusesAction is the action. 

    Please note: "calculateBonusesAction" action is created as part of Employee service. HTTP Method is POST by default in CAP service actions.
![Job Scheduler Screen 2 ](../Images/Job-Scheduler-Screen-2.png "Job Scheduler Screen 2")

* In Create Schedule screen set recurring schedule as per need
![Job Scheduler Screen 3 ](../Images/Job-Scheduler-Screen-3.png "Job Scheduler Screen 3")

* Schedule Logs can be viewed here
![Job Scheduler Screen 4 ](../Images/Job-Scheduler-Screen-4.png "Job Scheduler Screen 4")
