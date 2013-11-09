Timecards.Views.Breadcrumbs = Backbone.View.extend({
		
	tagName: "ul",
	
	initialize: function() {
		this.collection.on('add', this.appendBreadcrumb, this);
		this.collection.on('reset', this.render, this);
	},

	render: function() {
  		$(this.el).addClass("breadcrumb");
		var collection = this.collection;

		collection.each(function(crumb) {
			this.appendBreadcrumb(crumb);
		}, this);

		return this;
	}, 
	
	appendBreadcrumb: function(crumb) {
		view = new Timecards.Views.Breadcrumb({
			model : crumb
		});

		$(this.el).append(view.render().el);
	}
});
