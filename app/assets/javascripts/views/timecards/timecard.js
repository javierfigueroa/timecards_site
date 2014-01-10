Timecards.Views.Timecard = Backbone.View.extend({
  template: JST['timecards/timecard'],

  render: function(){
  	$(this.el).html(this.template({ model : this.model }));
  	
  	this.addClockInLocation();
  	!this.model.isMissingClockOut() && this.addClockOutLocation();
  	
  	
  	$(".avatar-in", this.el).css({'background-image': 'url(' + this.model.get('photo_in_url') + ')'});
  	$(".avatar-out", this.el).css({'background-image': 'url(' + this.model.get('photo_out_url') + ')'});
  	$("html, body").animate({ scrollTop: "0px" });
  	return this;
  },
  
  addClockInLocation: function() {
  	var mapDiv = $('#map_in', this.el),
		latlng = new google.maps.LatLng(this.model.get('latitude_in'), this.model.get('longitude_in')),
	    	mapOptions = {
	        center: latlng,
	        zoom: 15,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    },
    	map = new google.maps.Map(mapDiv[0], mapOptions);
    
    google.maps.event.addListener(map, "idle", function(){
        map.setCenter(mapOptions.center);
        google.maps.event.trigger(map, 'resize');
    });
    
	new google.maps.Marker({
		position : latlng,
		map : map,
		draggable : false,
	}); 
  },
  
  addClockOutLocation: function() {
  	var mapDiv = $('#map_out', this.el),
		latlng = new google.maps.LatLng(this.model.get('latitude_out'), this.model.get('longitude_out')),
	    	mapOptions = {
	        center: latlng,
	        zoom: 15,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    },
    	map = new google.maps.Map(mapDiv[0], mapOptions);
    
    google.maps.event.addListener(map, "idle", function(){
        map.setCenter(mapOptions.center);
        google.maps.event.trigger(map, 'resize');
    });
    
	new google.maps.Marker({
		position : latlng,
		map : map,
		draggable : false,
	}); 
  }
});
