Timecards.Models.Project = Backbone.RelationalModel.extend({
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
  			key: 'project_id',
  			includeInJSON: 'id'
  		}
  	}],

    getTimespanLabel: function() {
        return TimeUtils.getTimespanLabel(this);
    },
	  
	getName: function() {
	 	return this.get("name");
	},

    getTimeOwedLabel: function() {
        return TimeUtils.getProjectWageLabel(this);
    }
});
