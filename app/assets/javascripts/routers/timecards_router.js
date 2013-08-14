Timecards.Routers.Timecards = Backbone.Router.extend({
	routes: {
    	'' : 'index',
    	'timecard/:id' : 'getTimecardById',
		':in_date/:out_date' : 'getUsersByDate',
		':in_date/:out_date/:user_id' : 'getTimecardsByDate',
	},

	index: function() {
		var now = moment(), 
			nowFormatted = now.format("MM-DD-YYYY");
		this.getUsersByDate(nowFormatted, nowFormatted);
	},
	
	getUsersByDate: function(from, to) {
  		var url = "/users/" + from + "/" + to;
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Users();
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: false
  		});
  		
  		this.addMainView(fromDate, toDate);
  		this.addBreadcrumb("dafdafsd", url);
  	},
  	
  	getTimecardsByDate: function(from, to, userId) {
  		var url = "/timecards/" + from + "/" + to +"/" + userId;
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Timecards();	
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: false
  		});
  		
  		this.addMainView(fromDate, toDate);
  		this.addBreadcrumb("Timecards", url);
  	},
  	
  	getTimecardById: function(id) {
  		timecardView = new Timecards.Views.Timecard({
			model : this.collection.get(id)
		});
		
		$("#navigation").hide();
		$("#mainContent").html(timecardView.render().el);
  	},
  	
	addMainView: function(from, to) {
		//add main content
		timecardsView = new Timecards.Views.TimecardsIndex({
			collection : this.collection
		});
		
		$("#mainContent").html(timecardsView.render().el);
		
		//add date picker
		pickerView = new Timecards.Views.DatePicker({
			model : { from : from, to : to }
		});

		$("#navigation").show();
		$("#navigation").html(pickerView.render().el);
		pickerView.initDatePickers();
	},
	
	addBreadcrumb: function(title, url) {
		breadcrumb = new Timecards.Views.Breadcrumb({
			model: { title: title, url: url}
		})
		
		$("#breadcrumbs").append(breadcrumb.render().el);
	}
});
