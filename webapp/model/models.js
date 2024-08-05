sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime info for the device the UI5 app is running on as JSONModel
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        onCreateObj: function(){
            return {
                "EMP_NAME":"",
                "EMP_EMAIL":"",
                "EMP_EXPERIANCE":"",
                "EMP_SALARY":"",
                "EMP_PRO_PRO_ID":"",
                "FILE_NAME":"",
                "CONTENT":""
            }
        }
    };

});