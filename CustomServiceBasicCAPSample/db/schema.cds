using {managed} from '@sap/cds/common';

namespace sap.capire.customservice;

entity ProjectOrder : managed {
    key id                   : UUID;
        name                 : String not null;
        customerName         : String;
        status               : String default 'ACTIVE';
        startDate            : String;
        endDate              : String;
        isIndividualCustomer : Boolean;
        customerEmail        : String;
}
