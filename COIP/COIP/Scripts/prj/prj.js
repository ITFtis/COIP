//https://gitlab.transportdata.tw/0901107/coip.git

var app = app || {
    map: undefined, taiwancenter: [23.8, 121],
    tribePolygonGeojsonData:undefined,
    getTribePolygonGeojsonData: function (callback) {
        var _kmlCtrl = this;
        if (app.tribePolygonGeojsonData)
            callback(JSON.parse(JSON.stringify(app.tribePolygonGeojsonData)));
        else {
            var _kc = helper.misc.localCache.get(datahelper.kmlSource.village + app.kmlVersion);
            if (_kc) {
                app.villageGeojsonData = JSON.parse(_kc);
                app.getVillageGeojsonData(callback);
            }
            else {
                var kcl = new LKmlCtrl(_kmlCtrl, function () {
                    kcl.loadKml(datahelper.kmlSource.village, function (ds) {
                        app.villageGeojsonData = ds;
                        callback(JSON.parse(JSON.stringify(app.villageGeojsonData)));
                    });
                });
            }
        }
    },
};
$.AppConfigOptions.require.all(function () {

    $('button').tooltip();
    //$('#mainmenu .dropdown ').click(function () {
    //    $(this).toggleClass('open');
    //});
    var _mapOptions = { zoomControl: false, trackResize: true };
    app.map = L.map(document.getElementById('map'), _mapOptions);
    /*L.control.scale({ position: 'bottomleft', metric: true, imperial: true }).addTo(app.map);*/
    L.control.graphicScale({ fill: 'fill', doubleLine: true, labelPlacement: 'bottom', position: 'bottomright' }).addTo(app.map);
    $('.leaflet-control-graphicscale').addClass('print-dom');
   // L.control.graphicScale({ fill: 'fill', doubleLine: true, labelPlacement: 'bottom', position: 'bottomright'}).addTo(app.map);
    //setTimeout(function () {
    //    $('.leaflet-control-graphicscale').appendTo($('.leaflet-bottom.leaflet-left'));
    //}, 5000);
    //預載資料
    setTimeout(function () {
        datahelper.getTribePolygonGeojsonData(function () { });
        datahelper.getTribePointGeojsonData(function () { });
    });
    
    delete $.MapBaseLayerDefaultSettings.tiles.MAP_TYPE_PHYSICAL_HYBRID;

    $.MapBaseLayerDefaultSettings.tiles['正射'] = { //20220718新增
        id: "tgos正射",
        name: "正射",
        type: "WebTiledLayer",
        url: document.location.protocol + "//wmts.nlsc.gov.tw/wmts/PHOTO_MIX/default/GoogleMapsCompatible/${level}/${row}/${col}",///TOGS範例https://api.tgos.tw/TGOS_MAP_API/Docs/Example/94
        options: { subDomains: ["", "", ""] }
    };
    $.MapBaseLayerDefaultSettings.tiles['通用版'] = { //override原有的通用版 20210510
        id: "tgos通用版",
        name: "通用版",
        type: "WebTiledLayer",
        url: document.location.protocol + "//wmts.nlsc.gov.tw/wmts/EMAP5/default/GoogleMapsCompatible/${level}/${row}/${col}",///TOGS範例https://api.tgos.tw/TGOS_MAP_API/Docs/Example/94
        options: { subDomains: ["", "", ""] }
    };

    //測試WMS
    var riverglnLayer = undefined;
    $('<div>').appendTo($('body')).PinCtrl({
        map: app.map, name: "流域", useLabel: false, useList: false
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        $(this).find('.pinswitch').off('change').change(function () {
            if (riverglnLayer == undefined) {
                app.map.createPane('wms-layer-panel').style.zIndex = 202;
                riverglnLayer = L.tileLayer.wms("https://maps.wra.gov.tw/arcgis/services/WMS/GIC_WMS/MapServer/WMSServer", {
                    version: "1.1.1", service: "WMS", requert: "GetMap", format: "image/png", transparent: "TRUE", styles: "",
                    layers: "RIVREGLN", srs: "EPSG:4326", pane: 'wms-layer-panel'
                });
            }
            if ($(this).is(':checked')) 
                riverglnLayer.addTo(app.map);
            else
                riverglnLayer.remove();
        });
    });

    $("#basemapDiv").MapBaseLayer({ map: app.map, defaultLayer: $.MapBaseLayerDefaultSettings.tiles.通用版.name });
    app.map.setView(app.taiwancenter, 8);
    $.initGisMenu('mainmenu'); //初始化menu 
    //雲圖
    var $_cloud =$('#cloud').cloud({ map: app.map, clouds: cwbcloudoptions, initEvent: $.menuctrl.eventKeys.popu_init_before });
    //颱風資訊
    var $_typh =$('#typh').typh({ map: app.map, initEvent: $.menuctrl.eventKeys.popu_init_before });
    //rainCtrl = $("#reservoirctrldiv").WaterCtrl({
    //    map: app.map, useSearch: true, enabledStatusFilter: true, cluster: true, //,clusterRadius:0
    //}).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
    //    //$(this).find('.legend-icon:first-child,.legend-icon:last-child').trigger('click');
    //    //$(this).find('.legend-icon:last-child').trigger('click');
    //});
    //繪圖標註 
    var $_drawDiv = $('#drawDiv').gisdrawtool({ map: app.map, guid: helper.misc.geguid(), types: [{ type: 'CIRCLEMAKER', name: ' 點 ', classid: "pointimg" }, $.gisdrawtool.types.POLYLINE, $.gisdrawtool.types.POLYGON, $.gisdrawtool.types.FREEHAND_POLYLINE, { type: $.gisdrawtool.types.POINT.type, name: ' 字 ', classid: "textimg" }], initEvent: $.menuctrl.eventKeys.popu_init_before, colorSelector: true })
        .on($.gisdrawtool.event_key.initUICompleted, function () {
            $_drawDiv.instance._mapctrl.drawGeo[$.gisdrawtool.types.POINT.type] = new L.Draw.Marker(app.map, {
                icon: L.divIcon({
                    html: '<div class="input-group draw-text-contanier" ><input type="text" class="form-control" placeholder="請輸入標註文字"><div class="input-group-append"><span class="input-group-text glyphicon glyphicon-ok"></span></div></div>',
                    className: 'textIcon textIcon-drawing',
                    iconSize: [180, 32],
                    iconAnchor: [90, 12],
                    guid: $_drawDiv.instance._mapctrl.guid
                }),
                repeatMode: true
            });
            $_drawDiv.instance._mapctrl.setStrokeWeight(2);
            $('.btn-group .btn', $_drawDiv).on('click', function (ev, s) {
                if (s != 'pause') { //從下面code呼叫的，文字point
                    if ($(this).hasClass('work'))
                        $_drawDiv[0].workitem = this; //編輯玩文字用到
                    else
                        $_drawDiv[0].workitem = null;
                }
                //取消測量
                //$('.btn-group .btn.work', $_measurDiv).removeClass('work');//.trigger('click');
                //if ($_measurDiv.instance._mapctrl) $_measurDiv.instance._mapctrl.stop();
            });
        }).
        on($.gisdrawtool.event_key.add_graphic, function (evt, g, gs) {

            if (g._icon && $(g._icon).hasClass('textIcon-drawing')) {
                var $_c = $(g._icon);
                $_c.removeClass('textIcon-drawing');
                setTimeout(function () {
                    $_c.find('input').focus()
                }, 100);
                $_c.find('.glyphicon-ok').on('click', function () {
                    if (!$_c.find("input").val()) {
                        alert('請輸入資料!!');
                        return;
                    }
                    $_c.find('.draw-text-contanier').html('<label>' + $_c.find("input").val() + '</label>').addClass('display-label');
                    $_c.find('label').css('color', $_drawDiv.instance._mapctrl.fillColor);
                    $_c[0].style.width = 'auto';
                    var usetooltip = true;
                    if (usetooltip) {
                        g.bindTooltip($_c.find('.draw-text-contanier')[0].outerHTML,
                            { direction: 'top', sticky: true, permanent: true });
                        g.openTooltip();
                    }

                    setTimeout(function () {
                        $_c[0].style.marginLeft = -$_c.width() / 2 + 'px';
                        if (usetooltip)
                            $_c.empty();
                    });
                    setTimeout(function () {
                        if ($_drawDiv[0].workitem)
                            $($_drawDiv[0].workitem).trigger('click');
                    });
                });
                $_c.find("input").on('keyup', function (e) {
                    if (e.keyCode === 13)
                        $_c.find('.glyphicon-ok').trigger('click');
                });
                //.get(0).focus();
                setTimeout(function () {
                    $_drawDiv.find('.textimg').trigger('click', 'pause');
                    $_c.find("input").get(0).focus();
                });
            }
        });

    $('#_zoomin').on('click', function () {
        app.map.zoomIn();
    });
    $('#_zoomout').on('click', function () {
        app.map.zoomOut();
    });
    $('#_twfullext').on('click', function () {
        app.map.setView(app.taiwancenter, 8);
    });
    $('#_export').on('click', function () {
        helper.misc.showBusyIndicator();
        var m = $('#map')[0];
        //$('#_zoomout').trigger('click');
        //domtoimage.toBlob(m)//taiwancenter: [23.7, 121]會有問題，改taiwancenter: [23.7, 121]就OK??
        //    .then(function (blob) {
        //        window.saveAs(blob, 'map.png');
        //        helper.misc.hideBusyIndicator();
        //    }).catch(function (error) {
        //        console.error('oops, something went wrong!', error);
        //    });
        $('body').addClass('print');
        var $_l = $('#legendDiv');
        var $_lp = $_l.parent();
        $_l.appendTo('#map .print-legend');//.addClass('')
        //多一層包map，為了避免匯出圖時右邊及下方會多出邊界(因該是圖關係)
        domtoimage.toJpeg(document.getElementById('map-container'), { quality: 0.95 })
        //domtoimage.toJpeg($("#mainmenu img")[0], { quality: 0.95 })
            .then(function (dataUrl) {
                var base64String = dataUrl.split(',')[1];
                base64String = dataUrl.split('/');
                var link = document.createElement('a');
                link.download = 'map.jpg';
                link.href = dataUrl;
                link.click();
                helper.misc.hideBusyIndicator();
                $('body').removeClass('print');
                $_l.appendTo($_lp);
            }).catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    });
    $("#documentMake > .btn").on('click', function (event) {
        event.preventDefault()
        //    });
        $('body').addClass('print');
        var $_l = $('#legendDiv');
        var $_lp = $_l.parent();
        $_l.appendTo('#map .print-legend');
        var $_documentMake = $('#documentMake');
        domtoimage.toJpeg(document.getElementById('map-container'), { quality: 0.95 })
            //domtoimage.toJpeg($("#mainmenu img")[0], { quality: 0.95 })
            .then(function (dataUrl) {
                var base64String = dataUrl.split(',')[1];
                helper.misc.openNewWindowByPost("api/download/pdf", {
                    Imageb64: base64String,
                    Name: "說帖產製",
                    Title: $_documentMake.find('.title').val(),
                    Reason: $_documentMake.find('.reason').val(),
                    Attributes: $_documentMake.find('.attributes').val(),
                    Distributed: $_documentMake.find('.distributed').val(),
                    Issues: $_documentMake.find('.issues').val()
                }, "_self");
                    helper.misc.hideBusyIndicator();
                    $('body').removeClass('print');
                    $_l.appendTo($_lp);
                //}
              
            }).catch(function (error) {
                console.error('oops, something went wrong!', error);
                helper.misc.hideBusyIndicator();
                $('body').removeClass('print');
                $_l.appendTo($_lp);
            });
    });
    $('#_cancel').on('click', function () {
        $('#positionDiv').tposition('clear');   //定位
        $('.pinctrl .pinswitch:checked').prop('checked', false).trigger('change');
        $('.checked', $_cloud).trigger('click');
        if ($('select[data-typhlist]', $_typh).length > 0) {
            $('select[data-typhlist]', $_typh)[0].selectedIndex = 0;
            $('select[data-typhlist]', $_typh).trigger('change');
        }
    })

    var $_cinfo = $('#coordinateInfoDiv').CoordinateInfo({ map: app.map, display: $.CoordinateInfo.display.WGS84_TWD97, content_padding: 1, initEvent: $.menuctrl.eventKeys.popu_init_before })
        .on($.CoordinateInfo.eventKeys.initUICompleted, function () {
            var ss = [600000000, 300000000, 150000000, 74000000, 37000000, 18500000, 9200000, 4600000, 2300000, 1150000, 580000, 290000, 145000, 72000, 36000, 18000, 9000, 4500, 2000,1000,500,250];
            $_cinfo.instance._mapctrl.changeCoordinates = function (_p) {
                if (_p) {
                    //console.log(JSON.stringify( L.Projection.project(_p).getLatLng()));
                    this.mainctrl.showCoordinates({ x: _p.lng, y: _p.lat }, ss[this.map.getZoom()]);
                }
            };
            $_cinfo.instance._mapctrl.changeCoordinates(app.map.getCenter());
        });


    //基本圖層
    $('#basicdataDiv').basicdata();
    //部落定位
    $('#positionDiv').tposition();
    ////防災圖資
    //$('#disasterPreventionData').disasterpreventiondata();
    //警戒資訊
    $('#alertinfo').alertinfo();
    publicLink();
    //$(document).on($.BasePinCtrl.eventKeys.pinShowChange, function (e, s) {

    var $_legendDiv = $("#legendDiv");
    $(document).on('change','.pinswitch', function (e, s) {
        var $_this = $(e.target); //.pinswitch
        var $_pinctrl = $_this.closest('.pinctrl');
        var id = $_pinctrl.attr('id');
        var s = $_this.is(':checked');
        var $_l = $_legendDiv.find('.legend-' + id);
        var n = $_pinctrl.find('.checkbox-name').text();

        if ($_l.length > 0) {
            var sdd = $_l.first()[0].outerHTML;
            setTimeout(function () {
                if ($_this.closest("#positionDiv").length > 0 && !$_l.hasClass('hasrename')) { //
                    $_l.addClass('hasrename').find('.legend-name').text($_l.find('.legend-name').text() + '_定位');
                }
            },100);
            $_l.prependTo($_legendDiv); //放置最上方
            if ($_pinctrl.hasClass('feature-ctrl'))
                setTimeout(function () {
                    $_l.html('<div class="legend-icon" style="background-image: url(\'images/legend/' + n.replace('(', '_').replace(')', '').replace('%', 'P') + '.png\');">' + n + '</div>');
                }, 200);
        }else { //無圖例圖層，如WMS, 抓geojson
            //var _img = encodeURI('images/legend/' + n + '.png');
            //$_l = $('<div class="legend legend-' + id + '"><div class="legend-icon" style="background-image: url(\'' + _img+'\');">' + n + '</div></div>').prependTo($_legendDiv);
            $_l = $('<div class="legend legend-' + id + '"><div class="legend-icon" style="background-image: url(\'images/legend/' + n.replace('(', '_').replace(')', '').replace('%', 'P')+'.png\');">'+n+'</div></div>').prependTo($_legendDiv);
        }
        if (!s)
            $_l.addClass('offdisplay');
        else
            $_l.removeClass('offdisplay');

        //無套疊訊息
        if ($_legendDiv.find('.legend:not(.offdisplay)').length > 0)
            $_legendDiv.find('.msg').hide();
        else
            $_legendDiv.find('.msg').show();
    });
});


