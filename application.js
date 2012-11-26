// application.js contains all handlers setup for the weigh too much project
var chart, chart_options;

chart_options = {
  chart: {
    renderTo: 'chart',
    type: 'spline',
    backgroundColor: '#f2f2f2',
    borderRadius: 0,
    spacingBottom: 30,
    height: 300,
    style: {
      padding: 4
    }
  },
  colors: session.colors,
  tooltip: {
    crosshairs: {color: 'black'},
    formatter: view.tooltipCallback,
    positioner: function (lwidth, lheight, point) {
        return { x: point.plotX + 18, y: 262 };
    },
    borderWidth: 0,
    shadow: false,
    backgroundColor: '#ddd',
    borderRadius: 0,
    style: {
      color: 'black',
      fontSize: '24px',
      padding: 6
    }
  },
  credits: {
    text: null
  },
  title: null,
  xAxis: {
    minorGridLineWidth: 0,
    gridLineWidth: 0,
    alternateGridColor: null,
    tickInterval: 100,
    labels: {
      style: {
        'font-size': '10px'
      }
    }
  },
  yAxis: {
    title: {
      text: '% of people',
      style: {
        color: '#3C4B55'
      }
    },
    labels: {
      formatter: function() {
        return this.value*100;
      }
    },
    min: 0,
    minorGridLineWidth: 0,
    gridLineWidth: 0,
    alternateGridColor: null
  },
  plotOptions: {
    series: {
      pointStart: 75,
      pointInterval: 1,
      events: {
        mouseOut: view.mouseOutOfGraph
      }
    },
    spline: {
      lineWidth: 6,
      states: {
        hover: {
          lineWidth: 8
        }
      },
      marker: {
        enabled: false,
        states: {
          hover: {
            radius: 10
          }
        }
      },
    }
  },
  legend: {
    enabled: false
  }
}

$(function () {



  chart = new Highcharts.Chart(chart_options);

	view.submitData();

  $('#submit').on('click', function(e) {
    view.submitData();
    return false;
  });

  $('.input-picker').on('click', 'a.option', function() {
    $option = $(this);
    $picker = $option.parents('.input-picker');
    $picker.children('input').val($(this).attr('rel'));
    $picker.find('.value').text($(this).attr('data-display'));
    $picker.removeClass('open');
    return false;
  });

  $('#inputs').on('click', '.input-picker .value', function() {
    $('.input-picker').removeClass('open');
    $(this).parents('.input-picker').toggleClass('open');
    return false;
  });

  $('#weight-slider').slider({
    min: 100,
    max: 300,
    value: 150,
    slide: view.updateSliderValue,
    change: view.closeSlider
  });

  $('#age-slider').slider({
    min: 18,
    max: 65,
    value: 21,
    slide: view.updateSliderValue,
    change: view.closeSlider
  });

  $('#chart_overlay').on('mouseover', function() {
    $(this).fadeOut();
  });

});


function createChart() {
	$.get('phpquerypage.php?g=m&a=21&r=w&y=2010&h=72', function(series_data){
		console.log({data: series_data});
		chart.addSeries({data: series_data});
	}, 'json');
}




