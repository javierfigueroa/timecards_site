Timecards.Collections.Timecards = Backbone.Collection.extend({
  	url: '/timecards.json',  
  
  	model: Timecards.Models.Timecard,
  
  	groupByUser: function() {
  		return this.groupBy( function(model){
	  		return model.get('user_id');
		});
  	},
  
  	getTimestampsSum: function(models) {
		return _.reduce(models, function(memo, value) { 
			return +($.isFunction(memo.getTimespan) ? memo.getTimespan() : memo) + +(value.getTimespan()); 
		});
	}
})
