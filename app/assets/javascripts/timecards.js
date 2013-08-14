window.Timecards = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    new Timecards.Routers.Timecards();
    Backbone.history.start({pushState:true});
  }
};

$(document).ready(function(){
	Timecards.init();
});