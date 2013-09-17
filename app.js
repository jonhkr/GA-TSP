
function TSPGA(distanceMatrix, population) {
  this.distanceMatrix = distanceMatrix;
  this.population = population;
  this.mutationRate = 0.015;
  this.sampleSize = 20;
  this.best = undefined;
}

TSPGA.prototype.crossover = function(child1, child2, parent1, parent2) {

  length = parent1.length;

  var i1 = Math.floor(Math.random() * length);
  var i2 = Math.floor(Math.random() * length);
  if(i1 == i2) i2 = 1 + Math.floor(Math.random() * (length-i2-1));
  if(i1 > i2) {
    var iaux = i1;
    i1 = i2;
    i2 = iaux;
  }

  for(var i = i1; i <= i2; i++) {
    child1[i] = parent1[i];
    child2[i] = parent2[i];
  }

  for(var i = 0; i < length; i++) {
    if(!child1.contains(parent2[i])) {
      for(var j = 0; j < length; j++) {
        if(typeof child1[j] === 'undefined') {
          child1[j] = parent2[i];
          break;
        }
      }
    }

    if(!child2.contains(parent1[i])){
      for(var j = 0; j < length; j++) {
        if(typeof child2[j]  === 'undefined') {
          child2[j] = parent1[i];
          break;
        }
      }
    }
  }

};

TSPGA.prototype.mutate = function(a) {
  var i1 = Math.floor(Math.random() * a.length),
      i2 = Math.floor(Math.random() * a.length),
      aux = a[i1];

  a[i1] = a[i2];
  a[i2] = aux;
};

TSPGA.prototype.fitness = function(el) {
  var distance = 0;

  for(var i = 0; i < el.length; i++) {
    distance += this.distanceMatrix.getDistance(el[i % el.length].id, el[(i+1) % el.length].id);
  }

  return distance;
}

TSPGA.prototype.selectFittest = function(n) {
  var ga = this;
  return this.population.sort(function(a,b) {
    ga.fitness(a) - ga.fitness(b);
  }).slice(0, n);
}

TSPGA.prototype.runIteration = function(callback) {

  var selected = this.selectFittest(this.sampleSize);

  console.log(selected);
  var selectedFitness = this.fitness(selected[0]);

  if (!this.best || (bestFitness = this.fitness(this.best)) > selectedFitness) {
    this.best = selected[0];
    console.log(selectedFitness);
  }

  for(var i = 0; i < selected.length; i++) {
    var child1 = [],
        child2 = [],
        parent1 = selected[Math.floor(Math.random() * selected.length)],
        parent2 = selected[Math.floor(Math.random() * selected.length)];

    this.crossover(child1, child2, parent1, parent2);

    if (this.mutationRate >= Math.random()) {
      this.mutate(child1);
    }

    if (this.mutationRate >= Math.random()) {
      this.mutate(child2);
    }

    this.population.push(child1);
    this.population.push(child2);
  }

  this.population = this.population.slice(selected.length*2);

  if(callback) callback();
}

TSPGA.prototype.runIterations = function(n, callback) {
  var j = 0;
  for(var i = 0; i < n; i++) {
    this.runIteration(function() {
      j++;
      if(j == n) callback();
    });
  }
}

// window.ga = new TSPGA(new DistanceMatrix(data.distanceMatrix), Helper.generateRandomPopulation(data.cities, 100));
