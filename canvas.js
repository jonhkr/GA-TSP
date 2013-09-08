function Point(x, y) {
  this.x = x, this.y = y;
}

Point.prototype.draw = function($ctx) {
  $ctx.beginPath();
  $ctx.arc(this.x, this.y, 2, 0, 2*Math.PI, false);
  $ctx.fill();
};

function Edge(fx, fy, tx, ty) {
  this.fx = fx, this.fy = fy, this.tx = tx, this.ty = ty;
}

Edge.prototype.draw = function($ctx) {
  $ctx.beginPath();
  $ctx.moveTo(this.fx, this.fy);
  $ctx.lineTo(this.tx, this.ty);
  $ctx.stroke();
}


function drawGraph(route) {
  var $canvas = $('canvas')[0],
      $centerX = $canvas.width/2,
      $centerY = $canvas.height/2,
      $ctx = $canvas.getContext('2d');

  $ctx.clearRect(0,0,$canvas.width, $canvas.height);

  for(var i = 0; i < route.length; i++) {
    var coords1 = data.cityCoords[route[i % route.length].id];
    var coords2 = data.cityCoords[route[(i+1) % route.length].id];

    (new Point(coords1.x * 1.5 + $centerX , coords1.y * 1.5 + $centerY)).draw($ctx);
    (new Edge(coords1.x * 1.5 + $centerX, coords1.y * 1.5 + $centerY, coords2.x * 1.5 + $centerX, coords2.y * 1.5 + $centerY)).draw($ctx);
  }
}

var cities = []
  , geocoder = new google.maps.Geocoder()
  , directions = new google.maps.DirectionsService()
  , distanceMatrix = new DistanceMatrix()
  , directionsMatrix = new DirectionsMatrix()
  , map;

function addCity(address) {
  geocoder.geocode({ address: address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      cities.push(new City(cities.length, address, results[0].geometry.location));

      console.log('City with address "' + address + '" added.');

      if(cities.length > 0) {
        for (var i = 0; i < cities.length; i++) {
          for (var j = 0; j < cities.length; j++) {
            var city0 = cities[i]
              , city1 = cities[j];

            if (typeof distanceMatrix.getDistance(city0.id, city1.id) === 'undefined') {
              (function(city0, city1) {
                var directionsRequest = {
                  origin: city0.location,
                  destination: city1.location,
                  travelMode: google.maps.TravelMode.DRIVING
                };

                directions.route(directionsRequest, function(result, status) {
                  if(status == google.maps.DirectionsStatus.OK) {
                    var distance = result.routes[0].legs[0].distance.value;

                    distanceMatrix.setDistance(city0.id, city1.id, distance);
                    directionsMatrix.setDirections(city0.id, city1.id, result);

                    console.log('The distance between address "' + city0.name + '" and address "' + city1.name + '" is ' + distance);
                  }
                });
              })(city0, city1);
            }
          }
        }
      }
    } else {
      console.log('Geocode was not successful for the following reason:' + status);
    }
  });
}

function drawMarkers(route) {
  var locations = [];
  for(var i = 0; i < route.length; i++) {
    new google.maps.Marker({
      map: map,
      position: route[i].location
    });
    locations.push(route[i].location);
  }

  locations.push(route[0].location);
  new google.maps.Polyline({
    map: map,
    path: locations
  });
}

function drawDirections(route) {
  for(var i = 0; i < route.length; i++) {
    var city0 = route[i]
      , city1 = route[(i + 1) % route.length]
      , directionsDisplay = new google.maps.DirectionsRenderer({ map: map, suppressMarkers: true, suppressInforWindows: true});

    directionsDisplay.setDirections(directionsMatrix.getDirections(city0.id, city1.id));
  }
}


$(function() {
   var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

});
