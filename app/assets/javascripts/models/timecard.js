Timecards.Models.Timecard = Backbone.Model.extend({
  urlRoot: function() {
  	return location.protocol + '//' + location.host;
  }
});
