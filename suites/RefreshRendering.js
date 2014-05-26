define([
	"dcl/dcl",
	"dojo/Deferred",
	"delite/Stateful",
	"delite/Invalidating"
], function (dcl, Deferred, Stateful, Invalidating) {
	/* global performance */
	var timestamper = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

	function RefreshRendering(params) {
		this.params = params;
		this.tests = {
			"Invalidating#refreshRendering()": this.runTest.bind(this)
		};
	}

	RefreshRendering.prototype.runTest = function () {
		var i,
			callCount = 0,
			statefuls = [],
			objectsCount = this.params.objects,
			observedPropertiesCount = this.params.observedproperties,
			mutatedPropertiesCount = this.params.mutatedproperties,
			mutationsCount = this.params.mutations,
			targetCount = Math.floor(mutationsCount / mutatedPropertiesCount);
		Stateful.useObserve = false;
		for (i = 0; i < objectsCount; ++i) {
			var j,
				proto = {},
				observedproperties = {};
			for (j = 0; j < observedPropertiesCount; ++j) {
				proto["property" + j] = undefined;
				observedproperties["property" + j] = "invalidateRendering";
			}
			proto._invalidatingProperties = observedproperties;
			proto.refreshRendering = function () {
				if (++callCount >= targetCount) {
					testFinished();
				}
			};
			proto.emit = function () {}; // delite/Invalidating#validateRendering() calls this
			statefuls.push(new (dcl(Invalidating, proto))());
		}
		var dfd = new Deferred(),
			start = timestamper.now();
		for (i = 0; i < mutationsCount; ++i) {
			statefuls[Math.floor(i / mutatedPropertiesCount)]["property" + (i % mutatedPropertiesCount)] = 1;
		}
		function testFinished() {
			var end = timestamper.now();
			for (var stateful; (stateful = statefuls.shift());) {
				stateful.destroy();
			}
			console.log("Callback call count: " + callCount);
			dfd.resolve(end - start);
		}
		return dfd.promise;
	};

	return RefreshRendering;
});
