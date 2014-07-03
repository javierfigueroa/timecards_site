Timecards.Views.Timecard = Backbone.View.extend({
    _browserLocation: null,
    _locationIn: null,
    _locationOut: null,
    _photoIn: null,
    _photoOut: null,

    template: JST['timecards/timecard'],

    initialize: function () {
        _.bindAll(this, "render");
        this.model.bind('change', this.render);
    },

    render: function () {
        $(this.el).html(this.template({ model: this.model }));

        this.addClockInLocation();
        this.addClockOutLocation();


        $(".avatar-in", this.el).css({'background-image': 'url(' + this.model.get('photo_in_url') + ')'});
        $(".avatar-out", this.el).css({'background-image': 'url(' + this.model.get('photo_out_url') + ')'});
        $("html, body").animate({ scrollTop: "0px" });

        $("#edit", this.el).on('click', $.proxy(this._setEditMode, this));
        $("#cancel", this.el).on('click', $.proxy(this._setViewMode, this));
        $("#save", this.el).hide().on('click', $.proxy(this._update, this));
        $("#browser-in", this.el).on('click', $.proxy(this._setBrowserLocationIn, this));
        $("#browser-out", this.el).on('click', $.proxy(this._setBrowserLocationOut, this));
        $("div.overlay", this.el).hide();
        $(".file-container", this.el).hide();
        $("input[type=file]", this.el).change($.proxy(this._readImagePreviewURL, this));

        if (this.model.isMissingClockOut()) {
            $("#timecard-out", this.el).hide();
        }

        return this;
    },

    addClockInLocation: function () {
        this.setLocation('#map_in', this.model.get('latitude_in'), this.model.get('longitude_in'));
    },

    addClockOutLocation: function () {
        this.setLocation('#map_out', this.model.get('latitude_out'), this.model.get('longitude_out'));
    },

    setLocation: function(selector, latitudeIn, longitudeOut) {
        var mapDiv = $(selector, this.el),
            latlng = new google.maps.LatLng(latitudeIn, longitudeOut),
            mapOptions = {
                center: latlng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            map = new google.maps.Map(mapDiv[0], mapOptions);

        google.maps.event.addListener(map, "idle", function () {
            map.setCenter(mapOptions.center);
            google.maps.event.trigger(map, 'resize');
        });

        new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
        });
    },

    _setEditMode: function () {
        $("#edit").hide();
        $(".timecard-label").hide();

        $(".file-container").show();
        $("#save").show();
        $(".location-link").show();
        $(".picker").show();
        $("#cancel").show();
        $("#timecard-out").show();

        this._setPickerFields();
        this._setFileUploadFields();

        return false;
    },

    _setViewMode: function () {
        $(".timecard-label").show();
        $("#edit").show();

        $("#save").hide();
        $(".location-link").hide();
        $(".picker").hide();
        $(".file-container").hide();
        $("#cancel").hide();
        $("#gps-error").hide();

        if (this.model.isMissingClockOut()) {
            $("#timecard-out", this.el).hide();
        }

        return false;
    },

    _fetchBrowserLocation: function(callback) {
        navigator.geolocation.getCurrentPosition($.proxy(function (location) {
            this._browserLocation = location;
            //show loading message and hide maps
            $(".overlay").fadeOut();
            $(".full-timecard").fadeIn();
            callback(true, location);
        }, this), function(error) {
            //show gps errors
            $("#gps-error").show();
            $(".overlay").fadeOut();
            $(".full-timecard").fadeIn();
            callback(false);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    },

    _setPickerFields: function() {
        var to = $('#to-timecard').datetimepicker({
                language: 'en',
                maskInput: true,
                pick12HourFormat: true
            }).data('datetimepicker');

        $('#from-timecard').datetimepicker({
                language: 'en',
                maskInput: true,
                pick12HourFormat: true
            }).on('changeDate', function(ev) {
//                if (to && ev.date.valueOf() > to.getDate().valueOf()) {
//                    to.setValue(ev.date);
//                }
            }).data('datetimepicker');
    },

    _setFileUploadFields: function() {
        var model = this.model,
            self = this;

        $('#fileupload-in').fileupload({
            dataType: 'json',
            add: function (e, data) {
                self._photoIn = data;
            }
        });

        $('#fileupload-out').fileupload({
            dataType: 'json',
            add: function (e, data) {
                self._photoOut = data;
            }
        });
    },

    _readImagePreviewURL: function (e) {
        var input = e.target;
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(input.id.indexOf("in") !== -1 ? ".avatar-in" : ".avatar-out").css({'background-image': 'url(' + e.target.result + ')'});
            }

            reader.readAsDataURL(input.files[0]);
        }
    },

    _setBrowserLocationIn: function() {
        if (!this._browserLocation) {
            this._setBrowserLocation(this, true);
        }else{
            this._locationIn = this._browserLocation;
            this.setLocation('#map_in', this._locationIn.coords.latitude, this._locationIn.coords.longitude)
        }

        return false;
    },

    _setBrowserLocationOut: function() {
        if (!this._browserLocation) {
            this._setBrowserLocation(this, false);
        }else{
            this._locationOut = this._browserLocation;
            this.setLocation('#map_out', this._locationOut.coords.latitude, this._locationOut.coords.longitude)
        }

        return false;
    },

    _setBrowserLocation: function(scope, inOrOut) {
        $(".full-timecard").fadeOut();
        $(".overlay").fadeIn();
        this._fetchBrowserLocation(function (status, location) {
            if (status) {
                if (inOrOut) {
                    scope._locationIn = location;
                }else{
                    scope._locationOut = location;
                }

                scope.setLocation(inOrOut ? "#map_in" : "#map_out", location.coords.latitude, location.coords.longitude)
            }else{
                scope.setLocation(inOrOut ? "#map_in" : "#map_out", 0, 0);
            }
        });
    },

    _update: function() {
          var from = $('#from-timecard').data("DateTimePicker"),
                to = $('#to-timecard').data("DateTimePicker");

        if (from.getDate()) {
            var date = from.getDate();
            this.model.set('timestamp_in', moment(date).utc().format('DD/MM/YYYY hh:mm:ss A'));
        }

        if (to.getDate()) {
            var date = to.getDate();
            this.model.set('timestamp_out', moment(date).utc().format('DD/MM/YYYY hh:mm:ss A'));
        }

        if (this._locationIn) {
            var location = this._locationIn;
            this.model.set('latitude_in', location.coords.latitude);
            this.model.set('longitude_in', location.coords.longitude);
        }

        if (this._locationOut) {
            var location = this._locationOut;
            this.model.set('latitude_out', location.coords.latitude);
            this.model.set('longitude_out', location.coords.longitude);
        }

        if (this._photoIn) {
            this._photoIn.submit();
        }

        if (this._photoOut) {
            this._photoOut.submit();
        }

        this.model.save();
        this._setViewMode();
        return false;
    }
});
