
Array.prototype.contains = function(el) { return this.indexOf(el) != -1; }
Array.prototype.clone = function() {
  var clone = [];
  for (var i = 0; i < this.length; i++){
    clone.push(this[i]);
  }

  return clone;
}

function Helper() {}

Helper.prototype.shuffle = function(arr) {
  var aux;
  for(var i = arr.length-1; i >= 0; i--) {
    j = Math.floor(Math.random() * i);
    aux = arr[j];
    arr[j] = arr[i];
    arr[i] = aux;
  }
  return arr;
}

Helper.prototype.generateRandomPopulation = function(cities, n) {
  var population = [];

  for(var i = 0; i < n; i++) {
    population.push(this.shuffle(cities.clone()));
  }

  return population;
};

Helper = new Helper();