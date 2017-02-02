/*
 * Thumbify Pruduct Image Slider v1.0.0
 * Copyright 2017 Eren Yener
 */

;(function($, window, document, undefined) {

    function Thumbify(element, options){

        this.settings = null;
        this.options = $.extend({}, Thumbify.Defaults, options);
        this.$element = $(element);
        this.$images = this.$element.find('img');

        this.setup();
    }

    Thumbify.Defaults = {

        showNagivation:true,
        width:250,

        containerClass:'thumbify-container',
        imageClass:'thumbify-image',

        debugMode:true,
    };

    Thumbify.prototype.setup = function() {
        this.log('setup');
        this.registerStyles();
    };

    Thumbify.prototype.log = function(message) {
        if(this.options.debugMode){
            console.log('thumbify message -> ' + message);
        }
    };

    Thumbify.prototype.registerStyles = function(){
        var self =this;
        this.log('registerStyles');
        this.$element.addClass(this.options.containerClass);
        this.$element.css('width', this.options.width);
        this.$images.addClass(this.options.imageClass);
    };

    $.fn.thumbify = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            new Thumbify(this, typeof option == 'object' && option);
        });
    };

    $.fn.thumbify.Constructor = Thumbify;

})(window.jQuery, window, document);