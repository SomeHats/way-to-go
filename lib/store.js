var db = require('mongojs').connect('localhost/waytogo', ['places']);

exports.set = function (collection, data) {
  db[collection].update(data, {multi: true}, function (err) {
    console.log('New record added');
  });
};

exports.get = function (collection, query) {
  db[collection].find(query, function(err, docs) {
    if (!err) {
      return docs;
    } else {
      console.log(err);
    }
  });
}; 
