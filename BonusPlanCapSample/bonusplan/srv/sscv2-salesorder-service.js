const cds = require('@sap/cds')

function toSalesOrder(data) {

	if (data && data.owner
		&& data.lifeCycleStatus === 'COMPLETED' // status = completed
	) {
		return {
			ID: data.id,
			status: data.status ?? "NA",
			owner: {
				id: data.owner?.id ?? data.owner?.partyId ?? "NA"
			},
			totalValues: {
				grossAmount: {
					content: data.totalValues?.grossAmount?.content ?? 0
				}
			}
		};
	};
}

class Sscv2SalesorderService extends cds.ApplicationService {
	init() {

		this.on('getSalesOrders', async (req) => {
			try {
				const empId = req?.data?.employeeId;

				const qStartDate = req?.data?.qStartDate;
				const qEndDate = req?.data?.qEndDate

				/**
				 * Owner or salesEmployee shold be checked? Ans: Owner
				 * totalValues.netAmount shold be taken for calculation?Ans: yes
				 * Which date will be used to calculate for a perticular quarter? find out closed date? Ans: progressStatusValidSince
				 * which pricing status will be taken for calculation? "pricingStatus": "CALCULATED_SUCCESSFULLY",? Ans: "lifeCycleStatus": "COMPLETED",
				 */

				/**
				 * below lines will be used if sales data fetched from salesOrder
				 */

				/**
				 * below lines will be used if sales data fetched from salesQuote
				 */
				const salesOrdersApi = await cds.connect.to("Open.Api.Specification.for.salesQuote.service");
				const salesOrdersList = await salesOrdersApi.send("GET", `/salesQuotes?$filter=owner/partyId eq ${empId} and lifeCycleStatus eq 'COMPLETED' and totalValues/netAmount/content gt '0' and progressStatusValidSince gt ${qStartDate} and progressStatusValidSince lt ${qEndDate}`);

				if (salesOrdersList && salesOrdersList.value && salesOrdersList.value.length > 0) {
					return salesOrdersList.value.filter(toSalesOrder);
				}
				return null;
			} catch (err) {
				return null;
			}
		});

	}
}

module.exports = { Sscv2SalesorderService }