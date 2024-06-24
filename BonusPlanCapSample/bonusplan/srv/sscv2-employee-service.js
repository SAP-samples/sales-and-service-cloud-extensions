const cds = require('@sap/cds')

function toExternalEmployee(data) {
	return {
		ID: data.id,
		employeeId: data.id ?? "NA",
		email: data.workplaceAddress?.eMail ?? "NA",
		displayId: data.employeeDisplayId,
		displayName: data.formattedName ?? "NA"
	};
}

function toEmployee(data) {
	return {
		ID: data.id,
		updatedOn: data.adminData.updatedOn,
		formattedName: data.formattedName ?? null,
		currentBonusplan1: data.extensions && data.extensions.CurrentBonusplan1 ? data.extensions.CurrentBonusplan1 : null
	};
}

class Sscv2EmployeeService extends cds.ApplicationService {
	init() {
		this.on('getCurrentEmployee', async (req) => {
			try {
				const currentEmail = req?.user?.id;
				const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
				const currentEmployeeData = await employeesApi.send("GET", `/employees?$filter=workplaceAddress/eMail eq '${currentEmail}'`);
				if (currentEmployeeData && currentEmployeeData.value && currentEmployeeData.value[0]) {
					return toExternalEmployee(currentEmployeeData.value[0]);
				}
				return req.reject(400, "Employee not found.");
			} catch (err) {
				return req.reject(err);
			}
		});

		this.on('getEmployeeByDisplayId', async (req) => {
			try {
				const displayId = req?.data?.id;
				const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
				const employeeData = await employeesApi.send("GET", `/employees?$filter=employeeDisplayId eq '${displayId}'`);
				if (employeeData && employeeData.value && employeeData.value[0]) {
					return toExternalEmployee(employeeData.value[0]);
				}
				return req.reject(400, "Employee not found.");
			} catch (err) {
				return req.reject(err);
			}
		});

		this.on('getEmployee', async (req) => {
			try {
				const employeeId = req?.data?.id;

				const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
				const employeeData = await employeesApi.send("GET", `/employees/${employeeId}`);
				if (employeeData && employeeData.value) {
					return toEmployee(employeeData.value);
				}
				return req.reject(400, "Employee not found.");
			} catch (err) {
				return req.reject(err);
			}
		});

		this.on('updateEmployeeExtField', async (req) => {
			try {
				if (req && req.data && req.data.employeeId && req.data.bonusplanId && req.data.ifMatch) {
					const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
					const employeeExtFieldUpdateMsg = await employeesApi.send({
						method: "PATCH",
						path: `/employees/${req.data.employeeId}`,
						headers: {
							"Content-Type": "application/merge-patch+json",
							"If-Match": `\"${req.data.ifMatch}\"`
						},
						data: {
							"extensions": {
								"CurrentBonusplan1": `${req.data.bonusplanId}`
							}
						}
					});
					return employeeExtFieldUpdateMsg;
				} else {
					return req.reject(400, "Employee not found.");
				}
			} catch (err) {
				return req.reject(err);
			}
		});

		this.on('getEmployees', async (req) => {
			try {
				const employeesApi = await cds.connect.to("Open.Api.Specification.for.employee.service");
				let employeeDataEndPoint = '/employees?$count=true';
				employeeDataEndPoint += '&$skip=' + req.data._search._queryOptions.$skip;
				employeeDataEndPoint += '&$top=' + req.data._search._queryOptions.$top;
				if (req.data._search._queryOptions.$search) {
					employeeDataEndPoint += '&$search=' + req.data._search._queryOptions.$search;
				}
				if (req.data._search._queryOptions.$filter) {
					employeeDataEndPoint += '&$filter=' + req.data._search._queryOptions.$filter;
				}

				const employeeData = await employeesApi.send("GET", employeeDataEndPoint);
				if (employeeData && employeeData.value && employeeData.value.length > 0) {

					employeeData.value = employeeData.value.map(toExternalEmployee);
					employeeData.value.$count = employeeData.count;
					return employeeData.value;
				}
				return req.reject(400, "Employee not found.");
			} catch (err) {
				return req.reject(err);
			}
		});

	}
}

module.exports = { Sscv2EmployeeService }