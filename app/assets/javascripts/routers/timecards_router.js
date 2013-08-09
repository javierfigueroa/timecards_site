Timecards.Routers.Timecards = Backbone.Router.extend({
  routes: {
    '' : 'index',
    'timecards/:id' : 'show',
    'timecards/:query' : 'timely'
  },
  
  initialize: function(){
  	this.collection = new Timecards.Collections.Timecards();
  	this.collection.fetch({reset: true});
  },
  
  index: function() {
    view = new Timecards.Views.TimecardsIndex({collection: this.collection});
    $("#app").html(view.render().el);
  },
  
  show: function(id){
    alert("Timecard " + id);
  },
  
  timely: function(metric) {
  	alert(metric);
  }
});
