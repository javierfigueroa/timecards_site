Timecards.Views.Breadcrumb = Backbone.View.extend({
	template: JST['timecards/breadcrumb'],
	
	tagName: "li",

	events: {
		"click" : "navigate"	
	},
	
	render: function(){
  		$(this.el).html(this.template({model: this.model}));
  		return this;
  	},
  	
  	navigate: function(event) {
  		event.preventDefault();
	  	Backbone.history.navigate(this.model.get('url'), true);
  	}
})
