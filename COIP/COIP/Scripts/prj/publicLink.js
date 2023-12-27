 ////<div id="allPeoDisPre"></div>
 ////       <div id="disasterResult"></div>
 ////       <div id="relLaw"></div>

var publicLink = function () {
    allPeoDisPre();
    disasterResult();
    relLaw();
}
var allPeoDisPre = function () {
    var $_c = $('#allPeoDisPre');
    var $_temp = getToggleContainer($_c, '防災知識', true);
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201121023816777649EZWSX.pdf', '氣候變遷坡地災害');
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201121023744796592MZSS6.pdf', '氣候變遷淹水災害');
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201121023943361659A93MW.pdf', '氣候變遷災害風險圖');
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201121023539390729CJGS5.pdf', '影響臺灣災害的狠腳色-颱風');

    $_temp = getToggleContainer($_c, '避難場所', true);
    getPropLink($_temp, 'https://www.nfa.gov.tw/cht/index.php?code=list&ids=82', '各縣市避難場所');

    $_temp = getToggleContainer($_c, '成果報告', true);
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201207034747118688GRKSP.pdf', '氣候變遷災害風險圖問答集');
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/201207025346413250E9S9H.pdf', '氣候變遷下淹水及坡地災害風險圖圖集');
    getPropLink($_temp, 'https://dra.ncdr.nat.gov.tw/public/upload/Publication/20120702494658724969VPL.pdf', '氣候變遷衝擊下災害風險地圖');

    $_temp = getToggleContainer($_c, '韌性社區', true);
    getPropLink($_temp, 'https://ws.e-land.gov.tw/Download.ashx?u=LzAwMS8yMDE1eWlsYW4vMjQ0L3JlbGZpbGUvMTA5NDQvMTkxOTY0LzgwYzY5OTAxLWY2ZDUtNGMwOC1hY2IzLTk4YWI4NzFhODNiYy5wZGY%3d&n=6Z%2bM5oCn56S%2b5Y2A5pON5L2c5omL5YaKLnBkZg%3d%3d&icon=..pdf', '韌性社區操作手冊');
    getPropLink($_temp, 'https://246.swcb.gov.tw/AllFiles/Download/8/%E5%8E%9F%E4%BD%8F%E6%B0%91%E9%98%B2%E7%81%BD%E7%A4%BE%E5%8D%80%E8%A1%8C%E5%8B%95%E8%A8%88%E7%95%AB%EF%BC%9A%E9%81%8B%E7%94%A8%E5%82%B3%E7%B5%B1%E6%99%BA%E6%85%A7%E5%BB%BA%E6%A7%8B%E7%81%BD%E5%AE%B3%E9%9F%8C%E6%80%A7%E9%83%A8%E8%90%BD_%E6%91%98%E8%A6%81%E5%A0%B1%E5%91%8A.pdf', '原住民防災社區行動計畫：<br>運用傳統智慧建構災害韌性部落');
    getPropLink($_temp, 'https://tech.swcb.gov.tw/Content/Upload/Innovation/file/105%E5%89%B5%E7%A0%94/105%E4%BF%9D%E7%99%BC-13.1-%E4%BF%9D-01-06-001(21)/06-001(21)%E5%9B%A0%E6%87%89%E6%B0%A3%E5%80%99%E8%AE%8A%E9%81%B7%E9%9F%8C%E6%80%A7%E9%83%A8%E8%90%BD%E4%B9%8B%E5%BB%BA%E6%A7%8B-%E6%96%B0%E5%8C%97%E5%B8%82%E7%83%8F%E4%BE%86%E5%8D%80%E4%BF%A1%E8%B3%A2%E9%83%A8%E8%90%BD%E5%8F%83%E8%88%87%E5%BC%8F%E8%A1%8C%E5%8B%95%E8%A8%88%E7%95%AB%E6%88%90%E6%9E%9C%E5%A0%B1%E5%91%8A%E6%9B%B8.pdf', '因應氣候變遷韌性部落之建構：<br>新北市烏來區信賢部落參與式行動計畫');
}
var disasterResult = function () {
    var $_c = $('#disasterResult');
    var $_temp = getToggleContainer($_c, '重大災害事件', true);
    getPropLink($_temp, 'https://246.swcb.gov.tw/Achievement/MajorDisasters', '重大災害事件查詢');

    var $_temp = getToggleContainer($_c, '歷年部落安居計畫成果', true);
    
    //checkopen(getPropLink($_temp, 'http://210.59.250.119:8080/COIP/Data/PDF/1.部落調查成果/66.pdf', '104年部落安居計畫成果'));
    confirmopen( getPropLink($_temp, 'Data/PDF/104年度原住民族部落安居作業_期末報告書.pdf', '104年部落安居計畫成果'));
    confirmopen(getPropLink($_temp, 'Data/PDF/108聚落安居_期末定稿本.pdf', '106年部落安居計畫成果'));
    confirmopen(getPropLink($_temp, 'Data/PDF/1081003成果報告.pdf', '108年部落安居計畫成果'));
    confirmopen(getPropLink($_temp, 'Data/PDF/封面與本文.pdf', '109年部落安居計畫成果'));

    var $_temp = getToggleContainer($_c, '防災演練成果', true);
    getPropLink($_temp, 'https://246.swcb.gov.tw/Achievement/PreventTraining', '歷年演練場次');
    getPropLink($_temp, 'https://246.swcb.gov.tw/Achievement/Community', '歷年宣導場次');
    getPropLink($_temp, 'https://246.swcb.gov.tw/Achievement/Community', '歷年自主防災社區');
}
var relLaw = function () {
    var $_c = $('#relLaw');
    var $_t = getPropLink($('body'), 'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0120014', '相關法規介紹').hide();
    $_c.on('click', function () {
        $_t.find('a')[0].click();//.trigger('click');
    });
}
var getToggleContainer = function ($_c, _name, _show) {
    _show = _show || true;
    var _id = 'id_' + helper.misc.geguid();
    $('<a class="toggle-ctrl" data-bs-toggle="collapse" href="#' + _id + '" role="button" aria-expanded="' + _show + '" aria-controls="' + _id + '"><label><span class="glyphicon glyphicon-play"></span>' + _name + '</abel></a >').appendTo($_c);
    return $('<div class="toggle-container container collapse ' + (_show ? ' show' : '') + '" id="' + _id + '">').appendTo($_c);
}
var getPropLink = function ($_c, _url, _name, _remove) {
    return $('<div class="row"><label>'+ (_remove ?_name: '<a href="' + _url + '" class="prop-link" target="' + _name + '">' + _name + '</a>')+'</label></div>').appendTo($_c);
}
var confirmopen = function ($_p) {
    $_p.find('a').on('click', function () {
        var $_this = $(this);
        var _open = $_this.hasClass('openpdf');
        if (!_open) {
            var $_m = helper.jspanel.jspConfirmYesNo(undefined, { content: $_this.text()+'<br>因資料量較大，請確認要開啟!' }, function (b) {
                if (b)
                    $_this.addClass('openpdf')[0].click();
            });
            $_m.find('.close').on('click', function () { //bootstrap5 的原close無作用
                $_m.find('.btn-default ').trigger('click');
            });
        }
        $_this.removeClass('openpdf')
        return _open;
    });
}