define([
	"dcl/dcl",
	"dojo/Deferred",
	"delite/Stateful"
], function (dcl, Deferred, Stateful) {
	/* global performance */
	var timestamper = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

	function Watch(params) {
		this.params = params;
		this.tests = {
			"Stateful#watch()": this.runTest.bind(this)
		};
	}

	Watch.prototype.runTest = function () {
		var i,
			callCount = 0,
			handles = [],
			statefuls = [],
			objectsCount = this.params.objects,
			observedPropertiesCount = this.params.observedproperties,
			mutatedPropertiesCount = this.params.mutatedproperties,
			mutationsCount = this.params.mutations;
		Stateful.useObserve = false;
		for (i = 0; i < objectsCount; ++i) {
			var j,
				proto = {};
			for (j = 0; j < observedPropertiesCount; ++j) {
				proto["property" + j] = undefined;
			}
			var stateful = new (dcl(Stateful, proto))();
			for (j = 0; j < observedPropertiesCount; ++j) {
				handles.push(stateful.watch("property" + j, function () {
					++callCount;
				}));
			}
			statefuls.push(stateful);
		}
		var dfd = new Deferred(),
			start = timestamper.now();
		for (i = 0; i < mutationsCount; ++i) {
			statefuls[Math.floor(i / mutatedPropertiesCount)]["property" + (i % mutatedPropertiesCount)] = 1;
		}
		setTimeout(function () {
			var end = timestamper.now();
			for (var h; (h = handles.shift());) {
				h.remove();
			}
			console.log("Callback call count: " + callCount);
			dfd.resolve(end - start);
		}, 0);
		return dfd.promise;
	};

	return Watch;
});
