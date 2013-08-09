window.Timecards = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    new Timecards.Routers.Timecards();
    Backbone.history.start();
  }
};

$(document).ready(function(){
	Timecards.init();
});