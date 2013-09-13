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
  			remove: true
  		});
  		
  		this._addMainView(fromDate, toDate, "All Users");
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
  		
  		this._addMainView(fromDate, toDate);
  		this._addBreadcrumbs([{
  			title:"Users", 
  			url: dates
		} , {
			title:"Timecards", 
			url: suffix
		}]);
  		
		picker = this.pickerView;	
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: false,
  			success: function(collection, response){
      			var user = collection.models[0].get('user'),
      				name = user.first_name + " " + user.last_name;
      			picker.setHeader(name);
    		}
  		});
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
		
		$("#app-navigation").parent().hide();
		$("#app-content").parent().removeClass("span10");
		$("#app-content").parent().addClass("span12");
		$("#app-content").html(timecardView.render().el);
  	},
  	
	_addMainView: function(from, to, header) {
		//add main content
		this.timecardsView = new Timecards.Views.TimecardsIndex({
			collection : this.collection
		});
		
		$("#app-content").html(this.timecardsView.render().el);
		
		//add date picker
		this.pickerView = new Timecards.Views.DatePicker({
			model : { from : from, to : to, header: header}
		});
		
		$("#app-content").parent().removeClass("span12");
		$("#app-content").parent().addClass("span10");
		$("#app-navigation").parent().show();
		$("#app-navigation").html(this.pickerView.render().el);
		this.pickerView.initDatePickers();
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
