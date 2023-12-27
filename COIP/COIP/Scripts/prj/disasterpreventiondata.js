
/****************cloud plugin****************/
(function ($) {
    'use strict';
    var pluginName = 'disasterpreventiondata';

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
            var that = this;
            this.$element.empty();
            //國土測繪中心
            var $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '國土測繪中心');
            //init土壤液化潛勢_中級($('<div class="col-md-12">').appendTo($_temp));
            //init土壤液化潛勢_初級($('<div class="col-md-12">').appendTo($_temp));
            //init地質敏感區($('<div class="col-md-12">').appendTo($_temp));
            //init地質敏感區_山崩與地滑($('<div class="col-md-12">').appendTo($_temp));
            init避難收容處所($('<div class="col-md-12">').appendTo($_temp));
            initAED位置($('<div class="col-md-12">').appendTo($_temp));
            //行政院農委會
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '行政院農委會');
            //init土石流潛勢溪流($('<div class="col-md-12">').appendTo($_temp));
            //init土石流潛勢溪流影響範圍($('<div class="col-md-12">').appendTo($_temp));
            init特定水土保持區($('<div class="col-md-12">').appendTo($_temp));
            /*init107年司馬庫斯崩塌地($('<div class="col-md-12">').appendTo($_temp));*/
            init鎮西堡_斯馬庫斯歷史崩塌地($('<div class="col-md-12">').appendTo($_temp));
            /*init山坡地範圍($('<div class="col-md-12">').appendTo($_temp));*/
            //init大規模崩塌潛勢區($('<div class="col-md-12">').appendTo($_temp));
            //init大規模崩塌影響範圍($('<div class="col-md-12">').appendTo($_temp));
            //經濟部地調所
            $_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '經濟部地調所');
            //init全臺順向坡分布圖($('<div class="col-md-12">').appendTo($_temp));
            //init全台土石流流動區分布圖($('<div class="col-md-12">').appendTo($_temp));
            //init土壤液化潛勢範圍($('<div class="col-md-12">').appendTo($_temp));
            //原住民保留地
            //$_temp = this._getToggleMeter($('<div class="container">').appendTo(this.$element), '原民會');
            //init原住民保留地($('<div class="col-md-12">').appendTo($_temp));
        }
        , _getToggleMeter: function ($_c, _name, _show) {
            _show = _show || true;
            var _id = 'id_' + helper.misc.geguid();
            $('<a data-bs-toggle="collapse" href="#' + _id + '" role="button" aria-expanded="' + _show + '" aria-controls="' + _id + '"><label><span class="glyphicon glyphicon-play"></span>' + _name + '</abel></a >').appendTo($_c);
            return $('<div class="collapse meter' + (_show ? ' show' : '') + '" id="' + _id + '">').appendTo($_c);
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