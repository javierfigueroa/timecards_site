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
	if ($("#wrapper").length > 0) {
		Timecards.init();
		
		//navigation events		
		$("#by-users").on("click", function() {
			Backbone.history.navigate("users", true);
			$("#sidebar a").removeClass("active");
			$(this).addClass("active");
			return false;
		});
		
		$("#by-projects").on("click", function() {
			Backbone.history.navigate("projects", true);
			$("#sidebar a").removeClass("active");
			$(this).addClass("active");
			return false;
		});
	}
});