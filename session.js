session = {
	years: {},
	colors: [
	  '#8D3939',
	  '#454D79'
  ],
	addSeries: function(year, series) {
		var pop = lib.totalPopulation(series)
		this.years[year] = {
			population: pop,
			distribution: series,
			greater_lesser: lib.greaterLesserArray(series),
			percentages: lib.percentageArray(pop, series)
		}
	},
	percentLessThan: function(year, weight) {
		//Percentage of population that weighs less than given weight
		return parseInt(session.years[year].greater_lesser[weight-75].lesser / session.years[year].population * 100);
	},
	percentMoreThan: function(year, weight) {
		//Percentage of population that weighs more than given weight
		return parseInt(session.years[year].greater_lesser[weight-75].greater / session.years[year].population * 100);
	},
	numberSame: function(year, percentage) {
		return parseInt(percentage * session.years[year].population);
	},
	reset: function() {
		this.years = {};
	}
}