Timecards.Views.Timecard = Backbone.View.extend({
    _browserLocation: null,

    editing: false,

    template: JST['timecards/timecard'],

    render: function () {
        $(this.el).html(this.template({ model: this.model }));

        this.addClockInLocation();
        this.addClockOutLocation();


        $(".avatar-in", this.el).css({'background-image': 'url(' + this.model.get('photo_in_url') + ')'});
        $(".avatar-out", this.el).css({'background-image': 'url(' + this.model.get('photo_out_url') + ')'});
        $("html, body").animate({ scrollTop: "0px" });

        $("#edit", this.el).on('click', $.proxy(this.edit, this));
        $("#browser-in", this.el).on('click', $.proxy(this.setBrowserLocationIn, this));
        $("#browser-out", this.el).on('click', $.proxy(this.setBrowserLocationOut, this));
        $("div.overlay", this.el).hide();

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

    edit: function () {
        this.editing = !this.editing;

        $("label").toggle();
        $("a.location-link").toggle();
        $("div.picker").toggle();

        if (this.editing) {
            var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                },
                from = $('#from').datetimepicker({
                    language: 'en',
                    pick12HourFormat: true
                }).on('changeDate', function(ev) {
                    if (ev.date.valueOf() > to.date.valueOf()) {
                        to.setValue(ev.date);
                    }
                    from.hide();
                }).data('datepicker'),
                to = $('#to').datetimepicker({
                    language: 'en',
                    pick12HourFormat: true
                }).on('changeDate', function(ev) {
                    to.hide();
                }).data('datepicker');

            $("#timecard-out").show();
            $("div.map").fadeOut();
            $("div.picker").fadeOut();
            $("div.overlay").fadeIn();

            navigator.geolocation.getCurrentPosition($.proxy(function (location) {
                this._browserLocation = location;
                //show loading message and hide maps
                $("div.overlay").fadeOut();
                $("div.map").fadeIn();
                $("div.picker").fadeIn();
                $("#gps-error").hide();
            }, this), function(error) {
                //show gps errors
                $("#gps-error").show();
                $("div.overlay").fadeOut();
                $("div.map").fadeIn();
            }, options);


        }else{
            $("#gps-error").hide();

            if (this.model.isMissingClockOut()) {
                $("#timecard-out", this.el).hide();
            }
            //PUT update
        }

        return false;
    },

    setBrowserLocationIn: function() {
        var location = this._browserLocation;

        location ?
            this.setLocation('#map_in', location.coords.latitude, location.coords.longitude) :
            this.setLocation('#map_in', 0, 0);

        return false;
    },

    setBrowserLocationOut: function() {
        var location = this._browserLocation;

        location ?
            this.setLocation('#map_out', location.coords.latitude, location.coords.longitude) :
            this.setLocation('#map_out', 0, 0);

        return false;
    }
});
