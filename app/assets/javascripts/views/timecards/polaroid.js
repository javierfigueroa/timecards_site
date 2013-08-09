Timecards.Views.Polaroid = Backbone.View.extend({
  template: JST['timecards/polaroid'],

  render: function(){
  	$(this.el).html(this.template({ timecard : this.model }));
  	return this;
  }
})
