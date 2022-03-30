/*global QUnit*/

sap.ui.define([
	"academia2022/zlucc3_mesas/controller/Mesas.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Mesas Controller");

	QUnit.test("I should test the Mesas controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
