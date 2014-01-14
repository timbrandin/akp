
Session.set("mangd", 1);
Session.set("halt", 0.01);
Session.set("pris", 1);
Session.set("name", "a");
Session.set("creator", "a");

Template.page.apk = function() {
  var apk = Math.round(100 * (Session.get("mangd") * Session.get("halt")) / Session.get("pris")) / 100;
  Session.set('apk', apk);
  return apk;
};

Template.page.events({
  'click input': function() {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined') {
      //console.log("You pressed the button");
    }
  },
  'keyup input.mangd': function(e, t) {
    Session.set("mangd", t.find(".mangd").value);
    
    Session.set('location', 'hoho');
  },
  'keyup input.halt': function(e, t) {
    Session.set("halt", t.find(".halt").value / 100);
  },
  'keyup input.pris': function(e, t) {
    Session.set("pris", t.find(".pris").value);
  }
});

Template.list.helpers({
  items: function() {
    return Calculations.find();
  },
  date: function() {
    return moment(new Date(this.datetime)).format('MMM DD, HH:mm:ss');
  },
  current_location: function() {
    return Session.get('location');
  },
  latest: function() {
    var apk = Session.get("apk");
    if (apk !== undefined && apk > 0) {
      return {
        apk: Session.get("apk"),
        datetime: new Date()
      };
    }
  },
  nameErrorMessage: function() {
  	return (Session.get("name")=="")?"Dryckesnamn saknas":"";
  },
  creatorErrorMessage: function() {
  	return (Session.get("creator")=="")?"Ditt namn saknas":"";
  }
});

Template.list.events({
	'click button.save': function(e, t) {
		var drink = t.find(".name").value;
		var creator = t.find(".creator").value;
		var type = t.find(".type").value;
      	console.log("Test: "+drink+" "+creator+" "+type+" "+Session.get("apk"));
	},
  'click button.location': function() {
    if (navigator.geolocation) {
      var position = navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
      });
    }
  },
  'keyup input.name, blur input.name': function(e, t) {
    Session.set("name", t.find(".name").value);
  },
  'keyup input.creator, blur input.creator': function(e, t) {
    Session.set("creator", t.find(".creator").value);
  }
});