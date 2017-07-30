var map;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });

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
        name: 'National September 11 Memorial & Museum at the World Trade Center',
        location: {lat: 40.711484, lng: -74.012725}
    },
    {
        type: 'City district',
        name: 'Upper East Side/East Harlem',
        location: {lat: 40.79574, lng: -73.938921}
    },
    {
        type: 'City district',
        name: 'Times Square/Theater District',
        location: {lat: 40.759011, lng: -73.984472}
    },
    {
        type: 'City district',
        name: 'Greenwich Village',
        location: {lat: 40.733572, lng: -74.002742}
    },
    {
        type: 'City district',
        name: 'Meatpacking District',
        location: {lat: 40.740987, lng: -74.007611}
    },
    {
        type: 'City district',
        name: 'Financial District',
        location: {lat: 40.707491, lng: -74.011276}
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
]

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
        self.showMarkersForPlaces(self.placeList());
    };

    // This function will loop through the given places array to create an array of markers and display them
    self.showMarkersForPlaces = function (places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
            var position = places[i].location;
            var title = places[i].name;
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
            bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
    };

    // This function will loop through the markers and hide them all
    self.hideMarkers = function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    };
};

ko.applyBindings(new ViewModel());
