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
  		url = "timecards/" + $('#from').val() + "/" + $('#to').val();
	Backbone.history.navigate(url + "/user/" + this.model.get('id'), true);
  }
});
