Timecards.Routers.Timecards = Backbone.Router.extend({
	routes: {
    	'' : 'index',
		':in_date/:out_date' : 'getUsersByDate',
		':in_date/:out_date/:user_id' : 'getTimecardsByDate',
    	':in_date/:out_date/:user_id/:id' : 'getTimecardById'
	},

	index: function() {
		var now = moment(), 
			nowFormatted = now.format("MM-DD-YYYY");
		this.getUsersByDate(nowFormatted, nowFormatted);
	},
	
	getUsersByDate: function(from, to) {
  		var dates = from + "/" + to,
  			url = "/users/" + dates,
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Users();
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: false
  		});
  		
  		this._addMainView(fromDate, toDate);
  		this._addBreadcrumbs([{
  			title:"Users", 
  			url: dates
		}]);
  	},
  	
  	getTimecardsByDate: function(from, to, userId) {
  		var dates = from + "/" + to;
  			suffix = dates +"/" + userId,
  			url = "/timecards/" + suffix,
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Timecards();	
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: false
  		});
  		  		
  		this._addMainView(fromDate, toDate);
  		this._addBreadcrumbs([{
  			title:"Users", 
  			url: dates
		} , {
			title:"Timecards", 
			url: suffix
		}]);
  	},
  	
  	getTimecardById: function(from, to, userId, timecardId) {
  		var dates = from + "/" + to;
  			user = dates +"/" + userId,
  			url = user + "/" + timecardId;
  			
  		if (!this.collection) {
	  		model = new Timecards.Models.Timecard({	id: timecardId });
	  		model.fetch({
	  			success: this._addTimecardView
	  		});
  		}else{
  			this._addTimecardView(this.collection.get(timecardId));
  		}
  		
  		this._addBreadcrumbs([{
  			title:"Users", 
  			url: dates
		} , {
			title:"Timecards", 
			url: user
		}, {
			title: "Details", 
			url: url
		}]);
  	},
  	
  	_addTimecardView: function(model, data) { 		
  		timecardView = new Timecards.Views.Timecard({
			model :  model
		});
		
		$("#app-navigation").hide();
		$("#app-content").html(timecardView.render().el);
  	},
  	
	_addMainView: function(from, to) {
		//add main content
		timecardsView = new Timecards.Views.TimecardsIndex({
			collection : this.collection
		});
		
		$("#app-content").html(timecardsView.render().el);
		
		//add date picker
		pickerView = new Timecards.Views.DatePicker({
			model : { from : from, to : to }
		});

		$("#app-navigation").show();
		$("#app-navigation").html(pickerView.render().el);
		pickerView.initDatePickers();
	},
	
	_addBreadcrumbs: function(crumbs) {
		collection = new Timecards.Collections.Breadcrumbs();
		
		for (var i=0; i<crumbs.length; i++) {
			collection.add(new Timecards.Models.Breadcrumb(crumbs[i]));			
		};
		
		view = new Timecards.Views.Breadcrumbs({
			collection: collection
		});
		
		$("#app-crumbs").html(view.render().el);
	}
});
