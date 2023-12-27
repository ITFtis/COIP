(function ($) {
    'use strict';
    $.t_position = {
        eventKeys: {
            initUICompleted: "initUICompleted"
        }
    };
    var pluginName = 'tposition';
    var pluginclass = function (element, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.settings = undefined;
        this.tpdatas = [];
        this.districts = undefined;
        this.alltribes = undefined;
        this.$_tribepolygon = undefined;
        this.$_tribepoint = undefined;
        this.$_addressContainer = undefined;
        this.$_baseposition = undefined;
    };

    pluginclass.prototype = {
        constructor: pluginclass,
        init: function (options) {
            this.settings = $.extend(this.settings, options);
            var that = this;
            this.$element.on($.menuctrl.eventKeys.popu_init_after, function () {
                helper.misc.showBusyIndicator(that.$element);
                datahelper.getTribePolygonGeojsonData(function (ds) {
                    that.tpdatas = ds;
                    that.districts = {};
                    $.each(ds, function () {
                        var c = this['縣市'];
                        var t = this['鄉鎮市'];
                        var tribe = this['部落名稱'];
                        if (c == undefined)
                            return;
                        if (!that.districts.hasOwnProperty(c))
                            that.districts[c] = {};
                        if (t == undefined)
                            return;
                        if (!that.districts[c].hasOwnProperty(t))
                            that.districts[c][t] = [];
                        if (tribe == undefined)
                            return;
                        that.districts[c][t].push(this);
                        //that.alltribes.push(this);
                    });

                    that.initUI();
                });
                datahelper.getTribePointGeojsonData(function (ds) {
                    that.alltribes = ds;
                    that.initUI();
                });
                //}, 400);
            });
        },
        initUI: function () {
            if (!this.districts || !this.alltribes)
                return;
            
            var that = this;
            helper.misc.hideBusyIndicator(that.$element);
            ////////面定位
            $('<div class="position-title">部落定位</div>').appendTo(this.$element);
            var $c = $('<div class="ctrl-container">').appendTo(this.$element);
            var $citySelect = $('<select class="">').appendTo($c);   //縣市
            var $townSelect = $('<select class="">').appendTo($c);   //鄉鎮
            var $tribeSelect = $('<select class="">').appendTo($c);  //部落
            var $polygonconfirm = $('<div class="btn btn-sm btn-outline-success btn-position" title="定位"><span class="glyphicon glyphicon-map-marker"></span></div>').appendTo($c);
            

            $townSelect.on('change', function () {
                $tribeSelect.empty();
                var c = $citySelect.val();
                var t = $townSelect.val();
                $.each(that.districts[c][t], function () {
                    $('<option value="' + this['部落名稱'] + '">' + this['部落名稱'] + '</option>').appendTo($tribeSelect)[0].tribe = this;
                });
            });

            $citySelect.on('change', function () {
                $townSelect.empty();
                var c = $citySelect.val();
                for (var t in that.districts[c]) {
                    $('<option value="' + t + '">' + t + '</option>').appendTo($townSelect);
                }
                $townSelect[0].selectedIndex = 0;
                $townSelect.trigger('change');
            });
            for (var c in this.districts) {
                $('<option value="' + c + '">' + c + '</option>').appendTo($citySelect);
            }
            $citySelect[0].selectedIndex = 0;
            $citySelect.trigger('change');
            this.$_tribepolygon = $('<div class="col-md-12">').appendTo($c);//.hide();
            init原住民族部落_面(this.$_tribepolygon, {
                name:'原住民族部落(面)_定位',
                useLabel: true,
                checkDataStatus: function (data, index) {
                    //data.kmlStatus.strokeWeight = 1.5;
                    data.kmlStatus.fillOpacity = 0;
                    return data.kmlStatus;
                }
            });
            $polygonconfirm.on('click', function () {
                that.clear();
                var geojson = $tribeSelect.find('> option[value="' + $tribeSelect.val() + '"]')[0].tribe.geojson;
                var _lopts = { dashArray: '10, 4, 1, 4, 1, 4', color: '#333', weight: 2, opacity: .8, fillColor: '#ff0000', fillOpacity: .08, bubblingMouseEvents: false };
                that.$_tribepolygon.KmlCtrl('setFilter', function (d) {
                    return d["部落名稱"] == $tribeSelect.val();
                });
                that.$_tribepolygon.find('.pinswitch').prop('checked', true).trigger('change');
                that.$_tribepolygon.find('.pinlabel').prop('checked', true).trigger('change');

                $cancel.removeClass("disabled");
                app.map.flyToBounds(L.geoJSON(geojson, _lopts).getBounds(), { duration: .5 });
            });
            ////////點定位
            $('<div class="position-title">部落名稱定位</div>').appendTo(this.$element);
            var $p_c = $('<div class="ctrl-container">').appendTo(this.$element);
            var $nameSelect = $('<select class="name-position-select">').appendTo($p_c);   //縣市
            var $pointconfirm = $('<div class="btn btn-sm btn-outline-success btn-position" title="定位"><span class="glyphicon glyphicon-map-marker"></span></div>').appendTo($p_c);
            $.each(this.alltribes, function () { //value用this['編號']不用this['部落名稱']，原因point同一部落有多點
                $('<option value="' + this['編號'] + '">' + this['部落名稱'] + '</option>').appendTo($nameSelect)[0].tribe = this;;
            });
            $nameSelect.selectpicker({ liveSearch: true, container: 'body', noneResultsText: '無符合條件 {0}', noneSelectedText: '' });//.addClass('sadsad');

            this.$_tribepoint = $('<div class="col-md-12">').appendTo($c).hide();
            init原住民族部落_點(this.$_tribepoint, { useLabel:true});
            $pointconfirm.on('click', function () {
                that.clear();
                var geojson = $nameSelect.find('> option[value="' + $nameSelect.val() + '"]')[0].tribe.geojson;
                that.$_tribepoint.KmlCtrl('setFilter', function (d) {
                    return d["編號"] == $nameSelect.val();
                });
                that.$_tribepoint.find('.pinswitch').prop('checked', true).trigger('change');
                that.$_tribepoint.find('.pinlabel').prop('checked', true).trigger('change');
               
                $cancel.removeClass("disabled");
                app.map.flyTo([geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]], 15);
            });

            $('<div class="position-title">地址、地標定位</div>').appendTo(this.$element);
            this.$_addressContainer = $('<div class="ctrl-container"></div>').appendTo(this.$element)
            .addressGeocode({ map: app.map }).on($.addressGeocode.eventKeys.ui_init_completed, function () {
                that.$_addressContainer.find('.btn').addClass('btn btn-outline-info');
            }).on($.addressGeocode.eventKeys.select_change, function () {
                that.clear(true);
                //enableClearGeoBtn();
                $cancel.removeClass("disabled");
            });

            $('<div class="position-title">坐標定位</div>').appendTo(this.$element);
            this.$_baseposition = $('<div class="ctrl-container"></div>').appendTo(this.$element)
                .BasePosition({ map: app.map });
            this.$_baseposition.find('.wgs84Div .btn,.twd97Div .btn').text("").addClass('glyphicon glyphicon-map-marker').click(function () {
                $cancel.removeClass("disabled");
            });
            //清除
            var $cancel = $('<div class="cancel-container"><span class="btn btn-danger btn-cancel glyphicon glyphicon-remove disabled">清除</span></div>').appendTo(this.$element).find('.btn');

            $cancel.on('click', function () {
                that.clear();
            });

            this.$element.trigger($.t_position.eventKeys.initUICompleted);
        },
        clear: function (fromAddressGeocodeChange) {
            this.$element.find('.cancel-container > .btn').addClass("disabled", '');
            if (this.$_tribepoint)
                this.$_tribepoint.find('.pinswitch').prop('checked', false).trigger('change');
            if (this.$_tribepolygon)
                this.$_tribepolygon.find('.pinswitch').prop('checked', false).trigger('change');
            if (!fromAddressGeocodeChange && this.$_addressContainer)
                this.$_addressContainer.addressGeocode('clear');
            if (this.$_baseposition)
                this.$_baseposition.find('.btn.pull-right').trigger('click');
        }

    };


    $.fn[pluginName] = function (arg) {

        var args, instance;

        if (!(this.data(pluginName) instanceof pluginclass)) {

            this.data(pluginName, new pluginclass(this[0]));
        }

        instance = this.data(pluginName);


        if (typeof arg === 'undefined' || typeof arg === 'object') {

            if (typeof instance.init === 'function') {
                instance.init(arg);
            }
            this.instance = instance;
            return this;

        } else if (typeof arg === 'string' && typeof instance[arg] === 'function') {

            args = Array.prototype.slice.call(arguments, 1);

            return instance[arg].apply(instance, args);

        } else {

            $.error('Method ' + arg + ' does not exist on jQuery.' + pluginName);

        }
    };
}(jQuery));