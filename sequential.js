define([
	"dojo/Deferred",
	"dojo/when"
], function (Deferred, when) {
	return function (tasks) {
		tasks = tasks.slice();
		var dfd = new Deferred(),
			results = [];
		function run() {
			var task = tasks.shift();
			if (task) {
				when(task(), function (result) {
					results.push(result);
					run();
				}, dfd.reject.bind(dfd));
			} else {
				dfd.resolve(results);
			}
		}
		run();
		return dfd.promise;
	};
});
