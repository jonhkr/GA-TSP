
Array.prototype.contains = function(el) { return this.indexOf(el) != -1; }

function GABase() {}

GABase.prototype.crossover = function(child, i, j, parent1, parent2) {

  if(i >= parent1.length) return;

  if (!child.contains(parent1[i])) {
    if (child[i]) {
      child[parent2.indexOf(parent1[i])] = parent1[i];
    } else {
      child[i] = parent1[i];
    }
  }

  if (j % 2 == 0) return this.crossover(child, i, ++j, parent2, parent1);

  this.crossover(child, ++i, ++j, parent1, parent2);
};

GABase.prototype.mutate = function(el) {
  var i1 = Math.random() * a.length,
      i2 = Math.random() * a.length,
      aux = a[i1];

  a[i1] = a[i2];
  a[i2] = aux;
};


window.a = new GABase();

window.b = [1,2,3,4,5,6,7,8];
window.c = [8,5,2,1,3,6,4,7];

window.d = [];