Timecards.Models.User = Backbone.RelationalModel.extend({
  	urlRoot: function() {
  		return location.protocol + '//' + location.host;
  	},
  	
  	idAttribute: "id",
  	
  	relations: [{
  		type: Backbone.HasMany,
  		key: 'timecards',
  		relatedModel: 'Timecards.Models.Timecard',
  		collectionType: 'Timecards.Collections.Timecards',
  		reverseRelation: {
  			key: 'user_id',
  			includeInJSON: 'id'
  		}
  	}],
  	
	getPhotoUrl: function() {
		return this.get('photo_url');
	},
  
  	getTimespanLabel: function() {
  		var timecards = this.get('timecards');
  		if (timecards.length == 1) {
  			return timecards.models[0].getTimespanLabel();
  		}else if (timecards.length > 1) {
  			var timespan = timecards.reduce(function(memo, value) { 
  				var prev = $.isFunction(memo.getTimespan) ? memo.getTimespan() : memo,
  					next = value.getTimespan();
  					
				return +prev + +next; 
			});
			duration = moment.duration(timespan);
		
  			return duration.hours() + " hours, " + duration.minutes() + " minutes";
  		}else{
  			return "No timecards available";
  		}
	},
	  
	getFullName: function() {
	 	return this.get("first_name") + " " + this.get("last_name");
	}
});
