/**
 * Created by javier on 2/20/14.
 */

var TimeUtils = {
    getTimeOwedLabel: function(model) {
        var wage = model.get('wage'),
            hours = TimeUtils.getTotalHours(model),
            minutes = TimeUtils.getTotalMinutes(model),
            amount = hours * wage + (minutes / 60.0) * wage;

        return "$" + parseFloat(amount).toFixed(2);
    },

    getHours: function(timespan) {
        var duration = moment.duration(timespan);
        return Math.abs(duration.days() * 24 + duration.hours());
    },

    getMinutes: function(timespan) {
        var duration = moment.duration(timespan);
        return Math.abs(duration.minutes());
    },

    getTotalHours: function(model) {
        var timecards = model.get('timecards');
        if (timecards.length === 1) {
            return TimeUtils.getHours(timecards.models[0].getTimespan());
        } else if (timecards.length > 1) {
            var timespan = 0,
                duration = 0;

            for (var i=0; i<timecards.models.length; i++) {
                var timecard = timecards.models[i];

                if (!timecard.isMissingClockOut()) {
                    timespan += timecard.getTimespan();
                }
            }

            return TimeUtils.getHours(timespan);
        }else{
            return 0;
        }
    },

    getTotalMinutes: function(model) {
        var timecards = model.get('timecards');
        if (timecards.length === 1) {
            return TimeUtils.getMinutes(timecards.models[0].getTimespan());
        } else if (timecards.length > 1) {
            var timespan = 0,
                duration = 0;

            for (var i=0; i<timecards.models.length; i++) {
                var timecard = timecards.models[i];

                if (!timecard.isMissingClockOut()) {
                    timespan += timecard.getTimespan();
                }
            }

            return TimeUtils.getMinutes(timespan);
        }else{
            return 0;
        }
    },

    getTimespanLabel: function(model) {
        var timecards = model.get('timecards');
        if (timecards.length === 1) {
            var timecard = timecards.models[0],
                timespan = timecard.getTimespan();
            hours = TimeUtils.getHours(timespan),
                minutes = TimeUtils.getMinutes(timespan),
                missing = timecard.isMissingClockOut();

            return hours + " hours, " + minutes + " minutes" + (missing ? " and pending clock out" : "");
        } else if (timecards.length > 1) {
            var timespan = 0,
                missing = 0;

            for (var i=0; i<timecards.models.length; i++) {
                var timecard = timecards.models[i];

                if (timecard.isMissingClockOut()) {
                    missing++;
                }else{
                    timespan += timecard.getTimespan();
                }
            }

            hours = TimeUtils.getHours(timespan),
                minutes = TimeUtils.getMinutes(timespan);
            return missing > 0 ?
                hours + " hours, " + minutes + " minutes and " + missing + " pending clock " + (missing === 1 ? "out" : "outs") :
                hours + " hours, " + minutes + " minutes";
        }else{
            return "No timecards available";
        }
    }
};