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

$(function() {
   var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  var geocoder = new google.maps.Geocoder();

  var addr = "Lagoa vermelha, rs";

  geocoder.geocode({ address: addr}, function(results, status) {
    if(status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    }else {
      console.log('Geocode was not successful for the following reason:' + status);
    }
  });
});
