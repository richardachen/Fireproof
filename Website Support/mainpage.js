    var map = L.map("map").setView([34.2817777, -117.9267511], 11);
    var min_lat = 33.3814;
    var max_lat = 35.18252;
    var min_lon = -119.0066;
    var max_lon = -116.8416;

    var corrected_min_lat = -(94/714)*(max_lat-min_lat)+min_lat;
    var corrected_max_lat = (85/714)*(max_lat-min_lat)+max_lat;
    var corrected_min_lon = -(81/857)*(max_lon-min_lon)+min_lon;
    var corrected_max_lon = (302/857)*(max_lon-min_lon)+max_lon;

    var openstreetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmFjaGVuIiwiYSI6ImNremYxZmpkMjJtNzAyb3BxdDVnZXl0MWkifQ.PwmasYVtQw0NgfbsPp9nLg'
    }).addTo(map);

    var stamenmap = L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    opacity: 0.3
    }).addTo(map);

// https://stackoverflow.com/questions/54126079/how-to-change-style-in-a-leaflets-imageoverlay-apart-from-opacity
var imageOverlay = L.imageOverlay('testimg.png', [[corrected_min_lat, corrected_min_lon],[corrected_max_lat, corrected_max_lon]]).addTo(map);
    imageOverlay.setStyle({
        opacity: 0.4
    });

var baseMaps = {
    "openstreetmap": openstreetmap,
    "stamenmap": stamenmap
}

var overlayMaps = {
    "overlaymap": imageOverlay
}

    var layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);