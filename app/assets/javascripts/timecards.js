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
	if ($("#backbone-app").length > 0) {
		Timecards.init();
		
		//navigation events		
		$("#by-users").on("click", function() {
			Backbone.history.navigate("users", true);
			$(".nav li").removeClass("active");
			$(this).addClass("active");
			return false;
		});
		
		$("#by-projects").on("click", function() {
			Backbone.history.navigate("projects", true);
			$(".nav li").removeClass("active");
			$(this).addClass("active");
			return false;
		});
	}
});