(function(){
    var map = L.map("map").setView([34.2817777, -117.9267511], 12);
    var min_lat = 33.3814
    var max_lat = 35.18252
    var min_lon = -119.0066
    var max_lon = -116.8416

    var corrected_min_lat = -(94/714)*(max_lat - min_lat)+min_lat
    var corrected_max_lat = (85/714)*(max_lat - min_lat)+max_lat
    var corrected_min_lon = -(81/857)*(max_lon - min_lon)+min_lon
    var corrected_max_lon = (302/857)*(max_lon - min_lon)+max_lon
}
)