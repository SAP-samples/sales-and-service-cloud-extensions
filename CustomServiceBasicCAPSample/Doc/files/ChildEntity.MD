## Add Child Entity

In this sample we have only one entity(Project Order) and as a result, in details header, root entity data is displayed. 

But as per use case, service can have multiple entities and can be associated with root as a child. Data for child entities can be shown at facet level.

For eg: Project order can have products child entity.

Since, its a child entity, any operation will require parent entity UUID as foreign key and get URL should be in this format: 

`https://<application-url>/<service-name>/<root-entity-name>/<root-entity-ID>/<child-entity>`

Example URL:
To get products for particular project order:

https://xyz.hana.ondemand.com/project-order-service/ProjectOrder/4de13335-b2df-11ef-82e8-bb3595fd7bed/Products

Here:<br>
- xyz.hana.ondemand.com : is application URL.
-  project-order-service : is service name
- ProjectOrder : root entity
- 4de13335-b2df-11ef-82e8-bb3595fd7bed : example project order id
- Products : is child entity





