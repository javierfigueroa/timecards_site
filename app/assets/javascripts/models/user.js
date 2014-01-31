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
        if (timecards.length === 1) {
            var timecard = timecards.models[0],
                duration = moment.duration(timecard.getTimespan());
                hours = Math.abs(duration.days() * 24 + duration.hours()),
                minutes = Math.abs(duration.minutes()),
                missing = timecard.isMissingClockOut();

            return hours + " hours, " + minutes + " minutes" + (missing ? " and pending clock out" : "");
        } else if (timecards.length > 1) {
			var timespan = 0,
				missing = 0,
				duration = 0,
				text = "";
				
			for (var i=0; i<timecards.models.length; i++) {
				var timecard = timecards.models[i];
				
				if (timecard.isMissingClockOut()) {
					missing++;
				}else{
                    timespan += timecard.getTimespan();
                }
			}
			
			duration = moment.duration(timespan);
			hours = Math.abs(duration.days() * 24 + duration.hours()),
            minutes = Math.abs(duration.minutes());
			text = missing > 0 ?
					hours + " hours, " + minutes + " minutes and " + missing + " pending clock " + (missing === 1 ? "out" : "outs") :
					hours + " hours, " + minutes + " minutes";
		
  			return text;
  		}else{
  			return "No timecards available";
  		}
	},
	  
	getFullName: function() {
	 	return this.get("first_name") + " " + this.get("last_name");
	}
});
