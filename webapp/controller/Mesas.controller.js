sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, JSONModel) {
        "use strict";

        var oService = "/sap/opu/odata/sap/ZOS_ACADEMIA_JUAR2_MESAS_SRV_01/";

        return Controller.extend("academia2022.zlucc3mesas.controller.Mesas", {
            onInit: function () {
                
            },

            
            onChangeView: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("anotados", {
                    CodMesa: oEvent.getSource().getBindingContext().getProperty("CodMesa"),
                    Fecha: oEvent.getSource().getBindingContext().getProperty("Fecha")

                })
            },

            onPressViewStudent: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("estudentview")

            },

            /*-------------------------------------------------------------------------------- */
            /*--------------------  Function for delete row of table ------------------------ */
            onPressDelete: function (oEvent) {
                var CodMesa = oEvent.getSource().getBindingContext().getProperty("CodMesa");
                var Fecha = oEvent.getSource().getBindingContext().getProperty("Fecha");

                if (!Fecha) {
                    Fecha = "    .  .  "
                }
                // var sPath = "/MesaSet(CodMesa='" + CodMesa.toString() + "',Fecha='"+ Fecha.toString() +"')"; 
                var  oModel = this.getView().getModel();
                // var oModel = new sap.ui.model.odata.v2.ODataModel(oService);
                var sObjectPath = this.getView().getModel().createKey("/MesaSet", { CodMesa: CodMesa.toString(), Fecha: Fecha.toString() });

                var sPath = sObjectPath
                
                oModel.remove(sPath, {
                    
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Borrado con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                this.getView().getModel().refresh()

            },


            /*-------------------------------------------------------------------------------- */
            /*--------------------  Functions for create new row on table ------------------------ */

            /* ---------- First open the fragment------- */

            onPressCreate: function () {

                var oView = this.getView();

                if (!this._valueHelpMesas) {
                    this._valueHelpMesas = sap.ui.xmlfragment("formMesas",
                        "academia2022.zlucc3mesas.view.Form", this);
                    this.getView().addDependent(this._valueHelpMesas)
                }
                this._valueHelpMesas.open();

            },



            /* ---------- second send to data base the new row of table------- */
            sendForm: function (oEvent) {

                var objectForm = {}
                var Fecha = sap.ui.core.Fragment.byId("formMesas", "Fecha").getValue()
                var LlamadoTipo = sap.ui.core.Fragment.byId("formMesas", "LlamadoTipo").getValue()
                var Docente = sap.ui.core.Fragment.byId("formMesas", "Docente").getValue()
                var Carrera = sap.ui.core.Fragment.byId("formMesas", "Carrera").getValue()
                var Materia = sap.ui.core.Fragment.byId("formMesas", "Materia").getValue()

                const meses = [
                    { Id: 1, value: 'ENE' },
                    { Id: 2, value: 'FEB' },
                    { Id: 3, value: 'MAR' },
                    { Id: 4, value: 'ABR' },
                    { Id: 5, value: 'MAY' },
                    { Id: 6, value: 'JUN' },
                    { Id: 7, value: 'JUL' },
                    { Id: 8, value: 'AGO' },
                    { Id: 9, value: 'SEP' },
                    { Id: 10, value: 'OCT' },
                    { Id: 11, value: 'NOV' },
                    { Id: 12, value: 'DIC' },
                ]

                var dia = Fecha.slice(8);

                var mes = Fecha.slice(5, 7);
                var anio = Fecha.slice(0, 4);
                var month = '';
                meses.map((element) => {
                    if (element.Id == mes) {
                        month = element.value
                    }
                })
                var date = dia + '.' + month + '.' + anio

                objectForm.Fecha = date
                objectForm.LlamadoTipo = LlamadoTipo
                objectForm.Docente = Docente
                objectForm.Carrera = Carrera
                objectForm.Materia = Materia

                var oModel = this.getView().getModel();
                
                oModel.create("/MesaSet", objectForm, null, {
                   
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Agregado con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                this._valueHelpMesas.close();
            },




            closeFragment: function () {
                if(this._valueHelpMesas){
                    this._valueHelpMesas.close();
                }
                if( this._valueHelpMesasEdit){
                    this._valueHelpMesasEdit.close();
                }
                if( this._valueHelpAnotado){
                    this._valueHelpAnotado.close();
                }
            },


            /*-------------------------------------------------------------------------------- */
            /*--------------------  Functions for update row of table ------------------------ */

            onEdit: function (oEvent) {
                var CodMesa = oEvent.getSource().getBindingContext().getProperty("CodMesa");
                var Fecha = oEvent.getSource().getBindingContext().getProperty("Fecha");
                var LlamadoTipo = oEvent.getSource().getBindingContext().getProperty("LlamadoTipo");
                var Docente = oEvent.getSource().getBindingContext().getProperty("Docente");
                var Carrera = oEvent.getSource().getBindingContext().getProperty("Carrera");
                var Materia = oEvent.getSource().getBindingContext().getProperty("Materia");
                var oView = this.getView();

                var oModelFragment = {
                    CodMesa: CodMesa,
                    Fecha: Fecha,
                    LlamadoTipo: LlamadoTipo,
                    Docente: Docente,
                    Carrera: Carrera,
                    Materia: Materia,
                    enabled: true,

                }

                var oModelEdit = new sap.ui.model.json.JSONModel(oModelFragment);
                this.getView().setModel(oModelEdit, "textModel");

                if (!this._valueHelpMesasEdit) {
                    this._valueHelpMesasEdit = sap.ui.xmlfragment("EditMesas",
                        "academia2022.zlucc3mesas.view.Edit", this);
                    this.getView().addDependent(this._valueHelpMesasEdit);

                }
                this._valueHelpMesasEdit.open();

            },
            EditMesas: function (oEvent) {
                var CodMesa = sap.ui.core.Fragment.byId("EditMesas", "CodMesa").getValue();
                var Fecha = sap.ui.core.Fragment.byId("EditMesas", "Fecha").getValue()
                var LlamadoTipofirst = sap.ui.core.Fragment.byId("EditMesas", "LlamadoTipofirst").getSelectedKey()
                var Docente = sap.ui.core.Fragment.byId("EditMesas", "Docente").getValue()
                var Carrera = sap.ui.core.Fragment.byId("EditMesas", "Carrera").getValue()
                var Materia = sap.ui.core.Fragment.byId("EditMesas", "Materia").getValue()

                var objectForm = {}
                objectForm.LlamadoTipo = LlamadoTipofirst
                objectForm.Docente = Docente
                objectForm.Carrera = Carrera
                objectForm.Materia = Materia


                var  oModel = this.getView().getModel();
                var sObjectPath = this.getView().getModel().createKey("/MesaSet",
                    {CodMesa: CodMesa.toString(), Fecha: Fecha.toString()});
                

                oModel.update(sObjectPath, objectForm,null,  {
                   
                    success: function (oData) {
                        sap.m.MessageToast.show('Mesa Editada con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                this._valueHelpMesasEdit.close();

            },


            onfiltrarTabla: function () {
                var aFilter = [];
                var vLLamado = "";
                var vcarrera = "";
                var oModel = this.getView().getModel();
                // this.getView().byId("idMesa").setBusy(true);


                if (this.getView().byId("filterLLamado").getSelectedKey()) {
                    vLLamado = this.getView().byId("filterLLamado").getSelectedKey();
                    aFilter.push(new sap.ui.model.Filter("LlamadoTipo", "EQ", vLLamado))
                }

                if (this.getView().byId("idDate").getValue()) {
                    vcarrera = this.getView().byId("idDate").getValue();
                    aFilter.push(new sap.ui.model.Filter("Carrera", "EQ", vcarrera))
                }

                
                oModel.read("/MesaSet", {
                    
                    filters: aFilter,
                    success: function (oData) {
                        var oModelM = new sap.ui.model.json.JSONModel();
                        oModelM.setProperty('/MesaSet', oData.results);
                        this.getView().byId("idMesa").setModel(oModelM);
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });


            },

            onPressAdd: function (oEvent) {
                
                var CodMesa = oEvent.getSource().getBindingContext().getProperty("CodMesa");
                var Fecha = oEvent.getSource().getBindingContext().getProperty("Fecha");

                var oModelFragmentStudent = {
                    CodMesa: CodMesa,
                    Fecha: Fecha,
                }

                var oModelAdd = new sap.ui.model.json.JSONModel(oModelFragmentStudent);
                this.getView().setModel(oModelAdd, "textModelStudent");

                var oView = this.getView();

                if (!this._valueHelpAnotado) {
                    this._valueHelpAnotado = sap.ui.xmlfragment("AddStudent",
                        "academia2022.zlucc3mesas.view.NewAnotado", this);
                    this.getView().addDependent(this._valueHelpAnotado)
                }
                this._valueHelpAnotado.open();


            },

            addAnotado: function () {
                var CodMesa = sap.ui.core.Fragment.byId("AddStudent", "CodMesa").getValue();
                var Fecha = sap.ui.core.Fragment.byId("AddStudent", "Fecha").getValue()
                var DniEstudiante = sap.ui.core.Fragment.byId("AddStudent", "DniEstudiante").getValue()
                var TipoEstudiante = sap.ui.core.Fragment.byId("AddStudent", "TipoEstudiante").getSelectedKey()
                var AnioCurso = sap.ui.core.Fragment.byId("AddStudent", "AnioCurso").getSelectedKey()

                var objectForm = {
                    CodMesa:CodMesa,Fecha:Fecha,DniEstudiante:DniEstudiante,TipoEstudiante:TipoEstudiante,AnioCurso:AnioCurso
                }
                
                var  oModel = this.getView().getModel();
                oModel.create("/AnotadosSet", objectForm, null, {
                    
                    success: function (oData) {
                        sap.m.MessageToast.show('Campo Agregado con Exito')
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show('Error al conectar con SAP')
                    }.bind(this)
                });

                this._valueHelpAnotado.close();
                this.getView().getModel().refresh()

            }



        });
    });


