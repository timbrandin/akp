//Meteor.setInterval(function() {
//  console.log('tick');
//}, 1000);

Meteor.startup(function() {
  // Ensure we have a unique set of SystemBolag.
  SystemBolag._ensureIndex({"Nr": 1}, {unique: true, dropDups: true});

  // Get all Systembolag in Sweden into the database.
  HTTP.call("GET", "http://www.systembolaget.se/Assortment.aspx?butikerombud=1", function(error, result) {
    var root = xml2js.parseStringSync(result.content);
    // Loop through all shops and store to the database.
    for (var data in root) {
      for (var shops in root[data]) {
        var i = 0;
        for (var shop in root[data][shops]) {
          var shop = root[data][shops][shop];
          if (_.indexOf(shop.Typ, 'Butik') >= 0) {
            for (var key in shop) {
              if (shop[key].length && shop[key].length < 2) {
                shop[key] = (shop[key]).join();
              }
            }
            try {
              SystemBolag.insert(shop);
            } catch (e) {
//              console.log('Ignore duplicate');
            }
          }
        }
      }
    }
  });
});
