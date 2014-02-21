Timecards.Models.Timecard = Backbone.RelationalModel.extend({
    urlRoot: function () {
        return location.protocol + '//' + location.host + "/timecards";
    },

    idAttribute: "id",

    getPhotoUrl: function () {
        return this.get('photo_in_url');
    },

    isMissingClockOut: function () {
        var inStamp = this.get('timestamp_in'),
            outStamp = this.get('timestamp_out');

        return !inStamp || !outStamp;
    },

    getTimestampInFormatted: function () {
        return moment(this.get('timestamp_in')).local().format('MM/DD/YYYY hh:mm:ss A');
    },

    getTimestampOutFormatted: function () {
        var out = this.get('timestamp_out');
        return out ? moment(out).local().format('MM/DD/YYYY hh:mm:ss A') : '';
    },

    getTimespan: function () {
        var inStamp = this.get('timestamp_in'),
            outStamp = this.get('timestamp_out') || moment();

        return inStamp && outStamp ? moment(outStamp).diff(moment(inStamp)) : -1;
    },

    getTimespanLabel: function () {
        if (this.getTimespan() === -1) {
            return "Missing clock out";
        }

        var label = countdown(moment(this.get('timestamp_out')), moment(this.get('timestamp_in')), countdown.HOURS | countdown.MINUTES).toString();

        return label.length === 0 ? "No time recorded" : label;
    },

    getFormattedDate: function () {
        return moment(this.get('timestamp_in')).format("MMM Do, YYYY");
    },

    getFullName: function () {
        return this.get('user')["first_name"] + " " + this.get('user')["last_name"];
    },

    getTimeOwedLabel: function() {
        var wage = this.get('user')['wage'],
            timespan = this.getTimespan(),
            hours = this._getHours(timespan),
            minutes = this._getMinutes(timespan),
            amount = hours * wage + (minutes / 60.0) * wage;

        return "$" + parseFloat(amount).toFixed(2);
    },

    _getHours: function(timespan) {
        var duration = moment.duration(timespan);
        return Math.abs(duration.days() * 24 + duration.hours());
    },

    _getMinutes: function(timespan) {
        var duration = moment.duration(timespan);
        return Math.abs(duration.minutes());
    },
});
