Timecards.Views.TimecardPolaroid = Backbone.View.extend({
  template: JST['timecards/polaroid'],

  events: {
  	"click" : "openTimecard"
  },
  	
  render: function(){
  	$(this.el).html(this.template({ model : this.model }));
  	return this;
  },
  
  openTimecard: function() {
  	var fragment = Backbone.history.fragment;
	Backbone.history.navigate(fragment + "/" +this.model.get('id'), true);
  }
})
