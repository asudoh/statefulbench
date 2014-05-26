define([
	"dojox/charting/Chart",
	"dojox/charting/themes/MiamiNice",
	"dojox/charting/widget/SelectableLegend",
	"./filteredMeans",
	"dojox/charting/axis2d/Default",
	"dojox/charting/plot2d/ClusteredColumns"
], function (Chart, MiamiNice, SelectableLegend, filteredMeans) {
	/* jshint nonew: false */

	var results,
		STORAGE_ID = "observationbench-results";
	try {
		results = JSON.parse(localStorage.getItem(STORAGE_ID));
	} catch (e) {}
	if (!Array.isArray(results)) {
		results = [];
	}

	var categories = [
			"name",
			"objects",
			"observedproperties",
			"mutatedproperties",
			"mutations"
		],
		categorized = filteredMeans(results, categories).reduce(function (categorized, result) {
			var o = categorized;
			for (var i = 0, l = categories.length - 1; i < l; ++i) {
				o = o[result[categories[i]]] = o[result[categories[i]]] || {};
			}
			o[result[categories[categories.length - 1]]] = result;
			return categorized;
		}, {}),
		chartData = {
			"Stateful#watch() use case, Watched objects = 4000, Watched properties per object = 16": {
				titles: [
					"Mutated properties per object",
					"Time for 400 mutations (ms)"
				],
				labels: [
					[
						{value: 1, text: "2"},
						{value: 2, text: "4"},
						{value: 3, text: "8"},
						{value: 4, text: "16"}
					],
					[
						{value: 10, text: "10"},
						{value: 20, text: "20"},
						{value: 30, text: "30"},
						{value: 40, text: "40"},
						{value: 50, text: "50"},
						{value: 60, text: "60"},
						{value: 70, text: "70"},
						{value: 80, text: "80"},
						{value: 90, text: "90"},
						{value: 100, text: "100"},
						{value: 110, text: "110"},
						{value: 120, text: "120"},
						{value: 130, text: "130"},
						{value: 140, text: "140"},
						{value: 150, text: "150"},
					]
				],
				series: {
					"Stateful#watch()": [
						categorized["Stateful#watch()"]["4000"]["16"]["2"]["400"],
						categorized["Stateful#watch()"]["4000"]["16"]["4"]["400"],
						categorized["Stateful#watch()"]["4000"]["16"]["8"]["400"],
						categorized["Stateful#watch()"]["4000"]["16"]["16"]["400"]
					],
					"Stateful#observe(), one per property": [
						categorized["Stateful#observe(), one per property"]["4000"]["16"]["2"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["16"]["4"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["16"]["8"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["16"]["16"]["400"]
					]
				}
			},
			"Stateful#watch() use case, Watched objects = 4000, Mutated properties per object = 2": {
				titles: [
					"Watched properties per object",
					"Time for 400 mutations (ms)"
				],
				labels: [
					[
						{value: 1, text: "2"},
						{value: 2, text: "4"},
						{value: 3, text: "8"},
						{value: 4, text: "16"}
					],
					[
						{value: 10, text: "10"},
						{value: 20, text: "20"},
						{value: 30, text: "30"},
						{value: 40, text: "40"},
						{value: 50, text: "50"},
						{value: 60, text: "60"},
						{value: 70, text: "70"},
						{value: 80, text: "80"},
						{value: 90, text: "90"},
						{value: 100, text: "100"},
						{value: 110, text: "110"},
						{value: 120, text: "120"},
						{value: 130, text: "130"},
						{value: 140, text: "140"},
						{value: 150, text: "150"},
					]
				],
				series: {
					"Stateful#watch()": [
						categorized["Stateful#watch()"]["4000"]["2"]["2"]["400"],
						categorized["Stateful#watch()"]["4000"]["4"]["2"]["400"],
						categorized["Stateful#watch()"]["4000"]["8"]["2"]["400"],
						categorized["Stateful#watch()"]["4000"]["16"]["2"]["400"]
					],
					"Stateful#observe(), one per property": [
						categorized["Stateful#observe(), one per property"]["4000"]["2"]["2"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["4"]["2"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["8"]["2"]["400"],
						categorized["Stateful#observe(), one per property"]["4000"]["16"]["2"]["400"]
					]
				}
			},
			"delite/Invalidating use case, Watched objects = 4000, Watched properties per object = 16": {
				titles: [
					"Mutated properties per object",
					"Time for 400 mutations (ms)"
				],
				labels: [
					[
						{value: 1, text: "2"},
						{value: 2, text: "4"},
						{value: 3, text: "8"},
						{value: 4, text: "16"}
					],
					[
						{value: 10, text: "10"},
						{value: 20, text: "20"},
						{value: 30, text: "30"},
						{value: 40, text: "40"},
						{value: 50, text: "50"},
						{value: 60, text: "60"},
						{value: 70, text: "70"},
						{value: 80, text: "80"},
						{value: 90, text: "90"},
						{value: 100, text: "100"},
						{value: 110, text: "110"},
						{value: 120, text: "120"},
						{value: 130, text: "130"},
						{value: 140, text: "140"},
						{value: 150, text: "150"},
					]
				],
				series: {
					"delite/Invalidating": [
						categorized["Invalidating#refreshRendering()"]["4000"]["16"]["2"]["400"],
						categorized["Invalidating#refreshRendering()"]["4000"]["16"]["4"]["400"],
						categorized["Invalidating#refreshRendering()"]["4000"]["16"]["8"]["400"],
						categorized["Invalidating#refreshRendering()"]["4000"]["16"]["16"]["400"]
					],
					"Stateful#observe()": [
						categorized["Stateful#observe()"]["4000"]["16"]["2"]["400"],
						categorized["Stateful#observe()"]["4000"]["16"]["4"]["400"],
						categorized["Stateful#observe()"]["4000"]["16"]["8"]["400"],
						categorized["Stateful#observe()"]["4000"]["16"]["16"]["400"]
					]
				}
			}
		};

	for (var s in chartData) {
		var entry = chartData[s],
			container = document.getElementById("chart"),
			titleContainer = document.createElement("h1"),
			chartContainer = document.createElement("div"),
			legendContainer = document.createElement("div");
		titleContainer.style.width = "400px";
		titleContainer.innerText = s;
		chartContainer.style.width = "400px";
		chartContainer.style.height = "300px";
		container.appendChild(titleContainer);
		container.appendChild(chartContainer);
		container.appendChild(legendContainer);
		var chart = new Chart(chartContainer)
				.setTheme(MiamiNice)
				.addPlot("default", {type: "ClusteredColumns", gap: 2})
				.addAxis("y", {title: entry.titles[1], includeZero: true, vertical: true, labels: entry.labels[1]})
				.addAxis("x", {title: entry.titles[0], labels: entry.labels[0], minorTicks: false});
		for (var title in entry.series) {
			chart.addSeries(title, entry.series[title].map(function (entry) {
				return entry.mean;
			}));
		}
		chart.render();
		new SelectableLegend({chart: chart}, legendContainer);
	}
});
