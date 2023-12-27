
var init地籍圖 = function ($_container) {
    $_container.PinCtrl({
        map: app.map, name: '地籍圖', useSearch: false, useLabel: false, useList: false, minZoom:99
    });
}
var init段籍圖 = function ($_container) {
    init國土WMTS($_container, '段籍圖', 'LANDSECT');
}
var init公有土地地籍圖 = function ($_container) {
    init國土WMTS($_container, '公有土地地籍圖', 'LAND_OPENDATA');
}

var init縣市界 = function ($_container) {
    init國土WMTS($_container, '縣市界', 'CITY');
}
var init鄉鎮界 = function ($_container) {
    init國土WMTS($_container, '鄉鎮界', 'TOWN');
}
var init村里界 = function ($_container) {
    init國土WMTS($_container, '村里界', 'Village');
}
var init道路路網 = function ($_container) {
    initWMTS($_container, '道路路網', 'https://wmts.nlsc.gov.tw/wmts/ROAD/default/GoogleMapsCompatible/{z}/{y}/{x}');
}

var convertKmlDescript2Link = function (_desc) {
    var desobj = $.parserStringToObject(_desc, "<BR>", ":");
    var _site = '';
    if (location.href.indexOf('localhost') >= 0)
        _site = 'https://pj.ftis.org.tw/COIP/';
    for (var k in desobj) {
        if (desobj[k].startsWith('$')) {
            _desc = _desc.replace('<BR>' + k + ':', '<BR>');
            _desc = _desc.replace(desobj[k], '<a href="'+_site+'Data/PDF/' + desobj[k].replace('$', '') + '" target="' + k + '">' + k + '</a>')
        }
        else if (desobj[k].startsWith('http')) {
            _desc = _desc.replace('<BR>' + k + ':', '<BR>');
            _desc = _desc.replace(desobj[k], '<a href="' + desobj[k] + '" target="' + k + '">' + k + '</a>')
        }
    }
    return _desc;
}

var init部落永續建設藍圖規劃成果 = function ($_container,  name) {
    initKmlCtrl($_container, {
        name: name, minZoom: 1, stTitle: function (d) { return d.placemarkName; },
        type: $.BasePinCtrl.type.polygon,
        classes:'set-max-height',
        pinInfoContent: function (data, infofields) {
            data.kmlDescription = convertKmlDescript2Link(data.kmlDescription);
            return $.KmlCtrl.defaultSettings.pinInfoContent.call(this, data, infofields);
        }
    }, datahelper.kmlSource.部落永續建設藍圖規劃成果Path+name+'.kmz');
}
var init防災社區 = function ($_container, name) {
    initKmlCtrl($_container, {
        name: name, minZoom: 1, stTitle: function (d) { return d.placemarkName; },
        type: $.BasePinCtrl.type.polygon,
        classes: 'set-max-height',
        pinInfoContent: function (data, infofields) {
            data.kmlDescription = convertKmlDescript2Link(data.kmlDescription);
            //data.kmlDescription = data.kmlDescription.replace(/防災社區:/gi, '');//convertKmlDescript2Link replace'防災社區:'
            return $.KmlCtrl.defaultSettings.pinInfoContent.call(this, data, infofields);
        }
    }, datahelper.kmlSource.防災社區Path + name + '.kmz');
}
var init防災社區避難所資訊 = function ($_container, name) {
    initSimplePointKmlCtrl($_container, name, datahelper.kmlSource.防災社區避難所資訊Path);
   
}
var init歷史災害事件綜整 = function ($_container, name) {
    initSimplePointKmlCtrl($_container, name, datahelper.kmlSource.歷史災害事件綜整Path,
        {
            pinInfoContent: function (data, infofields) {
                data.kmlDescription = data.kmlDescription.replace('https:', 'https>'); //並開解析desc切割
                data.kmlDescription = convertKmlDescript2Link(data.kmlDescription);
                data.kmlDescription = data.kmlDescription.replace('https>', 'https:');
                return $.KmlCtrl.defaultSettings.pinInfoContent.call(this, data, infofields);
            }
        });
}
var init計畫與工程資訊 = function ($_container, name) {
    initSimplePointKmlCtrl($_container, name, datahelper.kmlSource.計畫與工程資訊Path);
}
var initSimplePointKmlCtrl = function ($_container, name, kmlpath, options) {
    initKmlCtrl($_container, $.extend({
        name: name, minZoom: 1, stTitle: function (d) { return d.placemarkName; },
        type: $.BasePinCtrl.type.point,
        classes: 'set-max-height',
        legendIcons: [{ 'name': name, 'url': 'Images/legend/' + name + '.png', 'classes': 'blue_status' }],
        pinInfoContent: function (data, infofields) {
            data.kmlDescription = convertKmlDescript2Link(data.kmlDescription);
            return $.KmlCtrl.defaultSettings.pinInfoContent.call(this, data, infofields);
        }
    }, options), kmlpath + name + '.kmz');
}
//var initTestWMTS = function ($_container) {
//    initWMTS($_container, 'initTestWMTS', 'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&x={x}&y={y}&z={z}');
//}
//var initTestWMS = function ($_container) {
//    initWMSCtrl($_container, {
//        name: 'initTestWMS', uppercase:true,
//        wmsurl: 'https://gis.moeacgs.gov.tw/mapguide/mapagent/mapagent.fcgi',
//        wmsopts: { layers: 'WMS/50K_Geomap_strata' }
//    })
//}
var init土壤液化潛勢_中級 = function ($_container) {
    init國土WMTS($_container, '土壤液化潛勢_中級', 'SoilLiquefaction');
}
var init土壤液化潛勢_初級 = function ($_container) {
    init國土WMTS($_container, '土壤液化潛勢_初級', 'SoilLiquefaction');
}
var init地質敏感區 = function ($_container) {
    init國土WMTS($_container, '地質敏感區', 'GeoSensitive');
}
var init地質敏感區_山崩與地滑 = function ($_container) {
    init國土WMTS($_container, '地質敏感區(山崩與地滑)', 'GeoSensitive2');
}
var init避難收容處所 = function ($_container) {
    init國土WMTS($_container, '避難收容處所', 'SHELTERS');
}
var initAED位置 = function ($_container) {
    init國土WMTS($_container, 'AED位置', 'AED');
}
var init土石流潛勢溪流 = function ($_container) {
    initKmlCtrl($_container, {
        name: '土石流潛勢溪流',minZoom:1,
        stTitle: function (d) {
            $.extend(d, d.geojson.properties);
            return d.Debrisno;
        },
        infoFields: [{ field: 'Debrisno', title: 'Debrisno' }, { field: 'Full', title: 'Full' }, { field: 'Mapid', title: 'Mapid' }, { field: 'TRes_Class', title: 'TRes_Class' },  { field: 'Risk', title: 'Risk' }, { field: 'Note01', title: 'Note01' }, { field: 'Note02', title: 'Note02' }],
        type: $.BasePinCtrl.type.polyline
    }, datahelper.kmlSource.土石流潛勢溪流);
}
var init土石流潛勢溪流影響範圍 = function ($_container) {
    initKmlCtrl($_container, {
        name: '土石流潛勢溪流影響範圍', minZoom: 1, stTitle: function (d) {
            $.extend(d, d.geojson.properties);
            return d.geojson.properties.Debrisno;
        }, type: $.BasePinCtrl.type.polygon,
        infoFields: [{ field: 'Debrisno', title: 'Debrisno' }, { field: 'Address', title: 'Address' }, { field: 'Res_Class', title: 'Res_Class' }, { field: 'Risk', title: 'Risk' }]
    }, datahelper.kmlSource.土石流潛勢溪流影響範圍);
}
var init特定水土保持區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '特定水土保持區', minZoom: 1,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.特定水土保持區);
}
var init107年司馬庫斯崩塌地 = function ($_container) {
    initKmlCtrl($_container, {
        name: '大規模崩塌潛勢區(183處)', minZoom: 1,
        clickable:false,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource._107年司馬庫斯崩塌地);
}
var init鎮西堡_斯馬庫斯歷史崩塌地 = function ($_container) {
    initKmlCtrl($_container, {
        name: '鎮西堡_斯馬庫斯歷史崩塌地',minZoom:1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '鎮西堡_斯馬庫斯歷史崩塌地', strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 1, fillColor: '#FF0000', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polyline
    }, datahelper.kmlSource.鎮西堡_斯馬庫斯歷史崩塌地);
}
var init特定水土保持區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '特定水土保持區', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '特定水土保持區', strokeColor: '#6e6e6e', strokeOpacity: 1, strokeWeight: 1, fillColor: '#ff00c5', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource._110年度42區特定水土保持區);
}
var init山坡地範圍 = function ($_container) {
    initKmlCtrl($_container, {
        name: '山坡地範圍', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '山坡地範圍', strokeColor: '#385E0F', strokeOpacity: 1, strokeWeight: 1, fillColor: '#385E0F', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.坡地範圍);
}
var init大規模崩塌潛勢區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '大規模崩塌潛勢區(43處優先辦理區)', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '大規模崩塌潛勢區(43處優先辦理區)', strokeColor: '#DB7093', strokeOpacity: 1, strokeWeight: 1, fillColor: '#DB7093', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.大規模崩塌潛勢區);
}
var init大規模崩塌影響範圍 = function ($_container) {
    initKmlCtrl($_container, {
        name: '大規模崩塌潛勢區影響範圍(43處優先辦理區)', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return {
                name: '大規模崩塌潛勢區影響範圍(43處優先辦理區)', strokeColor: '#8B0000', strokeOpacity: 1, strokeWeight: 1, fillColor: '#8B0000', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.大規模崩塌影響範圍);
}
var init地質遺跡地質敏感區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '地質遺跡地質敏感區', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '地質遺跡地質敏感區', strokeColor: '#C71585', strokeOpacity: 1, strokeWeight: 1, fillColor: '#C71585', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.地質遺跡地質敏感區);
}

