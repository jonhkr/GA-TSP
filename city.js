
function DirectionsMatrix() {
  this.directionsMatrix = [];
}

DirectionsMatrix.prototype.setDirections = function(a, b, directions) {
  if (typeof this.directionsMatrix[a] === 'undefined')
    this.directionsMatrix[a] = [];

  this.directionsMatrix[a][b] = directions;
}

DirectionsMatrix.prototype.getDirections = function(a, b) {
  if (typeof this.directionsMatrix[a] === 'undefined') {
    return undefined;
  }
  return this.directionsMatrix[a][b];
}

function DistanceMatrix(distanceMatrix) {
  this.distanceMatrix = distanceMatrix || [];
}

DistanceMatrix.prototype.getDistance = function(a, b) {
  if (typeof this.distanceMatrix[a] === 'undefined') {
    return undefined;
  }
  return this.distanceMatrix[a][b];
}

DistanceMatrix.prototype.setDistance = function(a, b, distance) {
  if (typeof this.distanceMatrix[a] === 'undefined')
    this.distanceMatrix[a] = [];

  this.distanceMatrix[a][b] = distance;
}

function City(id, name, location) {
  this.id = id;
  this.name = name;
  this.location = location;
}