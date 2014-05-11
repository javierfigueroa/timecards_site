if (window.location.href.indexOf("auth_token") > -1) {
    window.location.href = window.location.href.replace(/\?auth_token=.*id=[0-9]*/i, "");
}

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
	if ($("#app-content").length > 0) {
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