var init地下水補注地質敏感區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '地下水補注地質敏感區', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '地下水補注地質敏感區', strokeColor: '#FF4500', strokeOpacity: 1, strokeWeight: 1, fillColor: '#FF4500', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.地下水補注地質敏感區);
}

var init活動斷層地質敏感區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '活動斷層地質敏感區', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '活動斷層地質敏感區', strokeColor: '#DB7093', strokeOpacity: 1, strokeWeight: 1, fillColor: '#DB7093', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.活動斷層地質敏感區);
}
var init歷年重大土石災例分布圖 = function ($_container) {
    initKmlCtrl($_container, {
        name: '歷年重大土石災例分布圖', minZoom: 1,
        //clickable: false,
        legendIcons: [{ 'name': '歷年重大土石災例分布圖', 'url': 'Images/legend/歷年重大土石災例分布圖.png', 'classes': 'blue_status' }],
        checkDataStatus: function () {
            return this.settings.legendIcons[0];
        },
        type: $.BasePinCtrl.type.point
    }, datahelper.kmlSource.歷年重大土石災例分布圖);
}

var init特色道路改善計畫 = function ($_container, y) {
    initKmlCtrl($_container, {
        name: y+'年', minZoom: 1, autoGenLegendIcons: false,
        stTitle: function (d) {
            $.extend(d, d.geojson.properties);
            return d.name;
        },
        geometryOtherOptions: {
            pointToLayer: function (geoJsonPoint, latlng) {
                try {
                    if (!geoJsonPoint.properties.Style || !geoJsonPoint.properties.Style.IconStyle || !geoJsonPoint.properties.Style.IconStyle.Icon || !geoJsonPoint.properties.Style.IconStyle.Icon.href) {
                        return L.marker(latlng);
                    }
                    return L.marker(latlng, {
                        icon: L.icon({ iconUrl: geoJsonPoint.properties.Style.IconStyle.Icon.href })
                    });
                } catch (e) {
                    return L.marker(latlng);
                }
                //return L.geoJSON(geoJsonPoint);
            },
            style: function (geoJsonFeature) {
                if (!geoJsonFeature.properties.Style || !geoJsonFeature.properties.Style.LineStyle || !geoJsonFeature.properties.Style.LineStyle.color || !geoJsonFeature.properties.Style.LineStyle.width)
                    return { strokeColor: '#0000ff', strokeWeight: 10 }
                if (geoJsonFeature.properties.name == '興昌道路改善工程(1)') {
                    var dds = "";
                }
                return { strokeColor: geoJsonFeature.properties.Style.LineStyle.color, strokeWeight: geoJsonFeature.properties.Style.LineStyle.width }
            }
        },
        //infoFields: [{ field: 'Debrisno', title: 'Debrisno' }, { field: 'Full', title: 'Full' }, { field: 'Mapid', title: 'Mapid' }, { field: 'TRes_Class', title: 'TRes_Class' }, { field: 'Risk', title: 'Risk' }, { field: 'Note01', title: 'Note01' }, { field: 'Note02', title: 'Note02' }],
        type: $.BasePinCtrl.type.feature
    }, datahelper.kmlSource['特色道路改善計畫'+y+'年度']);
}

