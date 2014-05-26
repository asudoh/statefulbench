require({
	packages: [
		{name: "dcl", location: "../dcl"},
		{name: "dojo", location: "../dojo"},
		{name: "delite", location: "../delite"},
		{name: "liaison", location: "../liaison"}
	]
}, [
	"./ctrl",
	"liaison/DOMTreeBindingTarget"
], function (ctrl) {
	(function (startup) {
		document.body ? startup() : window.addEventListener("DOMContentLoaded", startup);
	})(function () {
		document.querySelector("template").bind("bind", ctrl);
	});
});
