Timecards.Views.TimecardsIndex = Backbone.View.extend({
  template: JST['timecards/index'],

  initialize: function(){
    this.collection.on('add', this.appendEntry, this);
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
  	view = model instanceof Timecards.Models.User ? 
  		new Timecards.Views.UserPolaroid({ model: model }) : new Timecards.Views.TimecardPolaroid({ model: model });
  	
  	$("#timecards").append(view.render().el);
  }
})