var init第一級生態檢核區 = function ($_container) {
    initKmlCtrl($_container, {
        name: '第一級生態檢核區', minZoom: 1,
        clickable: false,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.第一級生態檢核區);
}
var init水鳥熱點 = function ($_container) {
    initKmlCtrl($_container, {
        name: '水鳥熱點', minZoom: 1,
        clickable: false,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.水鳥熱點);
}
var init受脅植物重要棲地 = function ($_container) {
    initKmlCtrl($_container, {
        name: '受脅植物重要棲地', minZoom: 1,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.受脅植物重要棲地);
}

var init仁愛村卡努颱風受災戶 =  function ($_container) {
    initKmlCtrl($_container, {
        name: '仁愛村卡努颱風受災戶', minZoom: 1,
        legendIcons: [{ 'name': '受災戶', 'url': 'images/pin/flood_p.png', 'classes': 'red_status' }],
        type: $.BasePinCtrl.type.point
    }, datahelper.kmlSource.仁愛村卡努颱風受災戶);
}

var init全臺順向坡分布圖 = function ($_container) {
    //$_container.PinCtrl({
    //    map: app.map, name: '全臺順向坡分布圖', useSearch: false, useLabel: false, useList: false, minZoom: 99
    //});
    init地質雲資料($_container, '全臺順向坡分布圖', 'DipSlope', '#00008B', '#00008B', 1);
}

var init全台土石流流動區分布圖 = function ($_container) {
   init地質雲資料($_container, '全臺土石流流動區分布圖', 'DebrisFlowTrack', '#035BB2', '#035BB2', 2);
}
var init土壤液化潛勢範圍_old = function ($_container) {
    init地質雲資料1($_container, '土壤液化潛勢範圍', 'liquefaction', '#BA8448', '#BA8448', 1, function (feature, layer) {
        onEachFeature(feature, layer);
        var _opacity = .3;
        if (feature.properties.classify == 2) {
            _opacity = .9;
        }
        else if (feature.properties.classify == 1) {
            _opacity = .6;
        }
        layer.setStyle({ opacity: _opacity, fillOpacity: _opacity });
    });
}
var init土壤液化潛勢範圍 = function ($_container) {
    init地質雲資料($_container, '土壤液化潛勢範圍', 'liquefaction', '#BA8448', '#BA8448', 1, {
        checkDataStatus:function(d, i) {
            var r = JSON.parse(JSON.stringify(this.settings.polyStyles[0]));
            r.fillOpacity = .3;
            if (d.classify == 2)
                r.fillOpacity = .9;
            else if (d.classify == 1)
                r.fillOpacity = .6;
            return r;
        }
    });
}

var init工程與地質鑽探點位分布 = function ($_container) {
    initGeoJson($_container, '工程地質鑽探點位', 'https://www.geologycloud.tw/api/v1/zh-tw/Drill?t=.json', '#035BB2', '#035BB2', 2,
        { legendIcons: [{ 'name': '工程地質鑽探點位', 'url': 'Images/legend/工程地質鑽探點位分布.png', 'classes': 'blue_status' }]});
}
var init5萬分之1_地層 = function ($_container) {
    init地質雲資料($_container, '5萬分之1-地層', 'Stratum', '#00008B', '#a7a7cc', 1);
}
var init5萬分之1_皺褶 = function ($_container) {
    init地質雲資料($_container, '5萬分之1-皺褶', 'Fold', '#00008B', '#00008B', 1);
}
var init5萬分之1_位態 = function ($_container) {
    $_container.on($.BasePinCtrl.eventKeys.initLayer, function () {
        $_container.instance.__pinctrl.instance._mapctrl._defaultIconCreateFunction = $.WaterCtrl.leaflet.markerCluster_defaultIconCreateFunction;
    });
    init地質雲資料($_container, '5萬分之1-位態', 'Attitude', '#00008B', '#00008B', 1,
        { legendIcons: [{ 'name': '5萬分之1-位態', 'url': 'Images/legend/5萬分之1-位態.png', 'classes': 'blue_status' }] });
}
var init5萬分之1_斷層 = function ($_container) {
    init地質雲資料($_container, '5萬分之1-斷層', 'Fault', '#00008B', '#00008B', 1);
}
var init5萬分之1_煤層 = function ($_container) {
    init地質雲資料($_container, '5萬分之1-煤層', 'CoalSeam', '#00008B', '#00008B', 1);
}
var init5萬分之1_圖幅框 = function ($_container) {
    init地質雲資料($_container, '5萬分之1-圖幅框', 'MapZone', '#00008B', '#6495ED', 1);
}
var init5萬分之1臺灣區域地質圖 = function ($_container) {
    initWMTS($_container, '5萬分之1臺灣區域地質圖', 'https://gis3.moeacgs.gov.tw/api/Tile/v1/getTile.cfm?layer=CGS_CGS_MAP&x={x}&y={y}&z={z}');
    bindPinswitchChange($_container, [
        createEmptyPinctrl($_container.parent(), '安山岩及安山岩質碎屑岩(7062)'),
        createEmptyPinctrl($_container.parent(), '玄武岩(7030)'),
        createEmptyPinctrl($_container.parent(), '基性火成岩(7001)'),
        createEmptyPinctrl($_container.parent(), '臺地堆積及石灰岩礁(6060)'),
        createEmptyPinctrl($_container.parent(), '沖積層(6020)'),
        createEmptyPinctrl($_container.parent(), '大南澳片岩(5026)'),
        createEmptyPinctrl($_container.parent(), '大南澳片岩(5025)'),
        createEmptyPinctrl($_container.parent(), '大南澳片岩(5021)'),
        createEmptyPinctrl($_container.parent(), '都巒山層(1530)'),
        createEmptyPinctrl($_container.parent(), '畢祿山層(1510)'),
        createEmptyPinctrl($_container.parent(), '大港口層(1120)'),
        createEmptyPinctrl($_container.parent(), '達見砂岩及十八重溪層(0180)'),
        createEmptyPinctrl($_container.parent(), '廬山層，蘇樂層(0170)'),
        createEmptyPinctrl($_container.parent(), '頭嵙山層，卑南山礫岩及其相當地層(0150)'),
        createEmptyPinctrl($_container.parent(), '瑞芳群及其相當地層(0130)'),
        createEmptyPinctrl($_container.parent(), '野柳群及其相當地層(0120)'),
        createEmptyPinctrl($_container.parent(), '卓蘭層，錦水頁岩及其相當地層(0100)'),
        createEmptyPinctrl($_container.parent(), '利吉層，墾丁層(0090)'),
        createEmptyPinctrl($_container.parent(), '西村層，佳陽層(0070)'),
        createEmptyPinctrl($_container.parent(), '四稜砂岩，眉溪砂岩，白冷層(0060)'),
        createEmptyPinctrl($_container.parent(), '五指山層，蚊子坑層，粗坑層(0050)'),
        createEmptyPinctrl($_container.parent(), '大桶山層，乾溝層，水長流層(0030)'),
        createEmptyPinctrl($_container.parent(), '三峽群及其相當地層(0010)')
    ]);
}
function onEachFeature(feature, layer) {
    var pro = feature.properties;
    var HTML = '';
    for (var q in pro) {
        HTML += q + ":" + pro[q] + '<br />';
    }
    layer.bindPopup(HTML);
}

var init地質雲資料 = function ($_container, _name, _type, _color, _fillColor, _width, _pinoptions) {
    initGeoJson($_container, _name, "https://www.geologycloud.tw/api/v1/zh-tw/" + _type + "?t=.json&all=true",
        _color, _fillColor, _width, _pinoptions)
    //if (_onEachFeature == null)
    //    _onEachFeature = onEachFeature;
    //$_container.PinCtrl({
    //    map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1
    //}).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
    //    var $_this = $(this);
    //    var _layer = undefined;
    //    var url = "https://www.geologycloud.tw/api/v1/zh-tw/" + _type + "?t=.json&all=true"
    //    $(this).find('.pinswitch').off('change').on('change', function () {

    //        var _isc = $(this).is(":checked");
           
    //        if (!_layer) {
    //            var $_ms = undefined;
    //            var $_p = $(this).closest('.pinctrl');
    //            helper.misc.showBusyIndicator($_this, { content: "資料載入處理中", timeout: 600000000 });
    //            $.ajax({
    //                url: url,
    //                xhrFields: {
    //                    onprogress: function (event) {
    //                        //Download progress
    //                        if (event.lengthComputable) {
    //                            if ($_ms == undefined)
    //                                $_ms = $_p.find('.msg-contont');
    //                            var _pr = ((event.loaded / event.total) * 100);
    //                            if (_pr >= 99)
    //                                $_ms.text('資料處理中');
    //                            else
    //                                $_ms.text('載入中 ' + _pr.toFixed(0) + '% ');
    //                        }
    //                    }
    //                },
    //                success: function (r) {
    //                    // successful completion handler
    //                    console.log(_name + '數量:' + r.features.length);
    //                    _layer = L.geoJSON(r, {
    //                        onEachFeature: _onEachFeature,
    //                        style: {
    //                            weight: _width,
    //                            opacity: .9,
    //                            color: _color,
    //                            fillColor: _fillColor,
    //                            fillOpacity: 0.5
    //                        }
    //                    }).addTo(app.map);

    //                    helper.misc.hideBusyIndicator($_this, true);
    //                }
    //            });
    //        }
    //        else
    //            _isc ? _layer.addTo(app.map).bringToFront() : _layer.remove();
    //    });
    //});
}

var init地質雲資料1 = function ($_container, _name, _type, _color, _fillColor, _width, _onEachFeature) {
    if (_onEachFeature == null)
        _onEachFeature = onEachFeature;
    $_container.PinCtrl({
        map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        var $_this = $(this);
        var _layer = undefined;
        var url = "https://www.geologycloud.tw/api/v1/zh-tw/" + _type + "?t=.json&all=true"
        $(this).find('.pinswitch').off('change').on('change', function () {

            var _isc = $(this).is(":checked");

            if (!_layer) {
                helper.misc.showBusyIndicator($_this, { content: "資料處理中", timeout: 600000 });
                $.get(url, function (r) {
                    console.log(_name + '數量:' + r.features.length);
                    _layer = L.glify.shapes({
                        map: app.map,
                        data: r,
                        color: _color,
                        border:true,
                        click:function(e, feature, xy) {
                            var pro = feature.properties;
                            var HTML = '';
                            for (var q in pro) {
                                HTML += q + ":" + pro[q] + '<br />';
                            }
                            if (Array.isArray(feature)) {
                                L.popup()
                                    // its a [lng,lat] 
                                    .setLatLng(feature.reverse())
                                    .setContent(HTML)
                                    .openOn(app.map);
                            } else {
                                L.popup()
                                    .setLatLng(e.latlng)
                                    .setContent(HTML)
                                    .openOn(app.map);
                            }
                        }
                    });

                    helper.misc.hideBusyIndicator($_this, true);
                });
            }
            else
                _isc ? _layer.addTo(app.map) : _layer.remove();
        });
    });
}

var init原住民保留地 = function ($_container) {
    initKmlCtrl($_container, {
        name: '原住民保留地',
        clickable: false,
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.原住民保留地);
}



var init原住民族部落_點 = function ($_container, _options) {
    initKmlCtrl($_container, $.extend( {
        name: '原住民族部落(點)',
        legendIcons: [{ 'name': '原住民族部落(點)', 'url': 'images/pin/原住民族部落_點.png', 'classes': 'rain_normal tribe-point' }],
        checkDataStatus: function (data, index) {
            return this.settings.legendIcons[0];
        },
        //descriptionParser: function (desc) {
        //    return $.parserStringToObject(desc, "<BR>", ":");
        //}
    }, _options), datahelper.getTribePointGeojsonData).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        //$('<a href="' + datahelper.kmlSource.tribe_point +'" style="margin-left:10%;">下載</a>').appendTo( $(this).find('.ctrl > label'));
    });
}
var init原住民族部落_面 = function ($_container, _options) {
    var infoContentData = []; //呈現showInfoWindow時，同一點對應到的面
    initKmlCtrl($_container, $.extend({
        name: '原住民族部落(面)', type: $.BasePinCtrl.type.polygon,
        pinInfoContent: function (data, infofields) { //依同一點對應到的面，以carousel呈現
            var cs = $.map(infoContentData, function (d) { return d.kmlDescription });
            $_c = helper.bootstrap.genBootstrapCarousel(undefined, undefined, 'carousel-info-window-content', cs)
            $_c.find('.carousel-item').attr('data-bs-interval', '99999999');
            setTimeout(function () {
                $('#' + $_c.attr('id')).on('slide.bs.carousel', function (ev) {
                    var idx = ev.to == undefined ? 0 : ev.to;
                    var d = infoContentData[idx];
                    $(this).parent().find('.leaflet-infowindow-title').html(d.placemarkName+'<label>' + ((idx+1) + '/' + infoContentData.length) + '</label>');
                }).trigger('slide.bs.carousel').parent().addClass('layer-count-' + infoContentData.length);
            });
            return $_c[0].outerHTML;
        }
    }, _options), datahelper.getTribePolygonGeojsonData).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        //$('<a href="' + datahelper.kmlSource.tribe_polygon + '" style="margin-left:10%;">下載</a>').appendTo($(this).find('.ctrl > label'));
        var _showInfoWindow = $_container.instance.__pinctrl.instance._mapctrl.showInfoWindow;
        $_container.instance.__pinctrl.instance._mapctrl.showInfoWindow = function (g, c, sds) { //點選清單後會觸發
            infoContentData = [];
            var p = [g.currentLatLng.lng, g.currentLatLng.lat]
            $.each($_container.instance.__pinctrl.instance.___datas, function () { //尋找同一點對應到的面
                var _d = this;
                var _add = helper.gis.pointInPolygonGeometry(p, this.geojson.geometry);
                if (_add)
                    g.attributes.FID == _d.FID ? infoContentData.unshift(_d) : infoContentData.push(_d); //被點擊的面放最上
            });
            
            console.log(infoContentData.length);

            _showInfoWindow.call(this,g);
        }
    });
    
}


