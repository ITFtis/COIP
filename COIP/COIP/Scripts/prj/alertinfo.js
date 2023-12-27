
/****************cloud plugin****************/
(function ($) {
    'use strict';
    var pluginName = 'alertinfo';

    var pluginclass = function (element, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.settings = undefined;
        this.$table = undefined;
        this.alertinfos = undefined;

        this.$_tooltip = undefined;
        //this.$_tribepolygon = $('<div class="col-md-12">').appendTo("body").hide();
    };

    pluginclass.prototype = {
        constructor: pluginclass,
        init: function (options) {

            var current = this;

            $.extend(this.settings, options);

            this.$element.on($.menuctrl.eventKeys.popu_init_before, function () {
                if (current.isInitCompleted)
                    return;
                current.initUi();
                current.isInitCompleted = true;
            });
        },
        initUi: function () {
            this.$element.empty();
            $('<div>土石流警戒資訊</div>').appendTo(this.$element);
            this.$table = $('<table>').appendTo(this.$element);
            this._reload();
        },
        _reload: function () {
            var that = this;
            helper.misc.showBusyIndicator(that.$element);
            $.get('https://data.coa.gov.tw/Service/OpenData/FromM/GetCustomerDebrisAlertInfo.aspx', function (ds) {
                if (typeof ds == "string")
                    ds = JSON.parse(ds);

                var ndt = new Date();
                if (ds.errorMessage)
                    ds = [{ "county": "南投縣", "town": "仁愛鄉", "vill": "南豐村", "debrisNo": "投縣DF010(測)", "alert_date": "", "alert_date_yellow": ndt.DateFormat('yyyy/MM/dd HH:mm:ss') },
                        { "county": "花蓮縣", "town": "秀林鄉", "vill": "水源村", "debrisNo": "花縣DF012(測)", "alert_date": ndt.DateFormat('yyyy/MM/dd HH:mm:ss'), "alert_date_yellow": "" },
                        { "county": "高雄市", "town": "桃源區", "vill": "建山里", "debrisNo": "高市DF064(測)", "alert_date": ndt.DateFormat('yyyy/MM/dd HH:mm:ss'), "alert_date_yellow": "" }
                    ];
                that.alertinfos = ds;
                that._repainttable();
                helper.misc.hideBusyIndicator(that.$element);
            });
        }
        , _repainttable: function () {
            var that = this;
            this.$table.bootstrapTable('destroy').
                bootstrapTable({
                    //height: $(window).height() - 48,
                    striped: true,
                    data: this.alertinfos,
                    columns: [
                        { field: 'town', title: '狀態',align:'center', formatter: function (v, d) { return '<img src="Images/' + (d.alert_date ? '土紅' :'土黃')+'.png">' } },
                        { field: 'debrisNo', title: '編號' },
                        { field: 'county', title: '位置', formatter: function (v, d) { return d.county + d.town + d.vill; } },
                        { field: '"alert_date', title: '時間', formatter: function (v, d) { return d.alert_date ? d.alert_date : d.alert_date_yellow; }  }
                    ],
                    //rowStyle: function (d, isx, sds) {
                    //    return { classes: d.alert_date ? 'red' : 'yellow' };
                    //},
                    onClickRow: function (d, $element) {
                        datahelper.getTribePolygonGeojsonData(function (ds) {
                            var jl = [];
                            $.each(ds, function (g) {
                                if (this.縣市 == d.county && this.鄉鎮市 == d.town && this.村里 == d.vill)
                                    jl.push(L.geoJSON(this.geojson));
                            });
                            if (jl.length > 0) {
                                var lg = L.featureGroup(jl);
                                app.map.flyToBounds(lg.getBounds(), { duration: .5 });
                            }
                        })
                    }
                });
            setTimeout(function () {
                if (!that.$_tooltip)
                    that.$_tooltip= $('<i style="position:absolute !important;"/>').appendTo($('body'))
                var _timerflag;
                $("tbody > tr", that.$table).on('mousemove', function (e) {
                //$("tbody > tr", that.$table).on('mouseenter', function (e) {
                    clearTimeout(_timerflag);
                    _timerflag = setTimeout(function () {
                        var wiw = window.innerWidth;
                        var px = e.pageX;
                        var p = wiw - px > 180 ? "right" : "left";
                        
                        var $tr = $(e.target).closest("tr");
                        if (!$tr)
                            $tr = $(e.target);
                        //console.log('e.pageY:' + e.pageY + '<> offset().top:' + $tr.offset().top + '<>h:' + $tr.height());
                        var _a = that.alertinfos[$tr.attr("data-index")];
                        datahelper.getTribePolygonGeojsonData(function (ds) {
                            var _ds = $.grep(ds, function (_d) { return _d.縣市 == _a.county && _d.鄉鎮市 == _a.town && _d.村里 == _a.vill });
                            _ds = $.map(_ds, function (_d) { return _d.部落名稱 });
                            _ds.splice(0,0,'影響部落 :');
                            that.$_tooltip.attr("title", _ds.join('<br>'));
                            that.$_tooltip.css({ top: e.clientY, left: e.clientX + (p == "right" ? 20 : -20) }).tooltip('dispose').tooltip({
                            //that.$_tooltip.css({ top: $tr.offset().top + $tr.height()/2, left: e.clientX + (p == "right" ? 20 : 0) }).tooltip('dispose').tooltip({
                                placement: function (asd, fds) {
                                    return p;
                                },
                                html:true
                            }).tooltip('show');
                        });
                    }, 100);
                }).on('mouseleave', function (e) {
                    that.$_tooltip.tooltip('hide');
                    clearTimeout(_timerflag);
                });
            });
        }

    }

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

})(jQuery);