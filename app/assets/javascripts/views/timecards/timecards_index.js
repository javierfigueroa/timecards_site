Timecards.Views.TimecardsIndex = Backbone.View.extend({
  template: JST['timecards/index'],

  initialize: function(){
    this.collection.on('add', this.appendTimecard, this);
    this.collection.on('reset', this.render, this); 	
  },
  
  render: function(){
  	$(this.el).html(this.template());
	var collection = this.collection;
	
	collection.each(function(user) {
      this.appendTimecard(user);
    }, this);
    
  	return this;
  },
  
  appendTimecard: function(model){
  	var view = null;
  	if(model instanceof Timecards.Models.User) { 
  		view = new Timecards.Views.UserPolaroid({ model: model });
  	}else if(model instanceof Timecards.Models.Timecard) { 
  		view = new Timecards.Views.TimecardPolaroid({ model: model });
  	}else{
  		view = new Timecards.Views.ProjectRow({ model: model });
  	}
  	
  	$("#timecards").append(view.render().el);
  }
});