var initRainCtrl = function ($_container) {
    $_container.RainCtrl({
        map: app.map, useSearch: false ,useLabel: false, useList: false, enabledStatusFilter: false, cluster: true, legendContainer: '#legendDiv',
        legendIcons: [{ 'name': '雨量', 'url': $.AppConfigOptions.script.gispath + '/images/meter/雨量站-正常.png', 'classes': 'rain_normal' }],
        checkDataStatus: function (data, index) {
            return this.settings.legendIcons[0];
        }
    });
}
var init農路 = function ($_container) {
    initEsriDynamicLayer($_container, { name: "農路", minZoom: 11 },
        {
            url: 'http://210.59.253.2:6080/arcgis/rest/services/TaiChung/farmroad/MapServer',
            layers: [0], proxy: 'Other/proxy.ashx'
        });
}
var init河川水系 = function ($_container) {

    //initWMSCtrl($_container, {
    //    name: '河川水系',
    //    wmsurl: 'https://maps.wra.gov.tw/arcgis/services/WMS/GIC_WMS/MapServer/WMSServer',
    //    wmsopts: { layers: 'RIVERPOLY' }
    //});
    initEsriDynamicLayer($_container, { name: "河川水系" },
        {
            url: 'http://210.59.253.2:6080/arcgis/rest/services/TaiChung/riverpoly/MapServer',
            layers: [0], proxy: 'Other/proxy.ashx'
        });
}
var init河川支流 = function ($_container) {
    initEsriDynamicLayer($_container, { name: "河川支流" },
        {
            url: 'http://210.59.253.2:6080/arcgis/rest/services/TaiChung/riverline/MapServer',
            layers: [0], proxy: 'Other/proxy.ashx'
        });
    //initWMSCtrl($_container, {
    //    name: '河川支流',
    //    wmsurl: 'https://maps.wra.gov.tw/arcgis/services/WMS/GIC_WMS/MapServer/WMSServer',
    //    wmsopts: { layers: 'RIVERLIN' }
    //});
}
var initEsriDynamicLayer = function ($_container, options, dynamicoptios) {
    var opts = $.extend({ map: app.map, name: "--", useLabel: false, useList: false }, options);
    //var opts = { map: app.map, name: "河川水系", useLabel: false, useList: false };
    var _esrilayer = undefined;
    $_container.PinCtrl(opts).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        $(this).find('.pinswitch').off('change').change(function () {
            if ($("#map .leaflet.wms-layer-panel").length == 0)
                app.map.createPane('wms-layer-panel').style.zIndex = 202;
            if (!_esrilayer) {
                _esrilayer = L.esri.dynamicMapLayer($.extend(
                    {
                        url: '', layers: [0], pane: 'wms-layer-panel'
                    }, dynamicoptios)
                ).on('loading', function () {
                    helper.misc.showBusyIndicator($_container);
                }).on('load', function () {
                    helper.misc.hideBusyIndicator($_container);
                })
            }
            if ($(this).is(':checked')) {
                _esrilayer.addTo(app.map);
                _esrilayer.bringToFront();
                $_s.show();
            }
            else {
                _esrilayer.remove();
                $_s.hide();
            }
        });//
        var $_s = $('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_container.find('.ctrl')).find('.opacity-slider').hide()
            .gis_layer_opacity_slider({
                map: app.map,
                range: "min",
                max: 100,
                min: 5,
                value: 90,
                setOpacity: function (_op) {
                    if (_esrilayer)
                        _esrilayer.setOpacity(_op)
                }
            });
    });
}

