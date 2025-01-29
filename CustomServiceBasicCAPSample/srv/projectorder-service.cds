using {sap.capire.customservice as projectorderschema} from '../db/schema';

service ProjectOrderService @(path: '/project-order-service') {

    @odata.draft.bypass
    entity ProjectOrder as projection on projectorderschema.ProjectOrder;
}
