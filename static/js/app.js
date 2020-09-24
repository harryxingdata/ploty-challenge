/////////////////////////////////////////////////////////////////////////////////////////////////////
// function1: show bar chart
/////////////////////////////////////////////////////////////////////////////////////////////////////
function showbarChart(sample, name) {
  //lookup the data by experiment name 
  var sampleResult = sample.filter(item => item.id === name)[0];
  // Json 
  //   {
  //     sampleValues: 
  //     otuId:
  //     otuLabel:
  //   }

  // rowData list for json data struction
  var rowDataList = [];

  //loop all experiment record for the certain id
  for (var i = 0; i < sampleResult.otu_ids.length; i++) {
    //create a json dict and push it into list
    newDict = {
      sampleValues: sampleResult.sample_values[i],
      otuId: sampleResult.otu_ids[i],
      otuLabel: sampleResult.otu_labels[i]
    }
    rowDataList.push(newDict)
  }
  // Sorted json by the sampleValues
  var sortedList = rowDataList.sort((a, b) => b.sampleValues - a.sampleValues);

  // get the top ten json data
  var showData = sortedList.slice(0, 10)
  //create trace for display
  var traceDisplay1 = [{
    // x value 
    x: showData.map(item => item.sampleValues).reverse(),
    // y value 
    y: showData.map(item => 'OTU ' + item.otuId).reverse(),
    // set y value as the lable 
    labels: showData.map(item => 'OTU ' + item.otuId).reverse(),
    //show label for text display 
    text: showData.map(item => item.otuLabel).reverse(),
    //show bar chart
    type: "bar",
    //set the orient
    orientation: "h"
  }];
  // Bar layout
  var disPlayLayout1 = {
    title: { text: "The top 10 OTUs" },
    autosize: false,
    height: 400,
    width: 400,
    margin: {
      l: 100,
      r: 10,
      b: 20,
      t: 30,
      pad: 0
    },
    showlegend: false
  };
  //Plotly to plot bar chart layout 
  Plotly.newPlot("bar", traceDisplay1, disPlayLayout1, { displayModeBar: false });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function1: End
/////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////
// function2: bubble chart
/////////////////////////////////////////////////////////////////////////////////////////////////////

function showbubbleChart(sample, name) {

  //lookup the data by experiment name 
  var sampleResult = sample.filter(item => item.id === name)[0];

  //create a trace bubble
  var traceDisplay2 = [{
    x: sampleResult.otu_ids, //X axis, show experiment ID
    y: sampleResult.sample_values, //Y axis, show experiment result
    text: sampleResult.otu_labels, // show dynamic info on the bar
    mode: 'markers',
    marker: {
      size: sampleResult.sample_values, // the size of the bubble by the value of experiment 
      color: sampleResult.sample_values.map(element => element * 100),
    }
  }];

  // BUbble chart layout 
  var disPlayLayout2 = {
    height: 700,
    width: 1200,
    xaxis: { title: "OTU ID" }
  };
  // bubble chart layout
  Plotly.newPlot('bubble', traceDisplay2, disPlayLayout2);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function2: End
/////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////
// function3: show Gauge chart
/////////////////////////////////////////////////////////////////////////////////////////////////////

function showGauge(metadata, name) {

  //lookup the data by experiment name 
  var sampleMeta = metadata.filter(m => m.id === parseInt(name));

  var traceGauge = [
    {
      // setup gauge type
      type: "indicator",
      mode: "gauge+number+delta",
      // setup the value of indicator
      value: sampleMeta[0].wfreq,
      // setup the display title
      title: { text: "Belly Button Wash Frequency (Scrubs Per Week)",
            font: { size: 18, color: 'black' }},
      delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        //setup gauge color
        steps: [
          { range: [0, 1], color: "#009a60" },
          { range: [1, 2], color: '#4aa84e' },
          { range: [2, 3], color: '#92b73a' },
          { range: [3, 4], color: '#c6bf22' },
          { range: [4, 5], color: '#edbd02' },
          { range: [5, 6], color: '#ffad00' },
          { range: [6, 7], color: '#ff8c00' },
          { range: [7, 8], color: '#fc6114' },
          { range: [8, 9], color: '#f43021' }

        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }
  ];

  var layout = {
    width: 500,
    height: 400,
    margin: { t: 0, r: 25, l: 25, b: 25, pad: 0 },

    paper_bgcolor: "white",
    font: { color: "darkblue", family: "Arial" }
  };

  Plotly.newPlot('gauge', traceGauge, layout);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// function3 : end
/////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////



function showInfo(metadata, name) {

  console.log(metadata)
  var sampleMeta = metadata.filter(m => m.id === parseInt(name));

  console.log(sampleMeta)

  var selection = d3.select("#sample-metadata").selectAll("div").data(sampleMeta);
  // Populated the Demographic Information into the box with sample metadata information
  selection.enter()
    .append("div")
    .merge(selection)
    .html(function (d) {
      return `<p>id: ${d.id}</p>
        <p>ethnicity: ${d.ethnicity}</p>
        <p>gender: ${d.gender}</p>
        <p>age: ${d.age}</p>
        <p>location: ${d.location}</p>
        <p>bbtype: ${d.bbtype}</p>
        <p>wfreq: ${d.wfreq}</p>`
    });
  // Removed old data //
  selection.exit().remove();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////

// program entrance

/////////////////////////////////////////////////////////////////////////////////////////////////////
// retrieve data from json file and update dropdown menu
d3.json("data/samples.json").then((dataset) => {
  var selectDrop = d3.select("#selDataset");
  selectDrop.selectAll('option')
    .data(dataset.names.map(item => "BB_" + item))
    .enter().append('option')
    .text(text => text)

  //retrieve lab test lable list from dataset
  var names = dataset.names;

  //retrieve lab sample data from dataset
  var sample = dataset.samples;

  //retrieve lab metadata data from dataset
  var metadata = dataset.metadata;


  //show the first lab data's bar and bubble chart
  showbarChart(sample, names[0])
  //show the first lab's data info
  showInfo(metadata, names[0])
  //show the first lab data's Gauge chart
  showGauge(metadata, names[0])

  // updateMetadata(6)

  //show the first bubble chart
  showbubbleChart(sample, names[0])

  selectDrop.on("change", triggerDropdownList);
  // The event handler function triggerDropdownList()
  function triggerDropdownList() {
    // Stopped refreshing with .prevent
    d3.event.preventDefault();
    // Select the inputElement
    var inputElement = d3.select("select");
    // Acquire the value property of the inputEelement and remove BB_.
    var userSample = inputElement.property("value").replace('BB_', '');

    //show the bar and bubble chart
    showbarChart(sample, userSample);
    //show data info
    showInfo(metadata, userSample)
    //show Gauge chart
    showGauge(metadata, userSample)
    //show bubble chart
    showbubbleChart(sample, userSample)
  }


});
