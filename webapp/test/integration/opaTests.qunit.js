/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["academia2022/zlucc3mesas/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
