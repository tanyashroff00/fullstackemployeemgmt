sap.ui.define([
    "./App.controller",
    "sap/m/MessageBox",
    "../model/models"
],
    function (BaseController, MessageBox, models) {
        "use strict";

        return BaseController.extend("employeemanagement.controller.View1", {

            onInit: function () {
                this.getModel().setUseBatch(false);
                this.readData("/Employees/$count", "/itemCount", null);
                this.readData("/Employees", "/TableItems", null);
            },  //Init

            onUpdateFinish: function (oEvent) {
                debugger;
                var aItemsLen = oEvent.getSource().getBinding("items").aIndices.length;
                var oTable = this.getView().byId("employeesTable");
                oTable.getHeaderToolbar().getContent()[0].setText("Employee(" + aItemsLen + ")");

            },  //Update finish

            getNameFilterData: function (property, value) {
                return new sap.ui.model.Filter({
                    path: property,
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: value
                });
            },  //Employee Name filter

            getSalaryFilterData: function (property, value1, value2) {
                debugger;
                return new sap.ui.model.Filter({
                    path: property,
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: value1,
                    value2: value2
                });
            },  //Employee Salary filter

            onSelectionChangeFilterName: function (oEvent) {
                this.sSelectedKeyName = oEvent.getSource().getSelectedKey();

            },  //Employee Name filter

            onSelectionChangeFilterSalary: function (oEvent) {
                var oSalaryDropDown = this.getControl("salaryFilterId");
                var aSalaryData = oSalaryDropDown.getSelectedItems();
                var aSalary = [];
                for (var s in aSalaryData) {
                    var sSalary = aSalaryData[s].getText();
                    aSalary.push(sSalary);
                }
                this.setProperty("/salary", aSalary);
            },  //Employee Salary Filter

            onSearch: function () {
                debugger;
                var iEmployeeId = parseInt(this.sSelectedKeyName);
                var aSalary = this.getModel("jsonModel").getProperty("/salary");

                var oEmployeeFilterName = this.getNameFilterData("EMP_ID", iEmployeeId);
                var oSalaryFilter = this.getSalaryFilterData("EMP_SALARY", aSalary[0], aSalary[1]);

                this.readData("/Employees", "/TableItems", oSalaryFilter);
            },  //Search Filters

            onClearFilter: function (oEvent) {
                debugger;
                this.getControl("nameFilterId").setValue("");
                this.getControl("salaryFilterId").setSelectedKeys("");
                this.readData("/Employees", "/TableItems", null);

            }, //Clear Filters

            openCreateDialog: function () {
                debugger;
                var oJsonModel = this.getModel("jsonModel");
                oJsonModel.setProperty("/createData", models.onCreateObj());
                oJsonModel.setProperty("/controlType", "Dialog");
                if (!this.createDialog) {
                    this.createDialog = sap.ui.xmlfragment("employeemanagement.fragment.createDialog", this);
                    this.getView().addDependent(this.createDialog);
                }
                this.createDialog.open();
            }, //Open create Dialog 

            onCreateEmployee: function () {
                debugger;
                var oJsonModel = this.getModel("jsonModel");
                var emailPattern = '^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$';
                var oEmailValue = oJsonModel.oData.createData.EMP_EMAIL
                var oNameValue = oJsonModel.oData.createData.EMP_NAME

                var oEmailInput = this.getControl("emailId");
                var oNameInput = this.getControl("nameId");

                if (oEmailValue.match(emailPattern) && oNameValue !== '') {
                    debugger;
                    var oPayload = oJsonModel.getProperty("/createData");
                    var sSelectedModule = this.getModel("jsonModel").oData.moduleId;
                    oPayload.EMP_PRO_PRO_ID = sSelectedModule;

                    oPayload.CONTENT = this.fileContent;
                    oPayload.FILE_NAME = this.oFile.name;
                    this.getModel().create("/Employees", oPayload, {
                        success: function (oData) {
                            debugger;
                            MessageBox.success("Record created successfully.");
                            this.readData("/Employees", "/TableItems", null);
                            oEmailInput.setValueState(sap.ui.core.ValueState.None);
                            oNameInput.setValueState(sap.ui.core.ValueState.None);
                            this.onCancelEmployee();
                        }.bind(this)
                    });
                } else {

                    if (oEmailValue === '') {
                        oEmailInput.setValueState(sap.ui.core.ValueState.Error);
                        oEmailInput.setValueStateText("Cannot add empty value.");
                    } if (oNameValue === '') {
                        debugger;
                        oNameInput.setValueState(sap.ui.core.ValueState.Error);
                        oNameInput.setValueStateText("Cannot add empty value.");

                    } else {
                        oEmailInput.setValueState(sap.ui.core.ValueState.Error);
                        oEmailInput.setValueStateText("Invalid email address.");
                    }
                }
            }, //Create employee record

            XYZ: function(oEvent){
                debugger;
                var sModuleID = oEvent.getSource().getSelectedKey();
                this.getModel("jsonModel").setProperty("/moduleId",sModuleID);

            },

            onCancelEmployee: function () {
                this.getModel("jsonModel").setProperty("/controlType", undefined);
                this.createDialog.close();
                if (this.createDialog) {
                    this.createDialog.destroy();
                    this.createDialog = null;
                }

            },  //Cancel the creating process

            onSelectedRecord: function () {
                debugger;
                var oTable = this.getView().byId("employeesTable");
                var aSeletedItem = oTable.getSelectedItems();
                this.getModel("jsonModel").setProperty("/seletedItemToDelete", aSeletedItem);
            },  //Select records to delete employee

            onDeletePress: function () {
                debugger;
                var aSeletedItem = this.getModel("jsonModel").getProperty("/seletedItemToDelete");
                if (aSeletedItem === undefined) {
                    MessageBox.error("Please select alteast one record!");
                    return;
                } else {
                    MessageBox.warning("Do you want to delete this record?", {
                        title: "Warning",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: async function (sAction) {
                            if (sAction === 'YES') {
                                debugger;
                                for (var i in aSeletedItem) {
                                    var oSelectedEmployee = aSeletedItem[i].getBindingContext("jsonModel").getObject();
                                    var iEmployeeId = oSelectedEmployee.EMP_ID;
                                    var sUrl = `/Employees(${iEmployeeId})`;
                                    await this.deleteData(sUrl);
                                }
                                sap.m.MessageBox.success("Employee deleted successfully!!");
                                this.getView().byId("employeesTable").removeSelections(true);
                                this.readData("/Employees", "/TableItems", null);

                            }
                        }.bind(this)
                    });
                }
            },  //Delete employee record

            onBeforeUploadStart: function (oEvent) {
                debugger;
                var that = this;
                this.oFile = oEvent.mParameters.item.getFileObject();
                this.oItem = oEvent.getParameter("item");
                this.sMediaType = this.oItem.getMediaType();
                var reader = new FileReader();
                reader.onload = (e) => {
                    that.fileContent = e.target.result.split(",")[1];
                    const fileName = this.oFile.name;

                };
                reader.readAsDataURL(this.oFile);
            },

            onPressNav: function (oEvent) {
                debugger;
                var oSelectedEmployee = oEvent.getSource().getBindingContext("jsonModel").getObject();
                this.getModel("jsonModel").setProperty("/SelectedEmployeeToUpdate", oSelectedEmployee);
                var oEmployeeFilter = new sap.ui.model.Filter({
                    path: "EMP_ID",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: oSelectedEmployee.EMP_ID
                });
                this.getModel().read("/Employees", {
                    filters: [oEmployeeFilter],
                    urlParameters: {
                        "$expand": "EMP_PRO"
                    },
                    success: function (oData) {
                        debugger;
                        var oJsonModel = this.getModel("jsonModel");
                        oJsonModel.setProperty("/detailPageData", oData.results[0]);
                        oJsonModel.setProperty("/detailCV", oData.results);
                    }.bind(this)
                });
                var iEmpId = oSelectedEmployee.EMP_ID;
                this.getRouter().navTo("Detail", {
                    Id: iEmpId
                });
            }  //Navigation to detail page
        });
    });
