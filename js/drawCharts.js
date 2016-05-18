// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  $.get("../csv/chart1.csv", function(csvString) {
    // transform the CSV string into a 2-dimensional array
    var arrayData = csvString.split("\n").map(function(x){return(x.split(","))});
    for (i=1; i<arrayData.length; i++){
      arrayData[i][1] = Number(arrayData[i][1]);
    }

    // .map(function(z){return([z[0], Number(z[1])])}))});//$.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);


    // Create the data table.
    // var data = new google.visualization.DataTable();
    // data.addColumn('string', 'Topping');
    // data.addColumn('number', 'Slices');
    // data.addRows([
    //   ['Mushrooms', 3],
    //   ['Onions', 1],
    //   ['Olives', 1],
    //   ['Zucchini', 1],
    //   ['Pepperoni', 2]
    // ]);

    // Set chart options
    var options = {
      'title':'Title',
      'width':400,
      'height':300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.BarChart(document.getElementById('chart1-div'));
    chart.draw(data, options); 
  })
}