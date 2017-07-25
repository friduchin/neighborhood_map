function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });
}

function mapError() {
    alert('Could not load the map. Try again, please.');
}