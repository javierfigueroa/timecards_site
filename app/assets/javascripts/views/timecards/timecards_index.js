Timecards.Views.TimecardsIndex = Backbone.View.extend({
  template: JST['timecards/index'],

  events: {
  	'click #daily': 'showDaily',
  	'click #weekly': 'showWeekly',
  	'click #biweekly': 'showBiweekly',
  	'click #monthly': 'showMonthly',
  	'click #yearly': 'showYearly',
  },
  
  initialize: function(){
    this.collection.on('reset', this.render, this);
    this.collection.on('add', this.appendEntry, this);
  },
  
  render: function(){
  	$(this.el).html(this.template());
  	for (var i=0; i < this.collection.models.length; i++) {
  		this.appendTimecard(this.collection.models[i]);
  	}
  	
  	$("#date").append(moment().format('MMMM Do YYYY'));
  	return this;
  },
  
  appendTimecard: function(timecard){
  	view = new Timecards.Views.Polaroid({ model: timecard });
  	$("#timecards").append(view.render().el);
  },
  
  showDaily: function(event) {
  	event.preventDefault();
  	Backbone.history.navigate("timecards/daily", true);
  },
  
  showWeekly: function(event) {
  	event.preventDefault();
  	Backbone.history.navigate("timecards/weekly", true);
  },
  
  showBiweekly: function(event) {
  	event.preventDefault();
  },
  
  showMonthly: function(event) {
  	event.preventDefault();
  },
  
  showYearly: function(event) {
  	event.preventDefault();
  }
})
