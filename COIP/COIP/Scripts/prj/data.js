
(function (window) {
    var getData = function (option, callback) {

        var _ajaxoptions = $.extend({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8", //加contentType IE有問題，但放在server同一domain是OK的
            //async: _async,
            //data: _para
        }, option);

        $.ajax(_ajaxoptions)
            .done(function (dat, status) {
                //console.log(apiName + '結果:' + JSON.stringify(dat));
                callback(dat);
            }).fail(function (dat, status) {
                console.log('error:' + dat.responseText);
            });
    };

    var getTribePolygonGeojsonData = function (callback) {
        //var _kmlCtrl = this;
        var _kmlCtrl = { settings: $.extend({ map: app.map }, $.KmlCtrl.defaultSettings) };
        _kmlCtrl.settings.type = $.BasePinCtrl.type.polygon;
        _kmlCtrl.settings.name = '原住民族部落(面)';
        if (window.tribePolygonGeojsonData)
            callback(JSON.parse(JSON.stringify(window.tribePolygonGeojsonData)));
        else {
            var _kc = helper.misc.localCache.get(datahelper.kmlSource.tribe_polygon);
            if (_kc && _kc.v == datahelper.kmlSource.version) {
                window.tribePolygonGeojsonData = _kc.d;
                getTribePolygonGeojsonData(callback);
            }
            else {
                helper.misc.localCache.remove(datahelper.kmlSource.tribe_polygon);
                var kcl = new LKmlCtrl(_kmlCtrl, function () {
                    kcl.loadKml(datahelper.kmlSource.tribe_polygon, function (ds) {
                        $.each(ds, function () {
                            //this.kmlStatus.classes += " tribe-polygon";
                            this.placemarTitle = this.placemarkName = this['部落名稱'];
                            this.kmlDescription = _filterdesc( this.geojson.properties.description,this);
                        });
                        window.tribePolygonGeojsonData = ds;
                        callback(JSON.parse(JSON.stringify(window.tribePolygonGeojsonData)));
                        //helper.misc.localCache.set(datahelper.kmlSource.tribe_polygon, { v: datahelper.kmlSource.version, d: ds }); 20230928資料量太大會超過localStorage
                    });
                });
            }
        }
    };
    var _filterdesc = function (_desc, obj) {
        //var desobj = $.parserStringToObject(_desc, "<BR>", ":");
        var _idx = _desc.indexOf('TARGET_FID') >= 0 ? _desc.indexOf('TARGET_FID') : _desc.indexOf('FID');
        if (_idx >= 0) {
            _idx = _desc.indexOf('<BR>', _idx);
            _desc= _desc.substr(_idx + 4);
        }
        
        if (obj.成果 == 1) 
            _desc = _desc.replace(/成果:1/g, '<a href="Data/PDF/1.部落調查成果/' + obj.編號 + '.pdf' +'" target="pdf成果">部落調查成果</a>')
        
        if (obj.評估表 == 1) 
            _desc = _desc.replace(/評估表:1/g, '<a href="Data/PDF/2.部落安全評估表/' + obj.編號 + '.pdf' + '" target="pdf評估表">部落安全評估表</a>')
        //_desc = _desc.replace(/評估表:1/g, '<a href="http://210.59.250.119:8080/COIP/Data/PDF/2.部落安全評估表/' + obj.編號 + '.pdf' + '" target="pdf評估表">部落安全評估表</a>')
        
        _desc = _desc.replace(/成果:0<BR>/g, '').replace(/評估表:0<BR>/g, '');//.replace(/成果:1/g, '<a href="#">部落調查成果</a>').replace(/評估表:1/g, '<a href="#">部落安全評估表</a>')
        
        //for (var k in desobj) {
        //    if (desobj[k].startsWith('$')) {
        //        _desc = _desc.replace(k+':','')
        //        _desc = _desc.replace(desobj[k], '<a href="Data/PDF/' + desobj[k].replace('$', '') + '" target="'+k+'">'+k+'</a>')
        //    }
        //}

        return convertKmlDescript2Link(_desc);
    }
    var getTribePointGeojsonData = function (callback) {
        //var _kmlCtrl = this;
        var _kmlCtrl = { settings: $.extend({ map: app.map }, $.KmlCtrl.defaultSettings) };
        _kmlCtrl.settings.name = '原住民族部落(點)';
        if (window.tribePointGeojsonData)
            callback(JSON.parse(JSON.stringify(window.tribePointGeojsonData)));
        else {
            var _kc = helper.misc.localCache.get(datahelper.kmlSource.tribe_point);
            if (_kc && _kc.v == datahelper.kmlSource.version) {
                window.tribePointGeojsonData = _kc.d;
                getTribePointGeojsonData(callback);
            }
            else {
                helper.misc.localCache.remove(datahelper.kmlSource.tribe_point);
                var kcl = new LKmlCtrl(_kmlCtrl, function () {
                    kcl.loadKml(datahelper.kmlSource.tribe_point, function (ds) {
                        $.each(ds, function () {
                            this.placemarTitle = this.placemarkName = this['部落名稱'];
                            this.kmlDescription = _filterdesc(this.geojson.properties.description, this);
                        });
                        window.tribePointGeojsonData = ds;
                        callback(JSON.parse(JSON.stringify(window.tribePointGeojsonData)));
                        helper.misc.localCache.set(datahelper.kmlSource.tribe_point, { v: datahelper.kmlSource.version, d: ds });
                    });
                });
            }
        }
    };

    window.datahelper = window.datahelper || {};

    window.datahelper.getTribePolygonGeojsonData = getTribePolygonGeojsonData;        // 取部落面geojson
    window.datahelper.getTribePointGeojsonData = getTribePointGeojsonData;        // 取部落點geojson

    window.datahelper.kmlSource = {
        version:'2023.10.05',
        tribe_polygon: "Data/部落圖資/原住民族部落_面.kmz",
        tribe_point: "Data/部落圖資/原住民族部落_點.kmz",
        土石流潛勢溪流: "Data/土石流潛勢溪流/土石流潛勢溪流.kmz",
        土石流潛勢溪流影響範圍: "Data/土石流潛勢溪流/土石流潛勢溪流影響範圍.kmz",
        特定水土保持區: "Data/行政與土地區界/特定水土保持區.kmz",
        //_107年司馬庫斯崩塌地: "Data/107年司馬庫斯崩塌地.kmz",
        鎮西堡_斯馬庫斯歷史崩塌地: "Data/大規模崩塌/鎮西堡_斯馬庫斯歷史崩塌地.kmz",
        坡地範圍: "Data/行政與土地區界/108年度山坡地範圍圖(水保法不含六都).kmz",
        大規模崩塌潛勢區: "Data/大規模崩塌/LandSlide.kml",
        大規模崩塌影響範圍: "Data/大規模崩塌/LandSlideArea.kml",
        原住民保留地: "Data/行政與土地區界/原住民保留地.kmz",
        地質遺跡地質敏感區: "Data/地質災害潛勢/地質遺跡.kmz",
        地下水補注地質敏感區: "Data/地質災害潛勢/地下水補注地質敏感區.kmz",
        活動斷層地質敏感區: "Data/地質災害潛勢/活動斷層.kmz",
        歷年重大土石災例分布圖: "Data/地質災害潛勢/歷年重大土石災例分布圖.kmz",
        _110年度42區特定水土保持區: "Data/行政與土地區界/110年度42區特定水土保持區範圍圖.kmz",
        特色道路改善計畫103年度: "Data/特色道路改善計畫/103年度.kmz",
        特色道路改善計畫104年度: "Data/特色道路改善計畫/104年度.kmz",
        特色道路改善計畫105年度: "Data/特色道路改善計畫/105年度.kmz",
        特色道路改善計畫106年度: "Data/特色道路改善計畫/106年度.kmz",
        特色道路改善計畫107年度: "Data/特色道路改善計畫/107年度.kmz",
        特色道路改善計畫108年度: "Data/特色道路改善計畫/108年度.kmz",
        特色道路改善計畫109年度: "Data/特色道路改善計畫/109年度.kmz",
        特色道路改善計畫110年度: "Data/特色道路改善計畫/110年度.kmz",
        特色道路改善計畫111年度: "Data/特色道路改善計畫/111年度.kmz",
        第一級生態檢核區: "Data/生態資訊/第一級生態檢核區.kmz",
        水鳥熱點: "Data/生態資訊/水鳥熱點.kmz",
        受脅植物重要棲地: "Data/生態資訊/受脅植物重要棲地.kmz",
        仁愛村卡努颱風受災戶: "Data/卡努颱風/仁愛村卡努颱風受災戶.kmz",
        部落永續建設藍圖規劃成果Path: "Data/部落永續建設藍圖規劃成果/",
        防災社區Path: "Data/防災社區/",
        防災社區避難所資訊Path: "Data/防災社區避難所資訊/",
        歷史災害事件綜整Path: "Data/歷史災害事件綜整/",
        計畫與工程資訊Path: "Data/計畫與工程資訊/"
    }
   
})(window);