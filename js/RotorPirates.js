// Ported to JS by Robert Miroszewski based on awesome work by Chris Simpson ;)


// defaults

// BF
bfRate=1
bfSuper=0.7
bfExpo=0

aRate=1
aSuper=0.7
aExpo=0

// BF rate calculation function
var bfcalc = function(rcCommand, rcRate, expo, superRate) {
    var clamp = function(n, minn, maxn) {
        return Math.max(Math.min(maxn, n), minn);
    }

    if(rcRate > 2.0)
        rcRate = rcRate + (14.54 * (rcRate - 2.0))
    if(superRate != 0)
        rcSuperFactor = 1.0 / (clamp(1.0 - (Math.abs(rcCommand) * (superRate)), 0.01, 1.00))
    if(expo != 0)
        rcCommand = rcCommand * Math.abs(rcCommand)**3 * expo + rcCommand * (1.0 - expo)
    angleRate = 200.0 * rcRate * rcCommand;
    if(superRate != 0)
        angleRate *= rcSuperFactor
    return angleRate
}

var acalc = function(rcCommandf, rcRates, rcExpo, rates) {

    var expof = rcExpo;
    rcRates = rcRates * 200.0;
    rates = Math.max(rates, rcRates);

    var superExpoConfig = (((rates / rcRates) - 1) / (rates / rcRates))
    var curve = Math.pow(rcCommandf, 3) * expof + rcCommandf * (1 - expof)
    var rcSuperFactor = 1.0 / (1.0 - (curve * superExpoConfig))
    var angleRate = rcCommandf * rcRates * rcSuperFactor

    return angleRate
}

var reset_button_on_clicked = function() {
    bfrate_slider.reset()
    bfexpo_slider.reset()
    bfsuper_slider.reset()
    arate_slider.reset()
    aexpo_slider.reset()
    asuper_slider.reset()
}

function drawChart() {
    bfRate = parseFloat($('#bfRate').val(), 10);
    bfExpo = parseFloat($('#bfExpo').val(), 10);
    bfSuper = parseFloat($('#bfSuper').val(), 10);
    aRate = parseFloat($('#aRate').val(), 10);
    aExpo = parseFloat($('#aExpo').val(), 10);
    aSuper = parseFloat($('#aSuper').val(), 10);
     console.log(bfRate, bfExpo, bfSuper);

    var ratesData = [];

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Stick Input');
    data.addColumn('number', 'BF');
    data.addColumn('number', 'Quick');

    for (var i = 0; i <= 1; i+=0.01) {
        data.addRow([
            i,
            bfcalc(i, bfRate, bfExpo, bfSuper),
            acalc(i, aRate, aExpo, aSuper),
        ]);
    }

    var i = 1;
    data.addRow([
        i,
        bfcalc(i, bfRate, bfExpo, bfSuper),
        acalc(i, aRate, aExpo, aSuper),
    ]);

    var options = {
        width: 900,
        height: 500,
        titlePosition: 'none',
        curveType: 'function',
        legend: {
            position: 'bottom',
            textStyle: {color: "#888"}
        },
        backgroundColor: { fill:'transparent' },
        hAxis: {
            baselineColor: "#888",
            gridlines: {color: "#888"},
            textStyle: {color: "#888"}
        },
        vAxis: {
            baselineColor: "#888",
            gridlines: {color: "#888"},
            textStyle: {color: "#888"},
            minValue: 0,
            maxValue: 800
        },
        series :{
            2: { color: '#0000ff'},
            1: { color: `#00ff00`}
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  }

$( document ).ready(function() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    $('#bfRateSlider').on('input', function() {
        $('#bfRate').val(this.value).change();
    });
    $('#bfExpoSlider').on('input', function() {
        $('#bfExpo').val(this.value).change();
    });
    $('#bfSuperSlider').on('input', function() {
        $('#bfSuper').val(this.value).change();
    });


    $('#bfRate').on('input', function() {
        $('#bfRateSlider').val(this.value).change();
    });
    $('#bfExpo').on('input', function() {
        $('#bfExpoSlider').val(this.value).change();
    });
    $('#bfSuper').on('input', function() {
        $('#bfSuperSlider').val(this.value).change();
    });

    $('#aRateSlider').on('input', function() {
        $('#aRate').val(this.value).change();
    });
    $('#aExpoSlider').on('input', function() {
        $('#aExpo').val(this.value).change();
    });
    $('#aSuperSlider').on('input', function() {
        $('#aSuper').val(this.value).change();
    });


    $('#aRate').on('input', function() {
        $('#aRateSlider').val(this.value).change();
    });
    $('#aExpo').on('input', function() {
        $('#aExpoSlider').val(this.value).change();
    });
    $('#aSuper').on('input', function() {
        $('#aSuperSlider').val(this.value).change();
    });


    $(".input-field").on("change paste keyup", function() {
        drawChart();
     });
});
