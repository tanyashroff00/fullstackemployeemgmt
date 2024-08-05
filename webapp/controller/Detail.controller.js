sap.ui.define([
    "./App.controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    function (BaseController, MessageBox, JSONModel) {
        "use strict";

        return BaseController.extend("employeemanagement.controller.Detail", {

            onInit: function () {
                debugger;
                // this.getModel().setUseBatch(false);
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this); 
            },

            _onObjectMatched: function(){
                debugger;
                this.getModel("jsonModel").setProperty("/bEdit",false);
                this.getModel("jsonModel").setProperty("/bDisplay",true);
            },

            onEditPress: function(){
                debugger;
                this.getModel("jsonModel").setProperty("/bEdit", true);
			    this.getModel("jsonModel").setProperty("/bDisplay", false);

                var oUploadSet = this.getControl("UploadSet");
                this.getModel("jsonModel").setProperty("/uploadSet", oUploadSet);
                
                
            },
            onSavepress: function(oEvent){
                debugger;
                var oUploadSet = this.getModel("jsonModel").getProperty("/uploadSet");
                if(oUploadSet.getItems()[0].length !== 0){
                    var sFileName = oUploadSet.getItems()[0].getFileName();

                }
                
                this.getModel("jsonModel").setProperty("/bEdit", false);
			    this.getModel("jsonModel").setProperty("/bDisplay", true);

                var oJsonModel = this.getModel("jsonModel");
                var oPayload = oJsonModel.getProperty("/SelectedEmployeeToUpdate");
                oPayload.FILE_NAME = sFileName;
                var sPath = "/Employees(" + oPayload.EMP_ID + ")";                
                this.getModel().update(sPath, oPayload, {
                    success: function (oData) {
                        debugger;
                        sap.m.MessageBox.success("Employee updated successfully");
                    }.bind(this)
                });
            },

            onBackPress: function () {
                this.getRouter().navTo("RouteView1");
            },
        });
    });