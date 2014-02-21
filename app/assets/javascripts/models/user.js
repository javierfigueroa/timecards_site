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
        return TimeUtils.getTimespanLabel(this);
	},
	  
	getFullName: function() {
	 	return this.get("first_name") + " " + this.get("last_name");
	},

    getTimeOwedLabel: function() {
        return TimeUtils.getTimeOwedLabel(this);
    }
});
