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
  		$("#filter-header", this.el).text(header);
  	},
  	
  	filter: function() {
	  	var from = $('#from').val(),
	  		to = $('#to').val(),
	  		fragment = Backbone.history.fragment,
	  		fragments = fragment.split("/"),
	  		userId = fragments.length == 3 ? fragments[2] : null,
	  		url = userId ? from + "/" + to + "/" + userId : from + "/" + to;
	  		
	  	Backbone.history.navigate(url, true);
  	}
})