var init國有林班地 = function ($_container) {
    initWMSCtrl($_container, {
        name: '國有林班地',
        wmsurl: 'https://gis.forest.gov.tw/arcgis/services/WMS/FHWMS/MapServer/WmsServer',
        wmsopts: { layers: '21' }
    })
}
var init保安林地 = function ($_container) {
    initWMSCtrl($_container, {
        name: '保安林地',
        wmsurl: 'https://gis.forest.gov.tw/arcgis/services/WMS/FHWMS/MapServer/WmsServer',
        wmsopts: { layers: '15' }
    })
}
var init保安林地_old = function ($_container) {
    initKmlCtrl($_container, {
        name: '保安林地', minZoom: 1,
        clickable: false,
        checkDataStatus: function () {
            return { name: '保安林地', strokeColor: '#DB7093', strokeOpacity: 1, strokeWeight: 1, fillColor: '#c0f7bc', fillOpacity: .7, classes: 'water_normal' };
        },
        type: $.BasePinCtrl.type.polygon
    }, datahelper.kmlSource.全台保安林分布概略圖);
}
var init崖錐堆積區 = function ($_container) {
    initWMTS($_container, '崖錐堆積區', 'Other/proxy.ashx?https://landslide.geologycloud.tw/jlwmts/jetlink/EVGM_G01/GoogleMapsCompatible/{z}/{x}/{y}');
}
var init河岸與向源侵蝕 = function ($_container) {
    
    initWMTS($_container, '河岸與向源侵蝕', 'Other/proxy.ashx?https://landslide.geologycloud.tw/jlwmts/jetlink/EVGM_H09/GoogleMapsCompatible/{z}/{x}/{y}');
    bindPinswitchChange($_container, [
        createEmptyPinctrl($_container.parent(), '河岸侵蝕'),
        createEmptyPinctrl($_container.parent(), '向源侵蝕'),
    ]);
}



