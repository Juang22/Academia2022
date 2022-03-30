sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        var oService = "/sap/opu/odata/sap/ZOS_ACADEMIA_JUAR2_MESAS_SRV_01/";

        return Controller.extend("academia2022.zlucc3mesas.controller.Student", {
            onInit: function () {
                this.getOwnerComponent().getRouter("object").getRoute("Estudentview");
                
                
                
            },
            
            onAfterRendering: function () {
                this._getStudent()
            },
            _getStudent: function () {

                var  oModel = this.getView().getModel();
                

                 
                // var sPath =`/MesaSet(CodMesa='${CodMesa.toString()}',Fecha='${Fecha.toString()}')/AnotadosSet`; 
                // var sPath = "/MesaSet(CodMesa='" + CodMesa.toString() + "',Fecha='"+ Fecha.toString() +"')/AnotadosSet"; 
                oModel.read("/EstudianteSet", {
                    success: function (oData) {
                        var oModelAnotadosJson = new sap.ui.model.json.JSONModel();
                        oModelAnotadosJson.setData(oData.results);
                        this.getView().byId("idEstudianteTable").setModel(oModelAnotadosJson, "ModeloEstudiante");
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });
            },

            previousPage: function () {
                this.getOwnerComponent().getRouter().navTo("RouteMesas")
               


            },

            onAddEstudent: function() {
                var oView = this.getView();
              
                if(!this._valueHelpStudent){
                    this._valueHelpStudent = sap.ui.xmlfragment("formStudent", 
                        "academia2022.zlucc3mesas.view.NewStudent",this);
                    this.getView().addDependent(this._valueHelpStudent)
                    }
                this._valueHelpStudent.open();
            },

          
            onNewStudent: function() {
                var objectForm = {}
                var DniEstudiante = sap.ui.core.Fragment.byId("formStudent","DniEstudiante").getValue()
                var NombreEstudiante = sap.ui.core.Fragment.byId("formStudent","NombreEstudiante").getValue()
                var ApellidoEstudiante = sap.ui.core.Fragment.byId("formStudent","ApellidoEstudiante").getValue()
                var Telefono = sap.ui.core.Fragment.byId("formStudent","Telefono").getValue()
                


                objectForm.DniEstudiante = DniEstudiante
                objectForm.NombreEstudiante = NombreEstudiante
                objectForm.ApellidoEstudiante = ApellidoEstudiante
                objectForm.Telefono = Telefono
               
                var  oModel = this.getView().getModel();
               
                oModel.create("/EstudianteSet",objectForm,null, {
                    
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Agregado con Exito')
                    }.bind(this),
                    error: function () {
                         sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                 });
              
                this._valueHelpStudent.close();
                this._getStudent();
            },

            closeFragment: function() {
                this._valueHelpStudent.close()
            },

            onEdit: function(oEvent) {
                var vDniEstudiante = oEvent.getSource().getBindingContext("ModeloEstudiante").getProperty("DniEstudiante");
                var vNombre = oEvent.getSource().getBindingContext("ModeloEstudiante").getProperty("NombreEstudiante");
                var vApellido = oEvent.getSource().getBindingContext("ModeloEstudiante").getProperty("ApellidoEstudiante");
                var vTelefono = oEvent.getSource().getBindingContext("ModeloEstudiante").getProperty("Telefono");
                
                var newJson = {
                    NombreEstudiante:vNombre,
                    ApellidoEstudiante:vApellido,
                    Telefono:vTelefono
                }


                var  oModel = this.getView().getModel();
                var sObjectPath = this.getView().getModel().createKey("/EstudianteSet", { DniEstudiante: vDniEstudiante});

                var sPath = sObjectPath

                oModel.update(sPath,newJson,null, {
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Borrado con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                this.getView().getModel().refresh()

            }



            
            
        });
    });
