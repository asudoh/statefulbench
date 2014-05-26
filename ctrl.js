define([
	"dojo/Deferred",
	"dojo/sniff",
	"dojo/when",
	"liaison/ObservablePath",
	"liaison/computed",
	"liaison/wrapper",
	"./sequential",
], function (Deferred, has, when, ObservablePath, computed, wrapper, sequential) {
	var STORAGE_ID = "observationbench-results";

	function runSuite(suite) {
		return sequential(Object.keys(suite.tests).map(function (name) {
			return function () {
				return when(suite.tests[name](), function (time) {
					var data = {
						name: name,
						time: time
					};
					for (var s in suite.params) {
						data[s] = suite.params[s];
					}
					return data;
				});
			};
		}));
	}

	return wrapper.wrap({
		runSuites: function () {
			var ctrl = this;
			ctrl.set("inprogress", true);
			ctrl.set("progress", 0);
			setTimeout(require.bind(undefined, [
				"./suites/Watch",
				"./suites/ObserveWatch",
				"./suites/RefreshRendering",
				"./suites/Observe"
			], function (Watch, ObserveWatch, RefreshRendering, Observe) {
				var count = 0,
					tests = [
						new Watch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 2,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 2,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 4,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 4,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 8,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 8,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 16,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 16,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 2,
							mutatedproperties: 2,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 2,
							mutatedproperties: 2,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 4,
							mutatedproperties: 2,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 4,
							mutatedproperties: 2,
							mutations: 400
						}),
						new Watch({
							objects: 4000,
							observedproperties: 8,
							mutatedproperties: 2,
							mutations: 400
						}),
						new ObserveWatch({
							objects: 4000,
							observedproperties: 8,
							mutatedproperties: 2,
							mutations: 400
						}),
						new RefreshRendering({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 2,
							mutations: 400
						}),
						new Observe({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 2,
							mutations: 400
						}),
						new RefreshRendering({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 4,
							mutations: 400
						}),
						new Observe({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 4,
							mutations: 400
						}),
						new RefreshRendering({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 8,
							mutations: 400
						}),
						new Observe({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 8,
							mutations: 400
						}),
						new RefreshRendering({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 16,
							mutations: 400
						}),
						new Observe({
							objects: 4000,
							observedproperties: 16,
							mutatedproperties: 16,
							mutations: 400
						})
					];
				sequential(tests.map(function (suite) {
					return function () {
						var dfd = new Deferred();
						when(runSuite.call(ctrl, suite), function (data) {
							ctrl.set("progress", ++count * 100 / tests.length);
							setTimeout(dfd.resolve.bind(dfd, data), 0);
						});
						return dfd.promise;
					};
				})).then(function (suitesresults) {
					var results;
					try {
						results = JSON.parse(localStorage.getItem(STORAGE_ID));
					} catch (e) {}
					if (!Array.isArray(results)) {
						results = [];
					}
					suitesresults.forEach(function (suiteresults) {
						results.push.apply(results, suiteresults);
					});
					localStorage.setItem(STORAGE_ID, JSON.stringify(results));
					ctrl.set("data", JSON.stringify(results, null, 4));
					ctrl.set("inprogress", false);
				}).otherwise(function (e) {
					console.error("Error during benchmark test: " + e.stack);
				});
			}), 0);
		},
		clear: function () {
			localStorage.setItem(STORAGE_ID, "");
		},
		import: function () {
			try {
				var data = JSON.parse(this.data);
				if (!Array.isArray(data)) {
					throw new Error("The given data is in a wrong format.");
				}
				var results = JSON.parse(localStorage.getItem(STORAGE_ID));
				if (!Array.isArray(results)) {
					results = [];
				}
				results.push.apply(results, data);
				localStorage.setItem(STORAGE_ID, JSON.stringify(results));
				alert("Import successful.");
			} catch (e) {
				alert("Import failed! Error: " + e.stack);
			}
		},
		export: function () {
			var results = JSON.parse(localStorage.getItem(STORAGE_ID));
			if (!Array.isArray(results)) {
				results = [];
			}
			this.set("data", JSON.stringify(results, null, 4));
		}
	});
});