var init淹水潛勢 = function ($_container, h, v) {
    initWMSCtrl($_container, {
        name: h+'hr'+v+'mm',
        wmsurl: 'https://maps.wra.gov.tw/arcgis/services/WMS/GIC_WMS/MapServer/WMSServer',
        wmsopts: { layers: 'flood_'+v+'mm_'+h+'hr' }
    })
}

var init坡向圖 = function ($_container) {
    initWMTS($_container, '坡向圖', 'https://wmts.nlsc.gov.tw/wmts/MOI_ASPECT/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init等高線圖2003_2005 = function ($_container) {
    initWMTS($_container, '等高線圖(2003-2005)', 'https://wmts.nlsc.gov.tw/wmts/MOI_CONTOUR/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init陰影圖 = function ($_container) {
    initWMTS($_container, '陰影圖', 'https://wmts.nlsc.gov.tw/wmts/MOI_HILLSHADE/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init渲染圖 = function ($_container) {
    initWMTS($_container, '渲染圖', 'https://wmts.nlsc.gov.tw/wmts/MOI_SHADERMAP/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init坡度圖GT30_2003_2005 = function ($_container) {
    initWMTS($_container, '坡度圖-30%坡(2003-2005)', 'https://wmts.nlsc.gov.tw/wmts/MOI_SLOPEP_GT30/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init坡度圖GT30_2010_2015 = function ($_container) {
    initWMTS($_container, '坡度圖-30%坡(2010-2015)', 'https://wmts.nlsc.gov.tw/wmts/MOI_SLOPEP_GT30_2/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init坡度圖LV7_2003_2005 = function ($_container) {
    initWMTS($_container, '坡度圖-7級(2003-2005)', 'https://wmts.nlsc.gov.tw/wmts/MOI_SLOPEP_LV7/default/GoogleMapsCompatible/{z}/{y}/{x}');
}
var init坡度圖LV7_2010_2015 = function ($_container) {
    initWMTS($_container, '坡度圖-7級(2010-2015)', 'https://wmts.nlsc.gov.tw/wmts/MOI_SLOPEP_LV7_2/default/GoogleMapsCompatible/{z}/{y}/{x}');
}

var initWMSCtrl = function ($_container, options) {
    var opts = $.extend({ map: app.map, name: "--", useLabel: false, useList: false }, options);
    var wmsurl = options.wmsurl;
    var wmsopts = $.extend({
        version: "1.1.1", service: "WMS", requert: "GetMap", format: "image/png", transparent: "TRUE", styles: "",
        layers: "RIVERPOLY", srs: "EPSG:4326", pane: 'wms-layer-panel'
    }, options.wmsopts);
    var wmslayer = undefined;
    $_container.PinCtrl(opts).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        $(this).find('.pinswitch').off('change').change(function () {
           
            if (wmslayer == undefined) {
                if ($("#map .leaflet.wms-layer-panel").length==0)
                    app.map.createPane('wms-layer-panel').style.zIndex = 202;
                wmslayer = L.tileLayer.wms(wmsurl, wmsopts);
            }
            if ($(this).is(':checked')) {
                wmslayer.addTo(app.map);
                wmslayer.bringToFront();
                $_s.show();
            }
            else {
                wmslayer.remove();
                $_s.hide();
            }
        });
        var $_s = $('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_container.find('.ctrl')).find('.opacity-slider').hide()
            .gis_layer_opacity_slider({
                map: app.map,
                range: "min",
                max: 100,
                min: 5,
                value: 90,
                setOpacity: function (_op) {
                    if (wmslayer)
                        wmslayer.setOpacity(_op)
                }
            });
    });
}

var initWMTS = function ($_container, _name, _urlformatter, _minZoom) {
    var _tilelayer = L.tileLayer(_urlformatter);
    var $_s = undefined;
    $_container.PinCtrl({
        map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: _minZoom == undefined ? 1 : _minZoom
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        var $_this = $(this);
        $_this.find('.pinswitch').off('change').on('change', function () {
            if ($(this).is(':checked')) {
                $_s.show();
                _tilelayer.addTo(app.map);
            }
            else {
                $_s.hide();
                _tilelayer.remove();
            }
        });
        $_s = $('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_container.find('.ctrl')).find('.opacity-slider').hide()
            .gis_layer_opacity_slider({
                map: app.map,
                range: "min",
                max: 100,
                min: 5,
                value: 90,
                setOpacity: function (_op) {
                    _tilelayer.setOpacity(_op)
                }
            });
    });
}
var init國土WMTS = function ($_container, _name, _type, _minZoom) {
    initWMTS($_container, _name, 'https://wmts.nlsc.gov.tw/wmts/' + _type + '/default/GoogleMapsCompatible/{z}/{y}/{x}', _minZoom);
    //var _tilelayer = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/' + _type + '/default/GoogleMapsCompatible/{z}/{y}/{x}');
    //var $_s = undefined;
    //$_container.PinCtrl({
    //    map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: _minZoom == undefined ? 1 : _minZoom
    //}).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
    //    var $_this = $(this);
    //    $_this.find('.pinswitch').off('change').on('change', function () {
    //        if ($(this).is(':checked')) {
    //            $_s.show();
    //            _tilelayer.addTo(app.map);
    //        }
    //        else {
    //            $_s.hide();
    //            _tilelayer.remove();
    //        }
    //    });
    //    $_s =$('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_container.find('.ctrl')).find('.opacity-slider').hide()
    //        .gis_layer_opacity_slider({
    //            map: app.map,
    //            range: "min",
    //            max: 100,
    //            min: 5,
    //            value: 90,
    //            setOpacity: function (_op) {
    //                _tilelayer.setOpacity(_op)
    //            }
    //        });
    //});
}

var initTestKml = function ($_container) {
    initKmlCtrl($_container, {
        name: '103年度 1110429', minZoom: 1, autoGenLegendIcons:false,
        stTitle: function (d) {
            $.extend(d, d.geojson.properties);
            return d.name;
        },
        geometryOtherOptions: {
            pointToLayer: function (geoJsonPoint, latlng) {
                try {
                    if (!geoJsonPoint.properties.Style || !geoJsonPoint.properties.Style.IconStyle || !geoJsonPoint.properties.Style.IconStyle.Icon || !geoJsonPoint.properties.Style.IconStyle.Icon.href) {
                        return L.marker(latlng);
                    }
                    return L.marker(latlng, {
                        icon: L.icon({ iconUrl: geoJsonPoint.properties.Style.IconStyle.Icon.href })
                    });
                } catch (e) {
                    return L.marker(latlng);
                }
                //return L.geoJSON(geoJsonPoint);
            },
            style: function (geoJsonFeature) {
                if (!geoJsonFeature.properties.Style || !geoJsonFeature.properties.Style.LineStyle || !geoJsonFeature.properties.Style.LineStyle.color || !geoJsonFeature.properties.Style.LineStyle.width)
                    return { strokeColor: '#0000ff', strokeWeight: 10 }
                if (geoJsonFeature.properties.name == '興昌道路改善工程(1)') {
                    var dds = "";
                }
                return { strokeColor: geoJsonFeature.properties.Style.LineStyle.color, strokeWeight: geoJsonFeature.properties.Style.LineStyle.width}
            }
        },
        //infoFields: [{ field: 'Debrisno', title: 'Debrisno' }, { field: 'Full', title: 'Full' }, { field: 'Mapid', title: 'Mapid' }, { field: 'TRes_Class', title: 'TRes_Class' }, { field: 'Risk', title: 'Risk' }, { field: 'Note01', title: 'Note01' }, { field: 'Note02', title: 'Note02' }],
        type: $.BasePinCtrl.type.feature
    });
}
var initKmlCtrl = function ($_container, options, kml, classes) {
    kml = kml || 'Data/' + options.name + '.kml';
    var kmloptions = $.extend({
        map: app.map, useSearch: false, useLabel: false, useList: false,
        autoGenLegendIcons: true, styleSelector: true,legendContainer:'#legendDiv',
        name: name,
        url: kml,
        type: $.BasePinCtrl.type.point
    }, options);
    var _ctrl = $_container.KmlCtrl(kmloptions)
        .on($.BasePinCtrl.eventKeys.initUICompleted, function () {
            //_ctrl.find('.legend  img').insertBefore(_ctrl.find('.checkbox-name'));
            //_ctrl.find('.legend').addClass('offdisplay');
            //current.__pinctrl.instance.repaintLegendUI(current.settings.legendIcons);
            var sdd =_ctrl.instance;
        });
    return _ctrl;
}

var initGeoJson11 = function ($_container, _name, _url, _color, _fillColor, _width, _onEachFeature) {
    if (_onEachFeature == null)
        _onEachFeature = onEachFeature;
    $_container.PinCtrl({
        map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        var $_this = $(this);
        var _layer = undefined;
        var url = _url;
        var $_stylectrl;
        var _s = { fillColor: _fillColor, weight: _width, color: _color, opacity: .9 };
        $(this).find('.pinswitch').off('change').on('change', function () {
            var _tf;
            var changeKmlStatus = function (f, v) {
                clearTimeout(_tf)
                _tf = setTimeout(function () {
                    if (_s[f] == v)
                        return;
                    _s[f] = v;
                    _layer.eachLayer(function (fl) {
                        fl.setStyle(_s);
                        //fl.setStyle({
                        //    fillColor: '#454412',
                        //    fillOpacity: 0.8,
                        //    weight: 5
                        //});
                    });
                }, 100);
            }

            var _isc = $(this).is(":checked");

            if (!_layer) {
                var $_ms = undefined;
                var $_p = $(this).closest('.pinctrl');
                helper.misc.showBusyIndicator($_this, { content: "資料載入處理中", timeout: 600000000 });
                $.ajax({
                    url: url,
                    xhrFields: {
                        onprogress: function (event) {
                            //Download progress
                            if (event.lengthComputable) {
                                if ($_ms == undefined)
                                    $_ms = $_p.find('.msg-contont');
                                var _pr = ((event.loaded / event.total) * 100);
                                if (_pr >= 99)
                                    $_ms.text('資料處理中');
                                else
                                    $_ms.text('載入中 ' + _pr.toFixed(0) + '% ');
                            }
                        }
                    },
                    success: function (r) {
                        // successful completion handler
                        console.log(_name + '數量:' + r.features.length);
                        _layer = L.geoJSON(r, {
                            onEachFeature: _onEachFeature,
                            style: {
                                weight: _width,
                                opacity: .9,
                                color: _color,
                                fillColor: _fillColor,
                                fillOpacity: 0.5
                            }
                        }).addTo(app.map);
                        helper.misc.hideBusyIndicator($_this, true);

                        ///to do style start***************
                        var _geotype = r.features[0].geometry.type
                        if (_geotype == "Point")
                            return;
                        $_stylectrl = $('<div class="style-ctrl">').appendTo($_container);

                        if (true) {//this.settings.styleSelector) {
                            //顏色
                            var $_c = $('<div class="poly-style" ><div ><lable>邊線:</lable><input type="text" class="strokepicker cpicker"></input></div>' +
                                '<div class="fill-ctrl"><lable>填滿:</lable><input type="text" class="fillpicker cpicker"></input></div>' +
                                '<div ><lable>線寬:</lable><select></select></div></div>').appendTo($_stylectrl);
                            //線寬
                            var $_lwselect = $_c.find('select')
                            for (var i = 1; i < 11; i++)
                                $('<option value="' + i + '">' + i + '</option>').appendTo($_lwselect);
                            $_lwselect.val(_width);
                            $_lwselect.on('change', function () {
                                var v = $_lwselect.val();
                                changeKmlStatus('weight', v);
                            });

                            //線的顏色
                            $('.strokepicker', $_c).colpick({
                                layout: 'hex',
                                submit: 0,
                                onChange: function (hsb, hex, rgb, el, bySetColor) {
                                    $(el).css('border-color', '#' + hex);
                                    // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                                    if (!bySetColor) {
                                        var strokecolor = '#' + hex;
                                        $(el).val(strokecolor);
                                        changeKmlStatus('color', strokecolor);
                                    }
                                }
                            }).val(_color).keyup(function () {
                                var strokecolor = this.value;
                                $(this).colpickSetColor(strokecolor);
                                changeKmlStatus('color', strokecolor);
                            }).colpickSetColor(_color);
                            $('.fill-ctrl', $_stylectrl).hide();
                            if (_geotype != "LineString") {
                                $('.fill-ctrl', $_stylectrl).show();
                                //填滿的顏色
                                $('.fillpicker', this.$element).colpick({
                                    layout: 'hex',
                                    submit: 0,
                                    onChange: function (hsb, hex, rgb, el, bySetColor) {
                                        $(el).css('border-color', '#' + hex);
                                        // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                                        if (!bySetColor) {
                                            var fillcolor = '#' + hex;
                                            $(el).val(fillcolor);
                                            changeKmlStatus('fillColor', fillcolor);

                                        }
                                    }
                                }).val(_fillColor).keyup(function () {
                                    var fillcolor = this.value;
                                    $(this).colpickSetColor(fillcolor);
                                    changeKmlStatus('fillColor', fillcolor);
                                }).colpickSetColor(_fillColor);//.show();
                            }

                            $(".colpick").mouseleave(function (e) {
                                $('.cpicker', $_stylectrl).colpickHide();
                            });
                        }

                        //透明度
                        var $slider = $('<div class="col-xs-12"><div class="opacity-slider" title="透明度"></div></div>').appendTo($_stylectrl).find('.opacity-slider')
                            .gis_layer_opacity_slider({
                                map: app.map,
                                //.slider({
                                range: "min",
                                max: 100,
                                min: 0,
                                value: 90,
                                setOpacity: function (v) {
                                    changeKmlStatus('opacity', v);
                                }
                            });

                        ///to do style end*****************
                    }
                });
            }
            else {
                if (_isc) {
                    _layer.addTo(app.map).bringToFront();
                    $_stylectrl.show();
                }
                else {
                    _layer.remove();
                    $_stylectrl.hide();
                }
                //_isc ? _layer.addTo(app.map).bringToFront() : _layer.remove();
            }
        });
    });
}

var initGeoJson = function ($_container, _name, _url, _color, _fillColor, _width, _pinoptions) {
    //if (_onEachFeature == null)
    //    _onEachFeature = onEachFeature;
    $_container.PinCtrl({
        map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        var $_this = $(this);
        var url = _url;
        $(this).find('.pinswitch').off('change').on('change', function () {

            var _isc = $(this).is(":checked");

            
            var $_ms = undefined;
            var $_p = $(this).closest('.pinctrl');
            helper.misc.showBusyIndicator($_this, { content: "資料載入處理中", timeout: 600000000 });
            $.ajax({
                url: url,
                xhrFields: {
                    onprogress: function (event) {
                        //Download progress
                        if (event.lengthComputable) {
                            if ($_ms == undefined)
                                $_ms = $_p.find('.msg-contont');
                            var _pr = ((event.loaded / event.total) * 100);
                            if (_pr >= 99)
                                $_ms.text('資料處理中');
                            else
                                $_ms.text('載入中 ' + _pr.toFixed(0) + '% ');
                        }
                    }
                },
                success: function (r) {
                    // successful completion handler
                    //console.log(_name + '數量:' + r.features.length);
                    helper.misc.hideBusyIndicator($_this, true);
                    if (r.features.length == 0)
                        return;
                        
                    var _geotype = r.features[0].geometry.type;
                    //組資料
                    var _datas = [];
                    $.each(r.features, function (i, d) {
                        _datas.push(this.properties);
                        if (_geotype == "Point") {
                            _datas[i].X = this.geometry.coordinates[0];
                            _datas[i].Y = this.geometry.coordinates[1];
                        }
                        _datas[i].geojson = this;
                    });

                    $_container.off($.BasePinCtrl.eventKeys.initUICompleted).find('.pinswitch').off('change');
                    $_container.find('>*').addClass('remove-dom'); //移除暫用PinCtrl內容flag
                    var $_pin_tooltip_info = $_container.find('.ctrl .pin-tooltip-info');//圖層說明訊息
                    $_container.on($.BasePinCtrl.eventKeys.initUICompleted, function () {
                        //設成false，不能zoom change，會因true(checked)會觸發show(但怎會抓舊的pinswitch,false就不會)
                        $_container.find('> .remove-dom').find('.pinswitch').prop('checked', false);
                        $_container.find('> .remove-dom').remove();//移除暫用PinCtrl內容

                        $_container.find('.pinswitch').prop("checked", true).trigger('change');
                        $_pin_tooltip_info.appendTo($_container.find('.ctrl'));//將圖層說明訊息移至新的ctrl下
                    });
                    if (_geotype == "Point") {
                        $_container.PinCtrl($.extend({
                            map: app.map, name: _name, cluster: _datas.length > 1000, clusterDisableAtZoom: 15, useSearch: false, useLabel: false, useList: false, stTitle: function (data) { return Object.entries(data)[1] },
                            legendContainer: '#legendDiv',
                            loadBase: function (callback) { callback([]) },
                            loadInfo: function (dt, callback) { callback(_datas) }
                        }, _pinoptions));
                    }
                    else if (_geotype == "LineString") {
                        $_container.PolylineCtrl($.extend({
                            map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1, stTitle: function (data) { return Object.entries(data)[1] },
                            legendContainer: '#legendDiv', styleSelector: true, useSilder: true,
                            polyStyles: [{ name: _name, strokeColor: _color, strokeOpacity: .9, strokeWeight: _width, classes: 'water_normal' }],
                            loadBase: function (callback) { callback([]) },
                            loadInfo: function (dt, callback) { callback(_datas) }
                        }, _pinoptions));
                    }
                    else {
                        $_container.PolygonCtrl($.extend({
                            map: app.map, name: _name, useSearch: false, useLabel: false, useList: false, minZoom: 1,  stTitle: function (data) { return Object.entries(data)[1] },
                            legendContainer: '#legendDiv', styleSelector: true, useSilder: true,
                            polyStyles: [{ name: _name, strokeColor: _color, strokeOpacity: .9, strokeWeight: _width, fillColor: _fillColor, fillOpacity: .7, classes: 'water_normal' }],
                            loadBase: function (callback) { callback([]) },
                            loadInfo: function (dt, callback) { callback(_datas) }
                        }, _pinoptions));
                    }
                }
            });
            
        });
    });
}

/******產一圖層多圖例用*****/
var createEmptyPinctrl = function ($_container, _name) {
    return $('<div class="col-md-12">').appendTo($_container).PinCtrl({
        map: app.map, name: _name, useSearch: false, useLabel: false, useList: false
    }).on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        var $_this = $(this);
        $_this.find('.pinswitch').off('change').on('change', function () {
        });
    }).hide();
}
var bindPinswitchChange = function ($_container, $_relations) {
    $_container.on($.BasePinCtrl.eventKeys.initUICompleted, function () {
        setTimeout(function () {
            $_container.find('.pinswitch').on('change', function () {
                var c = $(this).is(':checked');
                for (var i = $_relations.length - 1; i >= 0; i--)
                    $_relations[i].find('.pinswitch').prop("checked", c).trigger('change');
            });
        });
    });
}
/******產一圖層多圖例用*****/