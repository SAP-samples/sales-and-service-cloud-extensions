sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        goBackToListPage: function(oEvent) {
            window.history.back()
        }
    };
});
