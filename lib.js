/*

	lib.js contains all functionality relating to the weigh too much javascript library
	controller: coordinates client-server communcation via ajax
	view: retrieves data from input forms, handles templates and dom manipulation
	lib: general functions for use in view and controller
	[session]: contains session specific data (current GARY, etc..)
*/

lib = {
	bmi: function(weight, height) {
		//Calculates BMI given imperial units (lbs, inches)
		return (weight*703)/(height*height);
	},

	bmiMetric: function(weight, height) {
		//Calculates BMI given metric units (kg, meters)
		return weight/(height*height);
	},

	bmiToWeight: function(bmi, height) {
		//Calculate weight given bmi and height
		return (bmi*height*height) / 703;
	},

	bmiToWeightMetric: function(bmi, height) {
		return (bmi*height*height);
	},

	kilogramsToPounds: function(kg) {
		return kg * 2.20462;
	},

	poundsToKilograms: function(lbs) {
		return lbs * 0.453592;
	},

	inchesToMeters: function(inches) {
		return inches * 0.0254;
	},

	metersToInches: function(meters) {
		return meters * 39.3701;2
	},

	getWeightCategory: function(bmi) {
		//Calculate obesity category for given bmi
		var ranges = data.obesity_ranges
			, range;
		for(var i = 0; i < ranges.length; i++) {
			range = ranges[i]
			if(this.inRange(range.min, range.max, bmi))
				return range.name;
		}
		return "Impossible";
	},

	inRange: function(min, max, value) {
		//INCLUSIVE in-range function
		return value >= min && value <= max;
	},

	obesityPlotBands: function(height) {
		//Given a height, calculates and returns the obesity weight ranges
		var ranges = data.obesity_ranges
				, bands = []
				, colors = ['#bbb', '#ccc', '#bbb', '#aaa', '#999', '#888'].reverse()
				, range;
		for(var i = 0; i < ranges.length; i++) {
			range = ranges[i];
			bands.push({
				id: 'plot-band',
				from: this.bmiToWeight(range.min, height),
				to: this.	bmiToWeight(range.max, height),
				color: colors[i],
				label : {
					text: range.name,
					style: {
						color: '#555'
					}
				}
			});	
		}
		return bands;
	},

	greaterLesserArray: function(series) {
		//Given an array of numbers (length n), returns an array (length n) composed of objects of the form {greater: int, lesser: int, same: int}
		//representing the total sum of digits before, at, and after each data number
		//Ex. [1,4,5] => [{greater: 9, lesser: 0, same: 1}, {greater: 5, lesser: 1, same: 4}, {greater: 0, lesser: 5, same: 5}]
		var running_total = 0
			, greater_lesser = new Array();

		for(var i = 0; i < series.length; i++) {
			greater_lesser[i] = {lesser: running_total, same: series[i]};
			running_total += series[i];
		}

		for(var i = 0; i < series.length; i++) {
			greater_lesser[i].greater = running_total - series[i]
			running_total -= series[i];
		}

		return greater_lesser;
	},

	percentageArray: function(population, series) {
		var percentages = [];
		for(var i = 0; i < series.length; i++) {
			percentages[i] = series[i]/population;
		}
		return percentages;
	},

	totalPopulation: function(series) {
		//Sums up the series
		var total = 0;
		for(var i = 0; i < series.length; i++) {
			total += series[i];
		}
		return total;
	},
	
	addCommas: function(nStr)
	{
		nStr += '';
		var x = nStr.split('.')
			, x1 = x[0]
			, x2 = x.length > 1 ? '.' + x[1] : ''
			, rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}
}

data = {
	obesity_ranges: [
		{
			name: 'Morbidly Obese',
			min: 40,
			max: 100
		},
		{
			name: 'Extremely Obese',
			min: 35,
			max: 40
		},
		{
			name: 'Obese',
			min: 30,
			max: 35
		},
		{
			name: 'Overweight',
			min: 25,
			max: 30
		},
		{
			name: 'Normal',
			min: 18.5,
			max: 25
		},
		{
			name: 'Underweight',
			min: 0,
			max: 18.5
		}
	]
}

