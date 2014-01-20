var request = require('request'),
  q = require('Q');

var obj = {
  aField: 'Some Value'
};

var doReq = function (config) {
  var deferred = q.defer();

  request(config, function (e, r, result) {
    deferred.resolve(result);
  });

  return deferred.promise;
};

var idA, idB;

doReq({
  url:'http://localhost:3000/api/objAs',
  method: 'POST',
  json: obj
}).then(function (objA) {
  var id = idA = objA.id;
  console.log('Created objA : ' + id);

  return doReq({
    url: 'http://localhost:3000/api/objAs/' + id + '/objBs',
    method: 'POST',
    json: obj
  });

}).then(function (objB) {
  var id = idB = objB.id;
  console.log('Created objB : ' + id);

  // request blows up if we don't remove these
  delete objB.id;
  delete objB._id;

  objB.bField = 'A different Value';

  // Attempt to update the object
  return doReq({
    url: 'http://localhost:3000/api/objBs/' + id,
    method: 'PUT',
    json: objB
  });
  
}).then(function (objB) {
  console.log('Result was:');
  console.log(objB);

  return doReq({
    url: 'http://localhost:3000/api/objAs/' + idA + '/objBs',
    method: 'GET'
  });
  
}).then(function (list) {
  console.log('Lookup objB via objA relation:');
  console.log(list);
});
  
