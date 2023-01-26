mapboxgl.accessToken =
  "pk.eyJ1IjoiZXJpa3JlbmdsaXNoIiwiYSI6ImNqNXdnZDdnNTBlMDcyd3FzNHg5YjNsN3kifQ.kDgqHDJ00xCjvUXy8x57UA";

var map = new mapboxgl.Map({
  container: "map-bwc",
  style: "mapbox://styles/erikrenglish/cld2u5psx002h01lrekqowwwp",
  projection: "equalEarth",
  renderWorldCopies: false,
  center: [10, 10],
  zoom: 0.5,
  interactive: false
});

//initialize mapgeodata

map.on("load", function () {
  map.resize();
});

//this is the BSL-4 data layer
map.on(
  "style.load",
  (initLayers = () => {
    //ACTIVITY GEOJSON

    map.addLayer({
      id: "country-label",
      type: "fill",
      source: "country-label",
      layout: {
        // Make the layer visible by default.
        visibility: "visible"
      }
    });

    map.addLayer({
      id: "activity",
      type: "fill",
      source: "activity",
      layout: {
        // Make the layer visible by default.
        visibility: "visible"
      }
    });

    //Historical GEOJSON

    map.addLayer({
      id: "historical",
      type: "fill",
      source: "historical",
      layout: {
        // Make the layer visible by default.
        visibility: "none"
      },
      paint: {
        "fill-color": "#f84444",
        "fill-opacity": 0.5
      },
      "source-layer": "historical"
    });

    //Treaty GEOJSON

    map.addLayer({
      id: "treaty",
      type: "fill",
      source: "treaty",
      layout: {
        // Make the layer visible by default.
        visibility: "none"
      },
      paint: {
        "fill-color": "#f84444",
        "fill-opacity": 0.5
      },
      "source-layer": "treaty"
    });
  })
);

// scorecards

// Change the scorecard style

function updateScorecard() {
  //Activity
  if (document.getElementById("activity").checked) {
    map.setLayoutProperty("activity", "visibility", "visible");
    document.getElementById("leg-act").style.visibility = "visible";
    document.getElementById("act-fast").style.display = "inline";
  } else {
    map.setLayoutProperty("activity", "visibility", "none");
    document.getElementById("leg-act").style.visibility = "hidden";
    document.getElementById("act-fast").style.display = "none";
  }

  //Historical

  if (document.getElementById("historical").checked) {
    map.setLayoutProperty("historical", "visibility", "visible");
    document.getElementById("leg-his").style.display = "inline";
    document.getElementById("his-fast").style.display = "inline";
  } else {
    map.setLayoutProperty("historical", "visibility", "none");
    document.getElementById("leg-his").style.display = "none";
    document.getElementById("his-fast").style.display = "none";
  }

  //Treaty

  if (document.getElementById("treaty").checked) {
    map.setLayoutProperty("treaty", "visibility", "visible");
    document.getElementById("leg-trt").style.display = "inline";
    document.getElementById("trt-fast").style.display = "inline";
  } else {
    map.setLayoutProperty("treaty", "visibility", "none");
    document.getElementById("leg-trt").style.display = "none";
    document.getElementById("trt-fast").style.display = "none";
  }
}

//Optimize for mobile?

if (window.Touch) {
  /* JavaScript for your touch interface */
}

// QUERY RENDERED FEATURES

const namDisplay = document.getElementById("country");
const actDisplay = document.getElementById("act-fast");
const hisDisplay = document.getElementById("his-fast");
const trtDisplay = document.getElementById("trt-fast");

let CountryID = null;

map.on("mousemove", ["activity", "historical", "treaty"], (event) => {
  //change mouse pointer

  map.getCanvas().style.cursor = "pointer";

  // Set constants equal to the current feature's score

  const namScore = event.features[0].properties.Name;
  const actScore = event.features[0].properties.activity;
  const hisScore = event.features[0].properties.historical;
  const trtScore = event.features[0].properties.treaty;

  // Check whether features exist

  if (event.features.length === 0) return;

  // Display the status in the navbar

  namDisplay.textContent = namScore;
  actDisplay.textContent = actScore;
  hisDisplay.textContent = hisScore;
  trtDisplay.textContent = trtScore;

  if (CountryID) {
    map.removeFeatureState({
      id: CountryID
    });
  }

  CountryID = event.features[0].Name;

  // When the mouse moves over the earthquakes-viz layer, update the
  // feature state for the feature under the mouse
  map.setFeatureState(
    {
      id: CountryID
    },
    {
      hover: true
    }
  );
});

map.on("mouseleave", ["activity", "historical", "treaty"], () => {
  if (CountryID) {
    map.setFeatureState(
      {
        id: CountryID
      },
      {
        hover: false
      }
    );
  }

  CountryID = null;
  // Remove the information from the previously hovered feature from the sidebar
  namDisplay.textContent = "";
  actDisplay.textContent = "";
  hisDisplay.textContent = "";
  trtDisplay.textContent = "";

  // Reset the cursor style
  map.getCanvas().style.cursor = "";
});
