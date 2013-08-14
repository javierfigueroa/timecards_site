Timecards.Views.Breadcrumb = Backbone.View.extend({
	template: JST['timecards/breadcrumb'],
	
	el: "li",

	events: {
		"click" : "navigate"	
	},
	
	render: function(){
  		$(this.el).html(this.template({model: this.model}));
  		return this;
  	},
  	
  	filter: function(event) {
  		event.preventDefault();
	  	Backbone.history.navigate(this.model.url, true);
  	}
})
