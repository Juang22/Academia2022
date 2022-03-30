sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/util/MockServer",
    "sap/ui/core/CustomData"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MockServer,CustomData) {
        "use strict";

        var oService = "/sap/opu/odata/sap/ZOS_ACADEMIA_JUAR2_MESAS_SRV_01/";

        return Controller.extend("academia2022.zlucc3mesas.controller.Anotados", {
            onInit: function () {
                // this._getMesas();
                // this._getStudent();
               
                this.getOwnerComponent().getRouter("object").getRoute("anotados").attachPatternMatched(this._onObjectMatched, this);
                
            },
            
            _onObjectMatched: function (oEvent) {
                var vCodMesa = oEvent.getParameter("arguments").CodMesa;
                var vFecha = oEvent.getParameter("arguments").Fecha;
                var vDniEstudiante = oEvent.getParameter("arguments").DniEstudiante;
                // this._getAnotados(vCodMesa,vFecha)
                this.getView().getModel().metadataLoaded().then(function () {
                        this._getAnotados(vCodMesa, vFecha)
                        
                    }.bind(this))
            },


            _getAnotados: function (CodMesa, Fecha) {

                var  oModel = this.getView().getModel();
                var sObjectPath = this.getView().getModel().createKey("/MesaSet", { CodMesa: CodMesa.toString(), Fecha: Fecha.toString() });

                var sPath = sObjectPath + "/AnotadosSet"
                oModel.read(sPath, {
                    success: function (oData) {
                        var oModelAnotadosJson = new sap.ui.model.json.JSONModel();
                        oModelAnotadosJson.setData(oData.results);
                        this.getView().byId("idAnotadosTable").setModel(oModelAnotadosJson, "ModeloAnotados");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });
                

            },


            _getEstudiante: function (DniEstudiante) {

                
               
            },

            onInformation:  function(oEvent) {
                var vDniEstudiante = oEvent.getSource().getBindingContext("ModeloAnotados").getProperty("DniEstudiante");
                
                var  oModel = this.getView().getModel();
                var sObjectPath = this.getView().getModel().createKey("/EstudianteSet", { DniEstudiante: vDniEstudiante.toString() });
                
                
                
                    oModel.read(sObjectPath, {
                        success: function (oData) {
                            var oModelM =  new sap.ui.model.json.JSONModel();
                            oModelM.setData(oData);
                           
                            if (!this._valueHelpInformation) {
                                this._valueHelpInformation = sap.ui.xmlfragment("Information",
                                    "academia2022.zlucc3mesas.view.Information", this);
                                this.getView().addDependent(this._valueHelpInformation)
                                
                            }
                            sap.ui.core.Fragment.byId("Information","idEstudiantesModel").setModel(oModelM, "EstudiantesModel");
                            this._valueHelpInformation.open();
                        }.bind(this),
                        error: function () {
                            sap.m.MessageToast.show('Error al conectar con SAP')
                        }.bind(this)
                    }); 
                

                // var oModelInf =  new sap.ui.model.json.JSONModel("EstudiantesModel");
                // this.getView().setModel(oModelInf, "textInf");
                var oView = this.getView(); 
        
            },


            closeFragment: function() {
                this._valueHelpInformation.close();
            },



            previousPage: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMesas")
            },


            onPressDelete: function(oEvent){
                var vCodMesa = oEvent.getSource().getBindingContext("ModeloAnotados").getProperty("CodMesa");
                var vFecha = oEvent.getSource().getBindingContext("ModeloAnotados").getProperty("Fecha");
                var vDniEstudiante = oEvent.getSource().getBindingContext("ModeloAnotados").getProperty("DniEstudiante");
                var vIdEstudiante = oEvent.getSource().getBindingContext("ModeloAnotados").getProperty("IdEstudiante");
                var oModel = new sap.ui.model.odata.v2.ODataModel(oService);
                var sObjectPath = this.getView().getModel().createKey("/AnotadosSet", {CodMesa:vCodMesa.toString(), Fecha:vFecha.toString(), 
                    DniEstudiante: vDniEstudiante.toString(), IdEstudiante: vIdEstudiante.toString() });
               
                oModel.remove(sObjectPath, {
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Borrado con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                if (!this._valueHelpDelete) {
                    this._valueHelpDelete = sap.ui.xmlfragment("Delete",
                        "academia2022.zlucc3mesas.view.DeleteAnotado", this);
                    this.getView().addDependent(this._valueHelpDelete);

                }
                this._valueHelpDelete.open();
            },

           
        });

        

       


    });
