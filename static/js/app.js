// build the metadata panel
function buildMetadata(sampleData) {
  d3.json("../../Data/JSON/flights.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sampleData);

    // Use d3 to select the panel with id of `#sample-metadata`
    let result = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    result.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(resultArray[0]).forEach(([key, value]) => {
      result.append('h6').text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(flightData) {
  d3.json("../../Data/JSON/flights.json").then((data) => {
    
    // Get the samples field
    let flights = data.flights;

    // Filter the samples for the object with the desired sample number
    let resultArray = flights.filter(sampleObj => sampleObj.id == flightData);

    // Get the fares
    let fare = resultArray[0].fare;
    let large_fare = resultArray[0].fare_lg;
    let low_fare = resultArray[0].fare_low;

    // Get the time of year
    let year = resultArray[0].Year;
    let quarter = resultArray[0].quarter;

    // Map the fare to the y-axis
    let yticks = fare.slice(0, 10).map(d => `£${d}`).reverse();

    // Build a Fare Chart
    let fare_chart = {
      mode: 'bar',
      x: quarter,
      y: fare,
      text: fare,
      yaxis: {
        title: 'Fares'
      }
    }

    // Render the Fare Chart
    let fare_data = [fare_chart];
    let fare_layout = {
      title: 'Fares Per Quarter',
      showlegend: false,
      height: 600,
      width: 1200,
      yaxis: {
        title: 'Fares'
      }
    }
    Plotly.newPlot('bar', fare_data, fare_layout);
  });
};

function init() {
  d3.json("../../Data/JSON/flights.json").then((data) => {
    console.log(data);
    // Get the names of the Airlines
    let airlines = data.carrier_lg;

    // Use d3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Append the list of Airlines to the dropdown menu
    airlines.forEach((airline) => {
      dropdownMenu.append("option").property("value", airline).text(airline);
    });
    
    // Get the first sample to build the initial plots
    let firstSample = airlines[0];

    // Build the metadata panel
    buildMetadata(firstSample);
  });
}

// Function to run on change of the dropdown menu
function optionChanged(newData) {
  // Build charts and metadata panel with new data
  buildMetadata(newData);
}

// Initialize the dashboard
init();