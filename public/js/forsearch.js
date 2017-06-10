var length = clientMed.length;
for (var j = 0; j < length; j++) {

    var newOption = $('<option/>');
    newOption.text(clientMed[j].name);
    newOption.attr('value', clientMed[j].name);
    $('#medname').append(newOption);
}

length = clientArea.length;
for (var j = 0; j < length; j++) {
    var newOption = $('<option/>');
    newOption.text(clientArea[j].name);
    newOption.attr('value', clientArea[j].name);
    $('#area').append(newOption);
}
var shopdata = {};

function sendData() {
    //console.log(mylat +','+ mylng);
    var data = {};
    data.area = $('#area').val();
    data.medname = $('#medname').val();
    //console.log(data); 
    shopdata = {};
    var p1 = $('p1');
    $.ajax({
        type: "POST",
        url: "/profile",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(result) {
            //console.log(result); 
            //console.log(JSON.parse(result));
            //shopdata = JSON.stringify(result);
            shopdata = result;
            //console.log(shopdata.length);
            //console.log(shopdata);
            $('#p1').empty();
            var length = shopdata.length || 0;
            //console.log(length);
            if (length > 0) {
                initialize();
                removeMarkers();
                var thismarker = new Array(3);
                for (var j = 0; j < length; j++) {
                    thismarker = [];
                    $('#p1').append((j + 1) + ').' + shopdata[j].details.name + ',<br>' + shopdata[j].details.address + ',<br>');
                    $('#p1').append('Phone1:' + shopdata[j].details.phone1 + ', Altername Contact:' + shopdata[j].details.phone2 + '<br>');
                    $('#p1').append('Website: <a href="' + shopdata[j].details.website + '">' + shopdata[j].details.website + '<br>');
                    //console.log(shopdata[j].details.location.lat, shopdata[j].details.location.lng);
                    thismarker[0] = shopdata[j].details.location.lat;
                    thismarker[1] = shopdata[j].details.location.lng;
                    thismarker[2] = shopdata[j].details.name + 'Medical';
                    // $('#p1').append('<button id="showmap" onClick="showMap(' + j + ')">Show Map</button>');
                    addMarker(thismarker);
                    //console.log(thismarker);
                    $('#p1').append('<br>');
                }
                //addMarker(markers);
            } else {
                $('#p1').text("Not available !!!");
            }
        }
    });
}
var gmarkers = [];

function initialize() {
    var latlng = new google.maps.LatLng(11.668, 78.2452);
    var myOptions = {
        zoom: 14,
        center: latlng,
        scrollwheel: false,
        zoomControl: true,
        streetViewControl: false,
        scaleControl: true
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
    marker = new google.maps.Marker({
        position: latlng,
        map: map,
        draggable: false,

    });
    gmarkers.push(marker);
    var gotoMapButton = document.createElement("div");
    gotoMapButton.setAttribute("style", "margin: 5px; border: 1px solid; padding: 1px 12px; font: bold 11px Roboto, Arial, sans-serif; color: #000000; background-color: #FFFFFF; cursor: pointer;");
    gotoMapButton.innerHTML = "Open Google Maps";
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(gotoMapButton);
    google.maps.event.addDomListener(gotoMapButton, "click", function() {
        var url = 'https://www.google.com/maps?q=' + encodeURIComponent(marker.getPosition().toUrlValue());
        // you can also hard code the URL
        window.open(url);
    });
}
var i = 1;

function removeMarkers() {
    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
}
var infowindow = new google.maps.InfoWindow();

function addMarker(markers) {
    //console.log('addMarker',markers.length);
    var locations = "http://google.co.id/";
    var lat = markers[0];
    var lng = markers[1];
    var trailhead_name = markers[2];
    //console.log('inside new addmarker ' + i++, lat, lng, trailhead_name);
    var myLatlng = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        clickable: true,
        url: 'https://www.google.com/maps?q=' + encodeURIComponent(myLatlng.toUrlValue()),
        title: "Coordinates: " + lat + " , " + lng + " | Trailhead name: " + trailhead_name
    });
    gmarkers.push(marker);
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < gmarkers.length; i++) {
        bounds.extend(gmarkers[i].getPosition());
    }
    map.fitBounds(bounds);
    google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
            infowindow.setContent(trailhead_name);
            infowindow.open(map, marker);
            // window.location.href = marker.url;
        }
    })(marker));
    google.maps.event.addListener(marker, 'dblclick', (function() {
        return function() {
            window.open(url);
        }
    }));
}
google.maps.event.addDomListener(window, 'load', initialize);