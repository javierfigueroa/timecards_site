Timecards.Collections.Timecards = Backbone.Collection.extend({
  	url: '/timecards.json',  
  
  	model: Timecards.Models.Timecard
})
