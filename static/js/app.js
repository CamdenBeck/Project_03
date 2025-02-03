// build the data panel
function buildData(sampleData) {
  let years = sampleData.map((year) => year.Year);

  // Sort the years in descending order and eliminate duplicates
  years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
  
  // Sort the years in descending order and eliminate duplicates
  years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
  
  // Airline Flights
  let airline_flights = {}
  sampleData.forEach(flight => {
    if (airline_flights[flight.carrier_lg]) {
      airline_flights[flight.carrier_lg] += 1;
    } else {
      airline_flights[flight.carrier_lg] = 1;
    }
  })
  
  // Airline Flight Share
  let airline_flight_share = {}
  sampleData.forEach(flight => {
    if (airline_flight_share[flight.carrier_lg]) {
      airline_flight_share[flight.carrier_lg] += 1;
    } else {
      airline_flight_share[flight.carrier_lg] = 1;
    }
  });

  // Airline Passengers
  let airline_passengers = {}
  sampleData.forEach(flight => {
    if (airline_passengers[flight.carrier_lg]) {
      airline_passengers[flight.carrier_lg] += flight.passengers;
    } else {
      airline_passengers[flight.carrier_lg] = flight.passengers;
    }
  });
  
  // Airline Passenger Share
  let airline_passenger_share = {}
  sampleData.forEach(flight => {
    if (airline_passenger_share[flight.carrier_lg]) {
      airline_passenger_share[flight.carrier_lg] += flight.passengers;
    } else {
      airline_passenger_share[flight.carrier_lg] = flight.passengers;
    }
  });

  buildBarCharts(airline_flights, "totalFlightsByAirline");
  buildPieCharts(airline_flight_share, "flightShareByAirline");
  buildBarCharts(airline_passengers, "passengers");
  buildPieCharts(airline_passenger_share, "passengerShareByAirline");
};

// function to build airline data panel
function buildAirlineData(sampleData) {
  let airlines = sampleData.map((airline) => airline.carrier_lg);

  // Sort the airlines in frequency order and eliminate duplicates
  airlines = airlines.sort().reverse().filter((airline, index) => airlines.indexOf(airline) === index);
  
  // Sort the years in frequency order and eliminate duplicates
  airlines = airlines.sort().reverse().filter((airline, index) => airlines.indexOf(airline) === index);
  
  // Average Flights per quarter
  let flights_per_quarter = {}
  sampleData.forEach(flight => {
    if (flights_per_quarter[flight.quarter]) {
      flights_per_quarter[flight.quarter] += 1;
    } else {
      flights_per_quarter[flight.quarter] = 1;
    }
  });
  
  // Passengers per quarter
  let passengers_per_quarter = {}
  sampleData.forEach(flight => {
    if (passengers_per_quarter[flight.quarter]) {
      passengers_per_quarter[flight.quarter] += flight.passengers;
    } else {
      passengers_per_quarter[flight.quarter] = flight.passengers;
    }
  });

  
  // Fares per quarter
  let fares_per_quarter = {}
  sampleData.forEach(flight => {
    if (fares_per_quarter[flight.quarter]) {
      fares_per_quarter[flight.quarter] += flight.fare;
    } else {
      fares_per_quarter[flight.quarter] = flight.fare;
    }
  });

  // Total flights per year
  let total_flights = {}
  sampleData.forEach(flight => {
    if (total_flights[flight.Year]) {
      total_flights[flight.Year] += 1;
    } else {
      total_flights[flight.Year] = 1;
    }
  });

  buildBarCharts(flights_per_quarter, "flightsByQuarter");
  buildBarCharts(passengers_per_quarter, "passengersByQuarter");
  buildBarCharts(fares_per_quarter, "faresByQuarter");
  buildLineCharts(total_flights, "flightsByYear")
};

// function to build bar charts
function buildBarCharts(flightData, location) {
  trace = {
    x: Object.keys(flightData),
    y: Object.values(flightData),
    type: 'bar'
  };
  
  Plotly.newPlot(location, [trace]);
};

// function to build pie charts
function buildPieCharts(flightData, location) {
  trace = {
    labels: Object.keys(flightData),
    values: Object.values(flightData),
    type: 'pie'
  };
  
  Plotly.newPlot(location, [trace]);
};

// function to build line charts
function buildLineCharts(flightData, location) {
  trace = {
    x: Object.keys(flightData),
    y: Object.values(flightData),
    type: 'line'
  };
  layout = {
    xaxis: {
      tickmode: 'linear',
      dtick: 1
    }
  };
  
  Plotly.newPlot(location, [trace], layout);
};

function init() {
  d3.json("../Data/JSON/flights.json").then((data) => {
    // Get the years from the data
    let years = data.map((flight) => flight.Year);
    
    // Use d3 to select the dropdown menus
    let yeardropdownMenu = d3.select("#yearSelector");

    // Sort the years in descending order and eliminate duplicates
    years = years.sort().reverse().filter((year, index) => years.indexOf(year) === index);
    
    // Append the list of years to the dropdown menu
    years.forEach((year) => {
      yeardropdownMenu.append("option").property("value", year).text(year);
    });
    
    // Sort the data by year
    let firstYear = years[0];
    let filteredData = data.filter((flight) => flight.Year == firstYear);

    // Get the airlines from the data in that year
    let airlines = filteredData.map((flight) => flight.carrier_lg);

    // Use d3 to select the dropdown menus
    let airlinedropdownMenu = d3.select("#airlineSelector");

    // Sort the airlines in frequency order and eliminate duplicates
    airlines = airlines.sort().reverse().filter((airline, index) => airlines.indexOf(airline) === index);

    // Append the list of airlines to the dropdown menu
    airlines.forEach((airline) => {
      airlinedropdownMenu.append("option").property("value", airline).text(airline);
    });

    // Sort the data by airline
    let firstAirlines = airlines[0];
    let filteredAirlineData = data.filter((flight) => flight.carrier_lg == firstAirlines);

    // Build the metadata panel
    buildData(filteredData);
    buildAirlineData(filteredAirlineData);
  });
}

// Function to run on change of the dropdown menu
function optionChanged() {
  // Get the selected year and airline from the dropdown menus
  let selectedYear = d3.select("#yearSelector").property("value");
  let selectedAirline = d3.select("#airlineSelector").property("value");

  // Filter the data by the selected year and airline
  d3.json("../Data/JSON/flights.json").then((data) => {
    let filteredByYear = data.filter((flight) => flight.Year == selectedYear);
    let filteredByAirline = data.filter((flight) => flight.carrier_lg == selectedAirline);

    // Build charts and metadata panel with new data
    buildData(filteredByYear);
    buildAirlineData(filteredByAirline);
  });
};

// Initialize the dashboard
init();