// build the data panel
function buildData(sampleData) {
  let years = sampleData.map((year) => year.Year);

  // Sort the years in descending order and eliminate duplicates
  years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
  
  // Sort the years in descending order and eliminate duplicates
  years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
  
  // Airline Market Share
  let airline_market_share = {}
  sampleData.forEach(flight => {
    if (airline_market_share[flight.carrier_lg]) {
      airline_market_share[flight.carrier_lg] += 1;
    } else {
      airline_market_share[flight.carrier_lg] = 1;
    }
  });

  // Airline Flights
  let airline_flights = {}
  sampleData.forEach(flight => {
    if (airline_flights[flight.carrier_lg]) {
      airline_flights[flight.carrier_lg] += 1;
    } else {
      airline_flights[flight.carrier_lg] = 1;
    }
  })
  
  // Airline Passengers
  let airline_passengers = {}
  sampleData.forEach(flight => {
    if (airline_passengers[flight.carrier_lg]) {
      airline_passengers[flight.carrier_lg] += flight.passengers;
    } else {
      airline_passengers[flight.carrier_lg] = flight.passengers;
    }
  });
  buildPieCharts(airline_market_share, "marketShare");
  buildBarCharts(airline_flights, "totalFlightsByAirline");
  buildBarCharts(airline_passengers, "passengers");
}

// function to build bar charts
function buildBarCharts(flightData, location) {
  console.log(flightData);
  trace = {
    x: Object.keys(flightData),
    y: Object.values(flightData),
    type: 'bar'
  };
  
  Plotly.newPlot(location, [trace]);
};

// function to build pie charts
function buildPieCharts(flightData, location) {
  console.log(flightData);
  trace = {
    labels: Object.keys(flightData),
    values: Object.values(flightData),
    type: 'pie'
  };
  
  Plotly.newPlot(location, [trace]);
};

function init() {
  d3.json("../../Data/JSON/flights.json").then((data) => {
    // Get the years from the data
    let years = data.map((year) => year.Year);
    
    // Use d3 to select the dropdown menus
    let yeardropdownMenu = d3.select("#yearSelector");
    // let airlinedropdownMenu = d3.select("#airlineSelector");

    // Sort the years in descending order and eliminate duplicates
    years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
    
    // Append the list of years to the dropdown menu
    years.forEach((year) => {
      yeardropdownMenu.append("option").property("value", year).text(year);
    });
    
    // Sort the data by year
    let firstYear = years[0];
    let filteredData = data.filter((year) => year.Year == firstYear);
    
    // Build the metadata panel
    buildData(filteredData);
  });
}

// Function to run on change of the dropdown menu
function optionChanged(year) {
  // Filter the data by the selected year
  d3.json("../../Data/JSON/flights.json").then((data) => {
    let newData = data.filter((flight) => flight.Year == year);
    // Build charts and metadata panel with new data
    console.log(newData);
    buildData(newData);
  });
};

// Initialize the dashboard
init();