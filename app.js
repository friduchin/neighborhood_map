var map;
var markers = [];
var infowindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });
    infowindow = new google.maps.InfoWindow();

    (new ViewModel()).showMarkersForPlaces(places);
}

function mapError() {
    alert('Could not load the map. Try again, please.');
}

var places = [
    {
        type: 'Park',
        name: 'Central Park',
        location: {lat: 40.782865, lng: -73.965355}
    },
    {
        type: 'Park',
        name: 'Bryant Park',
        location: {lat: 40.753597, lng: -73.983233}
    },
    {
        type: 'Park',
        name: 'High Line',
        location: {lat: 40.747993, lng: -74.004765}
    },
    {
        type: 'Park',
        name: 'Fort Tryon Park',
        location: {lat: 40.862561, lng: -73.9313}
    },
    {
        type: 'Park',
        name: 'Socrates Sculpture Park',
        location: {lat: 40.768479, lng: -73.936636}
    },
    {
        type: 'Museum',
        name: 'Metropolitan Museum of Art',
        location: {lat: 40.779437, lng: -73.963244}
    },
    {
        type: 'Museum',
        name: 'American Museum of Natural History',
        location: {lat: 40.781324, lng: -73.973988}
    },
    {
        type: 'Museum',
        name: 'New York Public Library',
        location: {lat: 40.753182, lng: -73.982253}
    },
    {
        type: 'Museum',
        name: 'Tenement Museum',
        location: {lat: 40.718796, lng: -73.99007}
    },
    {
        type:'Museum',
        name: 'National September 11 Memorial',
        location: {lat: 40.711484, lng: -74.012725}
    },
    {
        type: 'Pizza',
        name: "Joe's Pizza",
        location: {lat: 40.730588, lng: -74.002141}
    },
    {
        type: 'Pizza',
        name: "Adrienne's Pizzabar",
        location: {lat: 40.704294, lng: -74.010065}
    },
    {
        type: 'Pizza',
        name: "Paulie Gee's",
        location: {lat: 40.729654, lng: -73.958598}
    },
    {
        type: 'Pizza',
        name: "Roberta's",
        location: {lat: 40.705077, lng: -73.933592}
    },
    {
        type: 'Pizza',
        name: "Grimaldi's Pizzeria",
        location: {lat: 40.702604, lng: -73.99322}
    },
    {
        type: 'Bar',
        name: '230 Fifth',
        location: {lat: 40.744009, lng: -73.988021}
    },
    {
        type: 'Bar',
        name: 'Top of the Strand',
        location: {lat: 40.751248, lng: -73.984873}
    },
    {
        type: 'Bar',
        name: 'Pod 39 Rooftop',
        location: {lat: 40.749385, lng: -73.976588}
    },
    {
        type: 'Bar',
        name: 'Salon de Ning at The Peninsula',
        location: {lat: 40.761589, lng: -73.975211}
    },
    {
        type: 'Bar',
        name: 'Le Bain at The Standard High Line',
        location: {lat: 40.740854, lng: -74.007952}
    }
];

var ViewModel = function() {
    var self = this;

    self.placeList = ko.observableArray(places);

    self.listModes = ['All places'];
    places.forEach(function(item) {
        if (!self.listModes.includes(item.type)) {
            self.listModes.push(item.type);
        }
    });

    self.currentListMode = ko.observable(self.listModes[0]);

    self.setListMode = function(mode) {
        self.currentListMode(mode);
        self.placeList(places.filter(function(item) {
            return mode == 'All places' || item.type == mode;
        }));
        self.hideMarkers();
        markers = [];
        self.showMarkersForPlaces(self.placeList());
    };

    // This function will loop through the given places array to create an array of markers and display them
    self.showMarkersForPlaces = function (places) {
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function(place, i) {
            var position = place.location;
            var title = place.name;
            // Create a marker per location, and put into markers array
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers
            markers.push(marker);
            bounds.extend(marker.position);
            marker.addListener('click', function() {
                self.openInfoWindow(i);
            });
        });

        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
    };

    // This function toggles visibility of places list panel on small screens
    self.togglePlaceList = function() {
        var panel = document.getElementById('list-panel');
        panel.classList.toggle('panel-active');
        self.placeListToggled = true;
    };

    // This function will loop through the markers and hide them all
    self.hideMarkers = function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };

    // This function populates the infowindow when the marker is clicked
    self.openInfoWindow = function(index, needToggleList = false) {
        // Close a previously opened infowindow
        infowindow.close();
        // Remove bounce animation from any previously selected marker
        markers.forEach(function(marker) { marker.setAnimation(null); });

        var marker = markers[index];
        infowindow.marker = marker;

        // Add bounce animation for currently selected marker
        marker.setAnimation(google.maps.Animation.BOUNCE);

        // Stop the marker from bouncing when the infowindow is closed
        infowindow.addListener('closeclick', function() {
            marker.setAnimation(null);
        });

        var contentHead = '<table class="table"><thead><tr><td><h4>' + marker.title + '</h4></td></tr></thead>';

        // Basic Foursquare API request URL
        var fsBasicUrl = 'https://api.foursquare.com/v2/venues/';
        // Credentials for the Foursquare API request URL
        var fsClientId = 'CXIHGWKSCCUBFJ0SXLYXOQ3JO0RUNRO3IFYENEHMP3ODKGZN';
        var fsClientSecret = 'TE0AJG21AFZQOC5D3MUTTGGTU0FMMLQ12AASWLPJYCGLUSFK';
        var fsVersion = '20170730';

        $.getJSON(fsBasicUrl + 'search', {
            client_id: fsClientId,
            client_secret: fsClientSecret,
            v: fsVersion,
            intent: 'match',
            query: marker.title,
            ll: marker.position.lat() + ',' + marker.position.lng()
        }).done(function(data) {
            if (data.meta.code == 200 && data.response.venues.length > 0) {
                var place = data.response.venues[0];
                var contentHtml = contentHead + '<tbody><tr><td><p>Foursquare info:</p><ul><li>' +
                    place.location.formattedAddress[0] + '</li>' + '<li>' + place.url + '</li></ul></td>';
                $.getJSON(fsBasicUrl + place.id + '/photos', {
                    client_id: fsClientId,
                    client_secret: fsClientSecret,
                    v: fsVersion
                }).done(function(data) {
                    if (data.response.photos.items.length > 0) {
                        var photo = data.response.photos.items[0];
                        contentHtml += '<td id="fsImg"><img src="' + photo.prefix + 'cap100' +
                            photo.suffix + '"></td></tr></tbody></table>';
                        infowindow.setContent(contentHtml);
                        // Open the infowindow on the correct marker
                        infowindow.open(map, marker);
                    }
                }).fail(function() {
                    contentHtml += '<td id="fsImg">Could not get photo from Foursquare</td></tr></tbody></table>';
                    infowindow.setContent(contentHtml);
                    // Open the infowindow on the correct marker
                    infowindow.open(map, marker);
                });
            }
        }).fail(function() {
            var contentHtml = contentHead + '<tbody><tr><td>Could not load Foursquare info</td></tr></tbody></table>';
            infowindow.setContent(contentHtml);
            // Open the infowindow on the correct marker
            infowindow.open(map, marker);
        });

        // Hide place list on small screens if needed
        if (needToggleList) {
            self.togglePlaceList();
        }
    };
};

ko.applyBindings(new ViewModel());
