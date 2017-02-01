/*
 * Thumbify Pruduct Image Slider v1.0.0
 * Copyright 2017 Eren Yener
 */

;(function($, window, document, undefined) {

    function Thumbify(element, options){
        this.log("thumbfy ctor init");
        this.settings = null;

        this.options = $.extend({}, Thumbify.Defaults, options);
        this.$element = $(element);

        this.setup();
    }

    Thumbify.Defaults = {
    };

    Thumbify.prototype.setup = function() {

    };

    Thumbify.prototype.log = function(message) {
        console.log("thumbify message -> " + message);
    };


    $.fn.thumbify = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this);
            new Thumbify(this, typeof option == 'object' && option);
        });
    };

    $.fn.thumbify.Constructor = Thumbify;

})(window.jQuery, window, document);