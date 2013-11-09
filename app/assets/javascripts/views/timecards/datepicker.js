Timecards.Views.DatePicker = Backbone.View.extend({
	template: JST['timecards/datepicker'],

	events: {
		"click #filter" : "filter"	
	},
	
	render: function(){
  		$(this.el).html(this.template());
  		$('#from', this.el).val(this.model.from.format("MM-DD-YYYY"));
  		$('#to', this.el).val(this.model.to.format("MM-DD-YYYY"));
  		this.setHeader(this.model.header);
  		return this;
  	},
  	
  	initDatePickers: function() {
		var now = moment(),
			from = $('#from').datepicker({
					format: "mm-dd-yyyy"
				}).on('changeDate', function(ev) {
	  				if (ev.date.valueOf() > to.date.valueOf()) {
		    			to.setValue(ev.date);
		  			}
		  			from.hide();
				}).data('datepicker'),
			to = $('#to').datepicker({
					format: "mm-dd-yyyy",
				}).on('changeDate', function(ev) {
	  				to.hide();
				}).data('datepicker');	
  	},
  	
  	setHeader: function(header) {
  		var el = $("#filter-header", this.el);
  		if (header && header.length > 0 && el.text() !== header) {
  			el.text(header);
  		}
  	},
  	
  	filter: function() {
	  	var from = $('#from').val(),
	  		to = $('#to').val(),
	  		fragment = Backbone.history.fragment,
	  		fragments = fragment.split("/"),
	  		isUsers = fragments[0] === "users" || fragments[3] === "user",
	  		isProjects = fragments[0] === "projects" || fragments[3] === "project",
	  		userId = fragments.length == 5 && isUsers ? fragments[4] : null,
	  		projectId = fragments.length == 5 && isProjects ? fragments[4] : null;
	  		
  		if (isUsers) {
  			Backbone.history.navigate(userId ? "timecards/" + from + "/" + to + "/user/" + userId : "users/" + from + "/" + to, true);
  		}else if(isProjects){
  			Backbone.history.navigate(projectId ? "timecards/" + from + "/" + to + "/project/" + projectId : "projects/" + from + "/" + to, true);
  		}
  	}
});
