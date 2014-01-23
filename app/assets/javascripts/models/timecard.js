Timecards.Models.Timecard = Backbone.RelationalModel.extend({
  urlRoot: function() {
  	return location.protocol + '//' + location.host + "/timecards";
  },
  
  idAttribute: "id",
  
  getPhotoUrl: function() {
  	return this.get('photo_in_url');
  },
  
  isMissingClockOut: function() {
  	var inStamp = this.get('timestamp_in'),
  		outStamp = this.get('timestamp_out');
  		
  	return !inStamp || !outStamp;
  },
  
  getTimespan: function(){
  	var inStamp = this.get('timestamp_in'),
  		outStamp = this.get('timestamp_out') || moment();
  		
    return inStamp && outStamp ? moment(outStamp).diff(moment(inStamp)) : 0;
  },
  
  getTimespanLabel: function() {
  	if (this.getTimespan() === 0) {
  		return "Missing clock out";
  	}

  	return countdown(moment(this.get('timestamp_out')), moment(this.get('timestamp_in')), countdown.HOURS | countdown.MINUTES);
  },
  
  getFormattedDate: function() {
  	return moment(this.get('timestamp_in')).format("MMM Do, YYYY");;
  },
  
  getFullName: function() {
  	return this.get('user')["first_name"] + " " + this.get('user')["last_name"];
  }
});
