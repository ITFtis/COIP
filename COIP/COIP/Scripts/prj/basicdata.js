
/****************cloud plugin****************/
(function ($) {
    'use strict';
    var pluginName = 'basicdata';

    var pluginclass = function (element, e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.$element = $(element);
        this.settings = undefined;
    };

    pluginclass.prototype = {
        constructor: pluginclass,
        init: function (options) {

            var current = this;

            $.extend(this.settings, options);

            //this.$element.on($.menuctrl.eventKeys.popu_init_before, function () {
                if (current.isInitCompleted)
                    return;
                current.initUi();
                current.isInitCompleted = true;
            //});
        },
        initUi: function () {
            var bindTooltip = function ($_c, msg) {
                if (msg) {
                    $_c.on($.BasePinCtrl.eventKeys.initUICompleted, function () {
                        var $_t = $('<button class="pin-tooltip-info col-1 glyphicon glyphicon-info-sign" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="' + msg + '">').appendTo($_c.find('.ctrl'));//.tooltip({ html: true });
                        setTimeout(function () { //無timer直接tooltip可能有時間差問題，有時有些會無tooltip init成功
                            $_t.tooltip({ html: true });
                        }, 1000);
                    });
                }
                return $_c;
            }
            var that = this;
            this.$element.empty();
            //部落
            var $_tribe = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '部落圖資',false);///  <a data-toggle="collapse" href="#tribe-meter"><label><b class="caret"></b>部落圖資</label></a><div id="tribe-meter" class="meter"><div></div>').appendTo(this.$element).find('.meter');
            /*initTestKml($('<div class="col-md-12 feature-ctrl">').appendTo($_tribe));*/
            init原住民族部落_點(bindTooltip($('<div class="col-md-12">').appendTo($_tribe), '參考『台灣原住民族部落事典』初步繪製之部落位置'));
            init原住民族部落_面(bindTooltip($('<div class="col-md-12">').appendTo($_tribe), '參考『台灣原住民族部落事典』初步繪製之部落位置'));
            //initTestWMTS($('<div class="col-md-12">').appendTo($_tribe));
            //initTestWMS($('<div class="col-md-12">').appendTo($_tribe));
            //行政區界
            var $_district = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '行政與土地區界',false);
            init縣市界(bindTooltip($('<div class="col-md-12">').appendTo($_district),'自國土測繪中心介接之圖資'));
            init鄉鎮界(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自國土測繪中心介接之圖資'));
            init村里界(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自國土測繪中心介接之圖資'));
            //地籍
            //var $_cadastral = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '地籍圖');
            //init地籍圖($('<div class="col-md-12">').appendTo($_district));
            init段籍圖(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自國土測繪中心介接之圖資'));
            init公有土地地籍圖(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自國土測繪中心介接之圖資'));
            init特定水土保持區(bindTooltip($('<div class="col-md-12">').appendTo($_district), '111年度36區特定水土保持區'));
            init山坡地範圍(bindTooltip($('<div class="col-md-12">').appendTo($_district), '110年度山坡地範圍圖'));
            init原住民保留地($('<div class="col-md-12">').appendTo($_district));
            init河川水系(bindTooltip($('<div class="col-md-12">').appendTo($_district),'自經濟部水利署水利地理資訊服務平台介接'));
            init河川支流(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自經濟部水利署水利地理資訊服務平台介接'));
            init道路路網(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自國土測繪中心介接之臺灣通用電子地圖道路圖層'));
            init農路($('<div class="col-md-12">').appendTo($_district));

            init國有林班地(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自TGOS介接之林務局國有林班地資料'));
            init保安林地(bindTooltip($('<div class="col-md-12">').appendTo($_district), '自TGOS介接之林務局國有林班地資料'));

            //計畫與工程資訊
            var $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '計畫與工程資訊', false);
            init工程與地質鑽探點位分布(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init計畫與工程資訊(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落訪談成果綜整"), '地質鑽探成果資訊');
            init計畫與工程資訊(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落訪談成果綜整"), '原民會主辦工程資訊');
            init計畫與工程資訊(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落訪談成果綜整"), '各部會主辦工程資訊');

            //土石流潛勢溪流
            var $_landslide = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '土石流潛勢溪流', false);
            init土石流潛勢溪流(bindTooltip($('<div class="col-md-12">').appendTo($_landslide), "111年度1731條土石流潛勢溪流圖，<a href='https://246.swcb.gov.tw/Service/OpenData' target='_new'>https://246.swcb.gov.tw/Service/OpenData</a>"));
            init土石流潛勢溪流影響範圍(bindTooltip($('<div class="col-md-12">').appendTo($_landslide), "<a href='https://246.swcb.gov.tw/Service/OpenData' target='_new'>https://246.swcb.gov.tw/Service/OpenData</a>"));

            //大規模崩塌
            var $_landcollapse = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '大規模崩塌', false);
            init大規模崩塌潛勢區(bindTooltip($('<div class="col-md-12">').appendTo($_landcollapse),'行政院農委會111年度大規模崩塌潛勢區'));
            init大規模崩塌影響範圍(bindTooltip($('<div class="col-md-12">').appendTo($_landcollapse), '行政院農委會111年度大規模崩塌潛勢區'));
            init107年司馬庫斯崩塌地($('<div class="col-md-12">').appendTo($_landcollapse));
            init鎮西堡_斯馬庫斯歷史崩塌地($('<div class="col-md-12">').appendTo($_landcollapse));

            //地質災害潛勢
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '地質災害潛勢', false);
            init土壤液化潛勢_中級(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '自國土測繪中心介接之圖資，土壤液化潛勢圖資中級，目前僅有臺北市，臺中市，臺南市，高雄市的開放資料及新北市政府'));
            init土壤液化潛勢_初級(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'自國土測繪中心介接之圖資，依據地質雲 - 土壤液化潛勢公開的土壤液化潛勢範圍資料'));
            init地質敏感區(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'依據經濟部中央地質調查所公開的地質敏感區(Geologically sensitive area)資料(110年7月6日)，經本中心產製圖磚發布，此圖層有地質遺跡、活動斷層、地下水補注 3種地質敏感區，僅供參考。'));
            init地質敏感區_山崩與地滑(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'依據經濟部中央地質調查所公開的地質敏感區(Geologically sensitive area)資料(110年7月6日)，經本中心產製圖磚發布，此圖層僅有山崩與地滑地質敏感區，僅供參考。'));
            init全臺順向坡分布圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp),"自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init全台土石流流動區分布圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init土壤液化潛勢範圍(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init崖錐堆積區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所介接，<a href='https://landslide.geologycloud.tw' target='_new'>https://landslide.geologycloud.tw</a>"));
            init地質遺跡地質敏感區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自中央地質調查所提供之shp檔轉繪，<a href='https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f' target='_new'>https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f</a>"));
            init地下水補注地質敏感區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自中央地質調查所提供之shp檔轉繪，<a href='https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f' target='_new'>https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f</a>"));
            init活動斷層地質敏感區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自中央地質調查所提供之shp檔轉繪，<a href='https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f' target='_new'>https://www.moeacgs.gov.tw/laws/detail?id=cab5108291ca4cbf9614860b113c1f5f</a>"));
            init歷年重大土石災例分布圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "行政院農委會公布之資料。<a href='https://data.gov.tw/en/datasets/103129' target='_new'>https://data.gov.tw/en/datasets/103129</a>"));
            init河岸與向源侵蝕(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "行政院農委會公布之資料。<a href='https://landslide.geologycloud.tw' target='_new'>https://landslide.geologycloud.tw</a>"));

            //雨量資訊
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '雨量資訊', false);
            initRainCtrl(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'自經濟部水利署API介接之雨量站資料'));
            //防減災資源
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '防減災資源', false);
            init避難收容處所(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'依據政府資料開放平臺消防署提供之避難收容處所開設情形'));
            initAED位置(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據政府資料開放平臺衛生福利部醫事司-公共場所AED位置資訊(109年9月)開放資料產製'));

            //淹水潛勢
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '淹水潛勢', false);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp),'依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'),6,150);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'),6,250);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 6, 350);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 12, 200);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 12, 300);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 12, 400);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 24, 200);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 24, 350);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 24, 500);
            init淹水潛勢(bindTooltip($('<div class="col-md-12">').appendTo($_temp), '依據經濟部水利署防災淹水潛勢圖開放資料組合展示，區分成降雨24小時、12小時、6小時的降雨量對應的淹水狀況，透過顏色顯示淹水深度展現'), 24, 650);
            //區域地質圖
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '區域地質圖', false);
            init5萬分之1_地層(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1_皺褶(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1_位態(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1_斷層(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1_煤層(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1_圖幅框(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所地質雲加值應用平台介接，<a href='https://www.geologycloud.tw/' target='_new'>https://www.geologycloud.tw/</a>"));
            init5萬分之1臺灣區域地質圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "自經濟部中央地質調查所介接，<a href='https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTile_cfm' target='_new'>https://gis3.moeacgs.gov.tw/api/Tile/v1/oas/#/default/get_getTile_cfm</a>"));
            //20公尺DTM加值成果
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '20公尺DTM加值成果', false);
            init坡向圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料產製，由本中心代為發布"));
            init等高線圖2003_2005(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料(2003-2005)產製，由本中心代為發布"));
            init陰影圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料產製，由本中心代為發布"));
            init渲染圖(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料產製"));
            init坡度圖GT30_2003_2005(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料(2003-2005年份)產製，由本中心代為發布"));
            init坡度圖GT30_2010_2015(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣（本島除管制區外）20公尺網格間距的數值高程模型（DEM）資料(2010-2015年份)產製，由本中心代為發布"));
            init坡度圖LV7_2003_2005(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣20公尺網格間距的數值高程模型（DEM）資料(2003-2005年份)產製，由本中心代為發布"));
            init坡度圖LV7_2010_2015(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "內政部地政司委託國家高速網路與計算中心(國網中心)應用內政部公布之全臺灣（本島除管制區外）20公尺網格間距的數值高程模型（DEM）資料(2010-2015年份)產製，由本中心代為發布"));

            //特色道路改善計畫
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '特色道路改善計畫', false);
            for (var i = 103; i <= 111; i++) {
                init特色道路改善計畫($('<div class="col-md-12">').appendTo($_temp), i);
            }

            //生態資訊
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '生態資訊', false);
            init第一級生態檢核區($('<div class="col-md-12">').appendTo($_temp));
            init水鳥熱點($('<div class="col-md-12">').appendTo($_temp));
            init受脅植物重要棲地($('<div class="col-md-12">').appendTo($_temp));
            //生態資訊
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '卡努颱風', false);
            init仁愛村卡努颱風受災戶($('<div class="col-md-12">').appendTo($_temp));
            //部落永續建設藍圖規劃成果
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '部落永續建設藍圖規劃成果', false);
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度宜蘭');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度花蓮');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度南投');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度屏東');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度苗栗');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度桃園');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度新竹');
            init部落永續建設藍圖規劃成果(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』各縣(市)111年度計畫成果綜整"), '111年度臺東');

            //防災社區
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '防災社區', false);
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '宜蘭縣');
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '花蓮縣');
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '屏東縣');
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '苗栗縣');
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '桃園市');
            init防災社區(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落防災社區盤點及訪談成果綜整"), '臺東縣');
            //防災社區避難所資訊
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '防災社區避難所資訊', false);
            init防災社區避難所資訊(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落訪談成果綜整"), '防災社區避難所');
            //歷史災害事件綜整
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '歷史災害事件綜整', false);
            init歷史災害事件綜整(bindTooltip($('<div class="col-md-12">').appendTo($_temp), "『宜居部落建設計畫資訊平台』部落訪談成果綜整"), '歷史災害事件');
        }
        , _getToggleMeter: function ($_c, _name, _show) {
            _show = _show==undefined ? true:_show;
            var _id = 'id_' + helper.misc.geguid();
            $('<a data-bs-toggle="collapse" href="#' + _id + '" role="button" aria-expanded="' + _show + '" aria-controls="' + _id + '"' + (_show ? '' :' class="collapsed"')+'><label><span class="glyphicon glyphicon-play"></span>' + _name + '</abel></a >').appendTo($_c);
            return $('<div class="collapse meter'+(_show?' show':'')+'" id="' + _id + '">').appendTo($_c);
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