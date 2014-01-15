
Session.set("mangd", 1);
Session.set("halt", 0.01);
Session.set("pris", 1);
Session.set("apk", 0);
Session.set("name", "a");
Session.set("creator", "a");
Session.set("location", "");

Template.apkbox.preserve(['.box']);

Template.apkbox.helpers({
  apk: function() {
    var apk = Math.round(100 * (Session.get("mangd") * (Session.get("halt"))/100) / Session.get("pris")) / 100;
    Session.set('apk', apk);
    return apk;
  },
  state: function() {
    if (Session.get('apk') < 1) {
      return "low";
    } else {
      return "high";
    }
  }
});

Template.page.events({
  'click input': function() {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined') {
      //console.log("You pressed the button");
    }
  },
  'keyup input.mangd, blur input.mangd': function(e, t) {
    Session.set("mangd", t.find(".mangd").value);
  },
  'keyup input.halt, blur input.halt': function(e, t) {
    Session.set("halt", t.find(".halt").value);
  },
  'keyup input.pris, blur input.pris': function(e, t) {
    Session.set("pris", t.find(".pris").value);
  }
});

Template.page.helpers({
	mangdErrorMessage: function() {
    	return (Session.get("mangd") == "") ? "Mängd saknas" : "";
	},
	haltErrorMessage: function() {
    	return (Session.get("halt") == "") ? "Alkoholhalt saknas" : "";
	},
	prisErrorMessage: function() {
    	return (Session.get("pris") == "") ? "Pris saknas" : "";
	}
});

Handlebars.registerHelper("latlon", function(position) {
  console.log(position);
  if (position) {
    return Math.round(10000 * position.coords.latitude) / 10000 + " " + Math.round(10000 * position.coords.longitude) / 10000;
  }
  return "";
  // link
  // https://www.google.se/maps/preview#!q=57.7034%2C11.933
});

Handlebars.registerHelper("linkpos", function(position) {
  console.log(position);
  if (position) {
    return "https://www.google.se/maps/preview#!q="+position.coords.latitude+","+position.coords.longitude;
  }
  return "";
  // link
  // https://www.google.se/maps/preview#!q=57.7034%2C11.933
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
    return (Session.get("name") == "") ? "Dryckesnamn saknas" : "";
  },
  creatorErrorMessage: function() {
    return (Session.get("creator") == "") ? "Ditt namn saknas" : "";
  }
});

Template.list.events({
  'click button.save': function(e, t) {
    Session.set("name", t.find(".name").value);
    Session.set("creator", t.find(".creator").value);
    var type = t.find(".type").value;
    //console.log("Test: "+name+" : "+creator+" : "+type+" : "+Session.get("apk"));
    if (Session.get("name") != "" && Session.get("creator") != "" 
    	&& Session.get("mangd") != "" && Session.get("halt") != "" 
    	&& Session.get("pris") != "") {
      Calculations.insert({
        name: Session.get("name"),
        creator: Session.get("creator"),
        type: type,
        location: Session.get("location"),
        apk: Session.get("apk"),
        datetime: (new Date()).getTime(),
        mangd: Session.get("mangd"),
        halt: Session.get("halt"),
        pris: Session.get("pris")
      });
    }
  },
  'click button.location': function() {
    if (navigator.geolocation) {
      var position = navigator.geolocation.getCurrentPosition(function(position) {
        Session.set('location', position);
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