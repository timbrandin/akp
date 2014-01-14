Meteor.startup(function() {
  if (Calculations.find().count() == 0) {
    Calculations.insert({name: 'ÖL', creator: 'Johan', type: 'ÖL', apk: '1.3', datetime: (new Date()).getTime()});
  }
});