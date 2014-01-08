Timecards.Routers.Timecards = Backbone.Router.extend({

	routes: {
    	'' : 'index',
    	'users' : 'getUsers',
    	'projects' : 'getProjects',
		'users/:in_date/:out_date' : 'getUsersByDate',
		'timecards/:in_date/:out_date/user/:user_id' : 'getTimecardsForUserByDate',
    	'timecards/:in_date/:out_date/user/:user_id/:id' : 'getTimecardForUserById',
    	'projects/:in_date/:out_date' : 'getProjectsByDate',
		'timecards/:in_date/:out_date/project/:project_id' : 'getTimecardsForProjectByDate',
    	'timecards/:in_date/:out_date/project/:project_id/:id' : 'getTimecardForProjectById',
	},
	
	index: function() {
		this.getUsers();
	},

	getUsers: function() {
		
		var el = $("#backbone-app"),
			// token = el.attr("auth-token"),
			email = el.attr("email"),
			getUsers = this.getUsers;
			
		if (email) {
			$.getJSON("/timecards",{ "user[email]": email}, function(response, status){
				if (status === "success") {
					var from = $('#from').val(),
				  		to = $('#to').val(),
				  		now = moment(), 
						nowFormatted = now.format("MM-DD-YYYY");
			
					Backbone.history.navigate("users/" + (from || nowFormatted) + "/" + (to || nowFormatted), true);
				}
			});
		}
	},
	
	getProjects: function() {
		var from = $('#from').val(),
	  		to = $('#to').val(),
	  		now = moment(), 
			nowFormatted = now.format("MM-DD-YYYY");

		Backbone.history.navigate("projects/" + (from || nowFormatted) + "/" + (to || nowFormatted), true);
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
  			url: "users/" + dates
		}]);
  	},
  	
	getProjectsByDate: function(from, to) {
  		var dates = from + "/" + to,
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Projects([], {			
			inDate: from,
			outDate: to
		});
  		this.collection.fetch({
  			reset: true,
  			remove: true
  		});
  		
  		this._addMainView(fromDate, toDate, "All Projects");
  		this._addBreadcrumbs([{
  			title:"Projects", 
  			url: "projects" + dates
		}]);
  	},
  	
  	
  	getTimecardsForUserByDate: function(from, to, userId) {
  		var dates = from + "/" + to;
  			suffix = dates +"/user/" + userId,
  			url = suffix,
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Timecards([], {
			inDate: from,
			outDate: to
		});
  		
  		this._addMainView(fromDate, toDate);
  		this._addBreadcrumbs([{
  			title:"Users", 
  			url: "users/" + dates
		} , {
			title:"Timecards", 
			url: "timecards/" + suffix
		}]);
  		
		picker = this.pickerView;	
  		this.collection.fetch({
  			data: {user_id: userId},
  			reset: true,
  			remove: false,
  			success: function(collection, response){
  				if (collection.models.length > 0) {
	      			var user = collection.models[0].get('user'),
	      				name = user.first_name + " " + user.last_name;
	      			picker.setHeader(name);
      			}
    		}
  		});
  	},
  	
  	
  	getTimecardsForProjectByDate: function(from, to, projectId) {
  		var dates = from + "/" + to;
  			suffix = dates +"/project/" + projectId,
  			url = suffix,
  			fromDate = moment(from),
  			toDate = moment(to);
  			
		this.collection = new Timecards.Collections.Timecards([], {
			inDate: from,
			outDate: to
		});
  		
  		this._addMainView(fromDate, toDate);
  		this._addBreadcrumbs([{
  			title:"Projects", 
  			url: "projects/" + dates
		} , {
			title:"Timecards", 
			url: "timecards/" + suffix
		}]);
  		
		picker = this.pickerView;	
  		this.collection.fetch({
  			data: {project_id: projectId},
  			reset: true,
  			remove: false,
  			success: function(collection, response){
  				if (collection.models.length > 0) {
	      			var user = collection.models[0].get('user'),
	      				name = user.first_name + " " + user.last_name;
	      			picker.setHeader(name);
      			}
    		}
  		});
  	},
  	
  	getTimecardForUserById: function(from, to, userId, timecardId) {
  		var dates = from + "/" + to;
  			user = dates +"/user/" + userId,
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
  			url: "users/" + dates
		} , {
			title:"Timecards", 
			url: "timecards/" + user
		}, {
			title: "Details", 
			url: "timecards/" + url
		}]);
  	},
  	
  	getTimecardForProjectById: function(from, to, projectId, timecardId) {
  		var dates = from + "/" + to;
  			user = dates +"/project/" + projectId,
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
  			title:"Projects", 
  			url: "projects/" + dates
		} , {
			title:"Timecards", 
			url: "timecards/" + user
		}, {
			title: "Details", 
			url: "timecards/" + url
		}]);
  	},
  	
  	
  	_addTimecardView: function(model, data) { 		
  		timecardView = new Timecards.Views.Timecard({
			model :  model
		});
		
		$("#app-navigation").parent().fadeOut(100);
		$("#app-content").html(timecardView.render().el).hide().fadeIn(1000);
  	},
  	
	_addMainView: function(from, to, header) {
		//add main content
		this.timecardsView = new Timecards.Views.TimecardsIndex({
			collection : this.collection
		});
		
		$("#app-content").html(this.timecardsView.render().el).hide().fadeIn(500);
		
		//add date picker
		if (!this.pickerView) {
			this.pickerView = new Timecards.Views.DatePicker({
				model : { from : from, to : to, header: header}
			});
			
			
			$("#app-navigation").html(this.pickerView.render().el).hide().fadeIn(500);;
			$("#app-navigation").parent().fadeIn();
		}else{
  			this.pickerView.setHeader(header);
			$("#app-navigation").parent().fadeIn(500);
		}
		
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
