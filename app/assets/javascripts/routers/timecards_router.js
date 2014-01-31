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
			getUsers = this.getUsers;
			
		var from = $('#from').val(),
	  		to = $('#to').val(),
	  		now = moment(), 
			nowFormatted = now.format("MM-DD-YYYY").toString();

		Backbone.history.navigate("users/" + (from || nowFormatted) + "/" + (to || nowFormatted), true);
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
  			url = "/app/users/" + dates,
  			fromDate = moment(new Date(from.replace(/-/g, "/"))),
  			toDate = moment(to.replace(/-/g, "/"));

        Backbone.Relational.store.reset();
		this.collection = new Timecards.Collections.Users();  		
  		this._addMainView(fromDate, toDate, "All Users");
		
		picker = this.pickerView;
		picker.setHeader("Loading...");	
  		this.collection.fetch({
  			url: url,
  			reset: true,
  			remove: true,
  			success: function(collection, response){
      			picker.setHeader("All Users");
      			if (collection.models.length === 0) {
      				$("#app-content").html("<div class='pad15t'>No timecards found :(</div>");
      			}
    		}
  		});
  		
  		$("#by-users").addClass("active");
  	},
  	
	getProjectsByDate: function(from, to) {
  		var dates = from + "/" + to,
  			fromDate = moment(from),
  			toDate = moment(to);

        Backbone.Relational.store.reset();
		this.collection = new Timecards.Collections.Projects([], {			
			inDate: from,
			outDate: to
		});
  		
  		this._addMainView(fromDate, toDate, "All Projects");
		
		picker = this.pickerView;
		picker.setHeader("Loading...");	
  		this.collection.fetch({
  			reset: true,
  			remove: true,
  			success: function(collection, response){
      			picker.setHeader("All Projects");
      			if (collection.models.length === 0) {
      				$("#app-content").html("<div class='pad15t'>No projects found :(</div>");
      			}
    		}
  		});
  		
		$("#by-projects").addClass("active");
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
		
		picker = this.pickerView;
		picker.setHeader("Loading...");	
  		this.collection.fetch({
  			data: {user_id: userId},
  			reset: true,
  			remove: true,
  			success: function(collection, response){
  				if (collection.models.length > 0) {
	      			var user = collection.models[0].get('user'),
	      				name = user.first_name + " " + user.last_name;
	      			picker.setHeader(name);
      			}else{
					picker.setHeader("No timecards found");	
      			}
    		}
  		});
  		
  		$("#by-users").addClass("active");
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
  		
		picker = this.pickerView;	
		picker.setHeader("Loading...");	
  		this.collection.fetch({
  			data: {project_id: projectId},
  			reset: true,
  			remove: false,
  			success: function(collection, response){
  				if (collection.models.length > 0) {
	      			var project = collection.models[0].get('project');
	      			picker.setHeader(project.name);
      			}else{
					picker.setHeader("No timecards found");	
      			}
    		}
  		});
  		
		$("#by-projects").addClass("active");
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
		
		$("#by-users").addClass("active");
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

		$("#by-projects").addClass("active");
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
	}
});
