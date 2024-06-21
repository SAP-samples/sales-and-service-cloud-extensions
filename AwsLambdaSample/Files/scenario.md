## Reference Scenario
### Scenario
Please find the details of reference scenario in this section.

As a sales executive when a lead is created in SAP sales and service cloud, if there is any requirement to determine a field value based on another field value OR default any standard field value OR determine a custom field value based on any field value entered in Lead, then extension to AWS Lambda Service can be used in SAP sales and service cloud.

**Determinations :** We have added determination in external service which is AWS Lambda Service via External hooks feature. Consider a Lead Name is maintained as “Lead low priority” and qualification as “Cold” while creating a Lead and when sales executive wants to change qualification to “Hot” so that name of the Lead can automatically set to “Lead high priority”. Determinations can be achieved by configuring external hook as prehook for standard field change and prehook/posthook for determinations on custom fields.
