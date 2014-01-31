Timecards.Collections.Timecards = Backbone.Collection.extend({
  	model: Timecards.Models.Timecard,
  	
  	url: function() {
    	return '/app/timecards/' + this.inDate + "/" + this.outDate;
  	},
  	
  	initialize: function(models, options) {
    	this.inDate = options.inDate;
    	this.outDate = options.outDate;
  	}
});
