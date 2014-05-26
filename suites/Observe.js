define([
	"dcl/dcl",
	"dojo/Deferred",
	"delite/Stateful"
], function (dcl, Deferred, Stateful) {
	/* global performance */
	var timestamper = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;

	function Observe(params) {
		this.params = params;
		this.tests = {
			"Stateful#observe()": this.runTest.bind(this)
		};
	}

	Observe.prototype.runTest = function () {
		var i,
			callCount = 0,
			statefuls = [],
			handles = [],
			objectsCount = this.params.objects,
			observedPropertiesCount = this.params.observedproperties,
			mutatedPropertiesCount = this.params.mutatedproperties,
			mutationsCount = this.params.mutations,
			targetCount = Math.floor(mutationsCount / mutatedPropertiesCount);
		Stateful.useObserve = true;
		for (i = 0; i < objectsCount; ++i) {
			var j,
				proto = {},
				props = [];
			for (j = 0; j < observedPropertiesCount; ++j) {
				proto["property" + j] = undefined;
				props.push("property" + j);
			}
			proto.emit = function () {}; // delite/Invalidating#validateRendering() calls this
			var stateful = new (dcl(Stateful, proto))();
			handles.push(stateful.observe.apply(stateful, props.concat(function () {
				if (++callCount >= targetCount) {
					testFinished();
				}
				this.emit();
			})));
			statefuls.push(stateful);
		}
		var dfd = new Deferred(),
			start = timestamper.now();
		for (i = 0; i < mutationsCount; ++i) {
			statefuls[Math.floor(i / mutatedPropertiesCount)]["property" + (i % mutatedPropertiesCount)] = 1;
		}
		function testFinished() {
			var end = timestamper.now();
			for (var h; (h = handles.shift());) {
				h.remove();
			}
			console.log("Callback call count: " + callCount);
			dfd.resolve(end - start);
		}
		return dfd.promise;
	};

	return Observe;
});
