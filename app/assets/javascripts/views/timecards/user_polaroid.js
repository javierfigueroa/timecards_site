Timecards.Views.UserPolaroid = Backbone.View.extend({
  template: JST['timecards/user_row'],

  events: {
  	"click" : "openTimecard"
  },
  	
  render: function(){
  	$(this.el).html(this.template({ model : this.model }));
  	return this;
  },
  
  openTimecard: function() {
  	var fragment = Backbone.history.fragment,
  		url = fragment && fragment.length > 0 ? fragment : $('#from').val() + "/" + $('#to').val();
	Backbone.history.navigate(url + "/" + this.model.get('id'), true);
  }
});
