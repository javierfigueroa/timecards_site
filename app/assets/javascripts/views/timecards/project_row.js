Timecards.Views.ProjectRow = Backbone.View.extend({
  template: JST['timecards/project_row'],

  events: {
  	"click" : "openProject"
  },
  	
  render: function(){
  	$(this.el).html(this.template({ model : this.model }));
  	return this;
  },
  
  openProject: function() {
  	var fragment = Backbone.history.fragment,
  		url = "timecards/" +  $('#from').val() + "/" + $('#to').val();
	Backbone.history.navigate(url + "/project/" + this.model.get('id'), true);
  }
});
