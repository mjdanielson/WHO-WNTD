mapboxgl.accessToken =
  'pk.eyJ1IjoiZ3VlcnJhamEiLCJhIjoiY2thb3lycnl2MDR2MDJxbXNycDBxcTN0YyJ9.EJTNb6w2Q3_7VmdUEIbRXA';
var map = new mapboxgl.Map({
  container: 'map', //map container
  style: 'mapbox://styles/guerraja/ckaplkkug0n4r1imsv93k559z', // Mapbox style
  center: [34.7, 15.5], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

var countryName = document.getElementById('country');
var percentages = document.getElementById('percentagesList');

var select = document.querySelector('#layer-select');
select.onchange = toggleLayers;
var activeLayer = select.value;

var fourFields = ['4b-total-p', '4b-boy-per', '4b-girl-pe'];
var threeFields = ['3b-total-p', '3b-boy-per', '3b-girl-pe'];
var twoFields = ['2b-total-p', '2b-boy-per', '2b-girl-pe'];
var layerKey = {
  'Offered free tobacco': {
    values: [
      'Less than 3.0%',
      '3.1 - 6.0%',
      '6.1 - 9.0%',
      '9.1 - 13.0%',
      'More than 13.0%',
      'Data not available',
    ],
    colors: ['#FFF28B', '#DAA613', '#D45313', '#9D1319', '#780C22', '#ffffff'],
    title: [
      'Youths 13-15 ever offered a free cigarette by a tobacco company representative',
    ],
  },

  'Favored smoke-free places': {
    values: [
      'Less than 45.0%',
      '45.1 - 63.0%',
      '63.1 - 76.0%',
      '76.1 - 86.0%',
      'More than 86.0%',
      'Data not available',
    ],
    colors: ['#72E6E2', '#38C5D1', '#09A7C3', '#1B88A9', '#30678D', '#ffffff'],
    title: ['Youths 13-15 favored banning smoking in enclosed public places'],
  },

  'Object with tobacco logo': {
    values: [
      'Less than 8.0%',
      '8.1 - 12.0%',
      '12.1 - 15.0%',
      '15.1 - 20.0%',
      'More than 20.0%',
      'Data not available',
    ],
    colors: ['#FFF28B', '#DAA613', '#D45313', '#9D1319', '#780C22', '#ffffff'],
    title: ['Youths 13-15 had object with a cigarette or tobacco logo on it'],
  },
};

map.on('load', function () {
  buildLegend(activeLayer);
  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    var total, girl, boy;

    // grab the first available layer built on the stats layer
    var statsLayer = features.filter(
      (item) => item.sourceLayer === 'WHO_WNTD_Indicators-9tb9u9'
    )[0];

    if (statsLayer) {
      var country = statsLayer.properties['GEOUNIT'];
      if (activeLayer === 'Object with tobacco logo') {
        total = statsLayer.properties[fourFields[0]];
        boy = statsLayer.properties[fourFields[1]];
        girl = statsLayer.properties[fourFields[2]];
      }

      if (activeLayer === 'Favored smoke-free places') {
        total = statsLayer.properties[threeFields[0]];
        boy = statsLayer.properties[threeFields[1]];
        girl = statsLayer.properties[threeFields[2]];
      }

      if (activeLayer === 'Offered free tobacco') {
        total = statsLayer.properties[twoFields[0]];
        boy = statsLayer.properties[twoFields[1]];
        girl = statsLayer.properties[twoFields[2]];
      }

      // fix undefined, could do above but cleaner
      total = total ? total : 'Data not available';
      boy = boy ? boy : 'Data not available';
      girl = girl ? girl : 'Data not available';
      percentages.innerHTML = `<p><b> Percent Total:</b> ${total} </p> <p><b>Percent Boys:</b> ${boy}</p> <p><b>Percent Girls:</b> ${girl}</p>`;
    } else {
      // No features found, do nothing (or clear statistics);
      percentages.innerHTML = '';
      country = '&nbsp;';
    }
    countryName.innerHTML = country;
  });
});

function toggleLayers(e) {
  // console.log(e.target.value);
  var clickedLayer = e.target.value;
  map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
  buildLegend(clickedLayer);
  map.setLayoutProperty(activeLayer, 'visibility', 'none');
  activeLayer = clickedLayer;
}

function buildLegend(clickedLayer) {
  var values = layerKey[clickedLayer].values;
  var colors = layerKey[clickedLayer].colors;
  var title = layerKey[clickedLayer].title;

  var items = '';
  var legend = document.getElementById('legend');
  var variableTitle = document.getElementById('indicator');
  variableTitle.innerHTML = title;

  for (i = 0; i < values.length; i++) {
    var indicator = values[i];
    var color = colors[i];

    var key = `<span class='legend-key' style='background-color:${color}'></span>`;
    var value = `<span class='legend-value'>${indicator}</span>`;
    var item = `<div>${key}${value}</div>`;
    items += item;
  }
  legend.innerHTML = items;
}
