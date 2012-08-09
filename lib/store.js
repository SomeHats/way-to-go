var db = require('mongojs').connect('localhost:27017/waytogo', ['places']);

exports.set = function (collection, data) {
  db.places.save(data);
};

exports.get = function (collection, query, callback, data) {
  db.places.findOne(query, function(err, docs) {
    if (docs === null) {
      docs = undefined;
    }
    if (data) {
      callback(docs, data);
    } else {
      callback(docs);
    }
  });
}; 