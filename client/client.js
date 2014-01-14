
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
  		var apk = Math.round(100 * (Session.get("mangd") * Session.get("halt")) / Session.get("pris")) / 100;
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
  'keyup input.mangd': function(e, t) {
    Session.set("mangd", t.find(".mangd").value);
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
		Session.set("name", t.find(".name").value);
		Session.set("creator", t.find(".creator").value);
		var type = t.find(".type").value;
      	//console.log("Test: "+name+" : "+creator+" : "+type+" : "+Session.get("apk"));
      	if(Session.get("name")!="" && Session.get("creator")!="") {
			Calculations.insert({
				name: Session.get("name"), 
				creator: Session.get("creator"), 
				type: type, 
				location: Session.get("location"),
				apk: Session.get("apk"), 
				datetime: (new Date()).getTime()
			});
      	}
	},
  'click button.location': function() {
    if (navigator.geolocation) {
      var position = navigator.geolocation.getCurrentPosition(function(position){
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