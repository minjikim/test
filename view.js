view = {
	submitData: function() {
		//Submits the form data and retrieves calculations
		controller.retrieveCalculations(this.getFormData(), this.displayDataCallback);
		this.clearChart();
		session.reset();
	},

	displayDataCallback: function(series_data) {
		//Renders all of the relevant sections for the given data

		for(year in series_data) {
			session.addSeries(year, series_data[year])
			chart.addSeries({name: year, data: session.years[year].percentages})
		}

		//session.calculateSessionData(series_data);
		view.addObesityPlotBands(view.getFormHeight());
		view.addUserPlotLine($('#weight').val());
		view.addContext();
		view.addYearKey();
	},

	addObesityPlotBands: function(height) {
		//Addsthe obesity plot lines to the chart given the user's height
		var bands = lib.obesityPlotBands(height);		
		for(var i = 0; i < bands.length; i++)
			chart.xAxis[0].addPlotBand(bands[i]);
	},

	addUserPlotLine: function(weight) {
		//Adds a plot line to the chart given the user's weight
		chart.xAxis[0].addPlotLine({
      value: weight,
      color: '#885454',
      dashStyle: 'shortdash',
      width: 8,
      id: 'personal-weight',
      label : {
        text : 'YOU',
        verticalAlign: 'bottom',
        align: 'right',
        x: 15,
        y: -45,
        style: {
          'font-size' : 15
        }
      }
    });
	},

	getFormData: function() {
		//Returns a serialized array of the user's input from the html form
		var data = {
			g: $('#gender').val(),
			a: $('#age').val(),
			r: $('#race').val(),
			y: 2010,
			w: $('#weight').val(),
			h: this.getFormHeight()
		}
		return data;
	},
	
	getFormHeight: function() {
		//Returns the form height based on specified feet and inches
		return parseInt($('#feet').val()) * 12 + parseInt($('#inches').val())
	},

	clearChart: function() {
		//chart.destroy();
		//chart = chart = new Highcharts.Chart(chart_options);
		chart.counters.color = 0;
		chart.xAxis[0].removePlotBand('personal-weight');
		chart.xAxis[0].removePlotBand('plot-band');
		while(chart.series.length > 0)
    	chart.series[0].remove(true);

	},
	tooltipCallback: function() {
		view.updatePeerGroupStatistics(this.series.name, this.x, this.y)
		return this.x + ' lbs';
	},

	updatePeerGroupStatistics: function(year, x, y) {
		//callback for hovering over the data that updates the statistics above the data 

		var same_weight = session.numberSame(year, y)
			,	heavier_than = session.percentMoreThan(year, x) + '%'
			, lighter_than = session.percentLessThan(year, x) + '%';
		var context = {
				stats: [
					{value: lighter_than, label: 'weigh less'},
					{value: same_weight, label: 'weigh the same'},					
					{value: heavier_than, label: 'weigh more'}
				]
			}

		$('#year_key #year_' + year).removeClass('selected');
		$('#year_key .year').not('#year_' + year).addClass('selected');

		var html = view.templates.peer_group_statistics(context)
			, $statistics = $(html)
		 	,	$peer_group_comparison = $('#peer_group_comparison');

		if($peer_group_comparison.children('.information').length > 0) {
			$('#peer_group_comparison .information').animate({opacity: 0}, 'fast', function() {
				$peer_group_comparison.html($statistics.hide());
				$peer_group_comparison.children('.statistics').fadeIn('fast');	
			});
		} else {
			$peer_group_comparison.html($statistics);
		}
		
	},

	updateSliderValue: function(event, object) {
		//Update the shown values when a slider is changed
		$slider = $(this);
		$input_picker = $slider.parents('.input-picker');
		$input_picker.find('.value').text(object.value);
		$input_picker.find('input').val(object.value);
	},

	closeSlider: function(event, object) {
		$picker = $(this).parents('.input-picker');
		$picker.removeClass('open');
	},

	addContext: function() {
		$('#context').html('');
		view.addPeerGroupContext();
		view.addIndividualContext();
	},

	addPeerGroupContext: function() {
		var context = {
			value: parseInt(session.years['2010'].population),
			label: 'people like you',
			description: 'people of the same gender, age, race, and height'
		}
		var html = view.templates.context(context);
		$('#context').append(html);
	},

	addIndividualContext: function() {
		var weight = $('#weight').val() * 1
			, height = view.getFormHeight()
			, bmi = lib.bmi(weight, height).toFixed(1)

		var bmiContext = {
			value: bmi,
			label: 'bmi',
			description: 'body mass index, based on height and weight'
		}
		
		var categoryContext = {
			value: lib.getWeightCategory(bmi).toLowerCase(),
			label: 'Weight Category'
		}
		
		$('#context').append( view.templates.context(bmiContext) );
		$('#context').append( view.templates.context(categoryContext) );
	},

	addYearKey: function() {
		context = {
			years: []
		}
		for(year in session.years) {
			context.years.push({ year: year, color: session.colors[context.years.length] })
		}
		$('#year_key').html(view.templates.year_key_template(context))
	},

	mouseOutOfGraph: function() {
		$('#peer_group_comparison .statistics').animate({opacity: 0}, 'fast', function() {
			var $information = $('<div class="information">Mouse over the graph to view weight information.</div>').hide();
			$('#peer_group_comparison').html($information);
			$('#peer_group_comparison .information').fadeIn('fast');
		});
		$('#year_key .year').removeClass('selected');
	}
}


view.templates = {
	peer_group_statistics: Handlebars.compile( $('#peer_group_statistics_template').html() ),
	peer_group_context: Handlebars.compile( $('#peer_group_context_template').html() ),
	context: Handlebars.compile( $('#context_template').html() ),
	year_key_template: Handlebars.compile( $('#year_key_template').html() )
}