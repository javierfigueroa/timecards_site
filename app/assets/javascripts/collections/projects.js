Timecards.Collections.Projects = Backbone.Collection.extend({
  	model: Timecards.Models.Project,
  		
  	url: function() {
    	return '/projects/' + this.inDate + "/" + this.outDate;
  	},
  	
  	initialize: function(models, options) {
    	this.inDate = options.inDate;
    	this.outDate = options.outDate;
  	}
});
