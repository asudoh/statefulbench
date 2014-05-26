define(function () {
	return function (results, keys) {
		var categories = results.reduce(function (categories, result) {
				var stringifiedKeys = keys.map(function (key) {
					return result[key];
				}).join("/");
				(categories[stringifiedKeys] = categories[stringifiedKeys] || []).push(result);
				return categories;
			}, {}),
			filteredMeans = [];
		for (var stringifiedKeys in categories) {
			var category = categories[stringifiedKeys],
				mean = category.reduce(function (sum, result) {
					return sum + result.time;
				}, 0) / category.length,
				stddev = Math.sqrt(category.reduce(function (sum, result) {
					return sum + Math.pow(result.time - mean, 2);
				}, 0) / category.length),
				filtered = category.filter(function (result) {
					return Math.abs(result.time - mean) < stddev * 2;
				});
			var keyValues = stringifiedKeys.split("/"),
				o = {};
			keys.forEach(function (key, i) {
				o[key] = keyValues[i];
			});
			o.mean = filtered.reduce(function (sum, result) {
				return sum + result.time;
			}, 0) / filtered.length;
			filteredMeans.push(o);
		}
		return filteredMeans;
	};
});
