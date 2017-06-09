        var geocoder = new google.maps.Geocoder();
        var mylat = '0';
        var mylng = '0';

        function geocodePosition(pos) {
            geocoder.geocode({
                latLng: pos
            }, function(responses) {
                if (responses && responses.length > 0) {
                    updateMarkerAddress(responses[0].formatted_address);
                } else {
                    updateMarkerAddress('Cannot determine address at this location.');
                }
            });
        }

        function updateMarkerStatus(str) {
            document.getElementById('markerStatus').innerHTML = str;
        }

        function updateMarkerPosition(latLng) {
            mylat = latLng.lat();
            mylng = latLng.lng();
            document.getElementById('info').innerHTML = [
                latLng.lat(),
                latLng.lng()
            ].join(', ');
        }

        function updateMarkerAddress(str) {
            document.getElementById('address').innerHTML = str;
        }

        function initialize() {
            var myLatlng = new google.maps.LatLng(11.671133629785487, 78.23090055090324);
            var latLng = myLatlng;
            var myOptions = {
                zoom: 16,
                center: myLatlng
            }
            var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
            var myLatlng = new google.maps.LatLng(41.38, 2.18);
            var myOptions = { zoom: 13, center: myLatlng }
            var marker = new google.maps.Marker({
                position: latLng,
                title: 'Point A',
                map: map,
                draggable: true
            });

            // Update current position info.
            updateMarkerPosition(latLng);
            geocodePosition(latLng);

            google.maps.event.addListener(map, 'click', function(event) { alert(event.latLng); });

            // Add dragging event listeners.
            google.maps.event.addListener(marker, 'dragstart', function() {
                updateMarkerAddress('Dragging...');
            });

            google.maps.event.addListener(marker, 'drag', function() {
                updateMarkerStatus('Dragging...');
                updateMarkerPosition(marker.getPosition());
            });

            google.maps.event.addListener(marker, 'dragend', function() {
                updateMarkerStatus('Drag ended');
                geocodePosition(marker.getPosition());
            });

            google.maps.event.addListener(map, 'click', function(event) {
                geocoder.geocode({
                    'latLng': event.latLng
                }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK)
                        if (results[0]) alert(results[0].formatted_address);
                });
            });
        }
        // Onload handler to fire off the app.
        google.maps.event.addDomListener(window, 'load', initialize);

        function sendData() {
            //console.log(mylat +','+ mylng);
            var data = {};
            var location = {};
            location.lat = mylat;
            location.lng = mylng;
            data.location = location;
            console.log(data);

            $.ajax({
                type: "POST",
                url: "/smap",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(result) {
                    console.log(result);
                    window.location = "/shopkeeper-profile";
                }
            });
        }