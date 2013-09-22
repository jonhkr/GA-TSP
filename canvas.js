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


function rotateVector(v, n) {
  var l = v.length
    , rv = [];
  for(var i=n; i < l+n; i++) {
    rv.push(v[i % l]);
  }

  return rv;
}


var cities = []
  , geocoder = new google.maps.Geocoder()
  , distanceMatrixService = new google.maps.DistanceMatrixService()
  , directions = new google.maps.DirectionsService()
  , distanceMatrix = new DistanceMatrix()
  , directionsMatrix = new DirectionsMatrix()
  , markers = []
  , pLine
  , map;


function addCities(addresses, callback) {
  var i = 0;
  (function geocode(address, callback) {
    geocoder.geocode({ address: address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        cities.push(new City(cities.length, address, results[0].geometry.location));
        console.log('City with address "' + address + '" added.');
      } else {
        console.log('Geocode was not successful for the following reason:' + status);
      }

      i++;
      if(i < addresses.length) {
        geocode(addresses[i], callback);
      }else{
        callback();
      }
    });
  })(addresses[0], function(){
    callback(cities);
  });
}


function getLocations(cities){
  var l = [];
  for(var i = 0; i < cities.length; i++) {
    l.push(cities[i].location);
  }
  return l;
}


function generateDistanceMatrix(cities, callback) {
  var origins = getLocations(cities)
    , destinations = rotateVector(origins, 1)
    , destinationCities = rotateVector(cities, 1);

  distanceMatrixService.getDistanceMatrix({
    origins: origins,
    destinations: destinations,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidHighways: false,
    avoidTolls: false
  }, function(result, status){
    if(status == google.maps.DistanceMatrixStatus.OK) {
      for(var i = 0; i < cities.length; i++) {
        for(var j = 0; j < cities.length; j++) {
          var city0 = cities[i]
            , city1 = destinationCities[j]
            , distance = result.rows[i].elements[j].distance.value;

          distanceMatrix.setDistance(city0.id, city1.id, distance);

          console.log('The distance between address "' + city0.name + '" and address "' + city1.name + '" is ' + distance);
        }
      }
    }else{
      console.log("Error requesting distance matrix from service", status);
    }

    callback(distanceMatrix);
    
  });
}


function drawMarkers(route) {
  var locations = getLocations(route)
    , latlngbounds = new google.maps.LatLngBounds()
    , letter;
  for(var i = 0; i < locations.length; i++) {
    letter = String.fromCharCode("A".charCodeAt(0) + i);
    markers.push(new google.maps.Marker({
      map: map,
      position: locations[i],
      title: route[i].name,
      icon: "http://maps.google.com/mapfiles/marker" + letter + ".png"
    }));
    latlngbounds.extend(locations[i]);
  }

  locations.push(route[0].location);

  pLine = new google.maps.Polyline({
    map: map,
    path: locations
  });

  map.setCenter(latlngbounds.getCenter());
  map.fitBounds(latlngbounds); 
}


$(function() {
   var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

});
