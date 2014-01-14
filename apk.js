if (Meteor.isClient) {

	Session.set("mangd", 1);
	Session.set("halt", 0.01);
	Session.set("pris", 1);
	
	Template.page.preserve({
		'input[id]': function (node) { return node.id; }
	});

  Template.page.apk = function () {
    return Math.round(100*(Session.get("mangd")*Session.get("halt"))/Session.get("pris"))/100;
  };

  Template.page.events({
    'click input' : function () {
    	// template data, if any, is available in 'this'
    	if (typeof console !== 'undefined') {
        	//console.log("You pressed the button");
    	}
    },
    'blur input.mangd': function(e, t) {
		Session.set("mangd", t.find(".mangd").value);
    },
    'blur input.halt': function(e, t) {
		Session.set("halt", t.find(".halt").value/100);
    },
    'blur input.pris': function(e, t) {
		Session.set("pris", t.find(".pris").value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
