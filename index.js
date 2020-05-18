mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94LWNvbW11bml0eSIsImEiOiJjazhrbnF1NWIwMHVjM2Zwbmh2OWs2dTI1In0.O8lasZoOGKUihm-HVEZxaQ';
var map = new mapboxgl.Map({
  container: 'map', //map container
  style: 'mapbox://styles/mapbox-community/cka372tus04oq1imm2rgd636k', // Mapbox style
  center: [34.7, 15.5], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

var countryName = document.getElementById('country');
var percentages = document.getElementById('percentagesList');

var select = document.querySelector('#layer-select');
select.onchange = toggleLayers;
var activeLayer = select.value;

var fourFields = ['4b-total-per', '4b-boy-per', '4b-girl-per'];
var threeFields = ['3b-total-per', '3b-boy-per', '3b-girl-per'];
var twoFields = ['2b-total-per', '2b-boy-per', '2b-girl-per'];
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

// toggleableLayerIds.forEach(function (id) {
//   var link = document.createElement('a');
//   link.href = '#';
//   link.className = 'active';
//   link.textContent = id;

//   link.onclick = toggleLayers;

//   // var percentagesResults = document.getElementById('percentagesList');
//   // var countryTitle = document.getElementById('country');
//   var menu = document.querySelector('.dd-menu');
//   menu.appendChild(link);

//   link.addEventListener('click', function () {
//     var dropDown = document.querySelector('.dd-button');
//     dropDown.innerHTML = link.textContent;
//     percentages.innerHTML = ''
//     countryName.innerHTML = ''
//   });
// });

map.on('load', function () {
  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point);
    var total, girl, boy;

    // grab the first available layer built on the stats layer
    var statsLayer = features.filter(
      (item) => item.sourceLayer === 'WHO-WNTD-indicators-47er43'
    )[0];
    if (statsLayer) {
      var country = statsLayer.properties['GEOUNIT'];
      if (activeLayer === 'Object with tobacco logo') {
        total = statsLayer.properties[fourFields[0]];
        girl = statsLayer.properties[fourFields[1]];
        boy = statsLayer.properties[fourFields[2]];
      }

      if (activeLayer === 'Favored smoke-free places') {
        total = statsLayer.properties[threeFields[0]];
        girl = statsLayer.properties[threeFields[1]];
        boy = statsLayer.properties[threeFields[2]];
      }

      if (activeLayer === 'Offered free tobacco') {
        total = statsLayer.properties[twoFields[0]];
        girl = statsLayer.properties[twoFields[1]];
        boy = statsLayer.properties[twoFields[2]];
      }

      // fix undefined, could do above but cleaner
      total = total ? total : 'Data not available';
      boy = boy ? boy : 'Data not available';
      girl = girl ? girl : 'Data not available';
      percentages.innerHTML = `<p><b> Percent Total:</b> ${total} </p> <p><b>Percent Girls:</b> ${girl}</p> <p><b>Percent Boys:</b> ${boy}</p>`;
    } else {
      // No features found, do nothing (or clear statistics);
      percentages.innerHTML = '';
      country = '&nbsp;';
    }
    countryName.innerHTML = country;
  });
});

function toggleLayers(e) {
  console.log(e.target.value);
  var clickedLayer = e.target.value;
  map.setLayoutProperty(activeLayer, 'visibility', 'none');
  map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
  buildLegend(clickedLayer);
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
