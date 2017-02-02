/*
 * Thumbify Pruduct Image Slider v0.0.1
 * Copyright 2017 Eren Yener
 */

;(function($, window, document, undefined) {

    function Thumbify(element, options){

        this.settings = null;
        this.options = $.extend({}, Thumbify.Defaults, options);
        this.$element = $(element);
        this.$images = this.$element.find('img');
        this.imageCount = this.$images.length;
        this.$wrapper = null;
        this.elementOffset = this.$element.offset();
        this.cursorPosition = null;

        this.setup();
    }

    Thumbify.Defaults = {

        showNagivation:true,
        width:250,

        containerClass:'thumbify-stage',
        imageClass:'thumbify-item',

        wrapper:"<div class='thumbify-outer'></div>",
        debugMode:true,
    };

    Thumbify.prototype.setup = function() {
        this.log('setup');

        this.wrap();
        this.registerStyles();
        this.registerEvents();
    };

    Thumbify.prototype.log = function(message) {
        if(this.options.debugMode){
            console.log('thumbify message -> ' + message);
        }
    };

    Thumbify.prototype.wrap = function(){
        this.log('wrap');
        this.$element.wrap( this.options.wrapper );
        this.$wrapper = this.$element.parent();
    };

    Thumbify.prototype.registerStyles = function(){
        var self =this;
        this.log('registerStyles');
        this.$element.addClass(this.options.containerClass);
        this.$element.css('width', this.getImageContainerWidth());
        this.$element.css('transform', 'translate3d(0px, 0px, 0px)');
        this.$element.css('transition', '0');
        this.$images.addClass(this.options.imageClass);
        this.$images.css('width', this.options.width);
        this.$wrapper.css('width', this.options.width);
    };

    Thumbify.prototype.registerEvents = function () {
        this.log('registerEvents');
        this.$wrapper.on( "mousemove", $.proxy( this.onMouseMove, this));
        this.$wrapper.on( "mouseout", $.proxy( this.onMouseOut, this));
    };

    Thumbify.prototype.getImageContainerWidth = function(){
        return this.options.width * this.imageCount;
    };

    Thumbify.prototype.onMouseMove = function(e){
        this.log('onMouseMove');
        this.cursorPosition = {
            left: e.pageX - this.elementOffset.left,
            top: e.pageY - this.elementOffset.top
        };

        this.slide();
    };

    Thumbify.prototype.onMouseOut = function(){
        this.log('onMouseOut');
        this.destroy();
    };

    Thumbify.prototype.slide =function () {
        var section = this.getSection();
    };

    Thumbify.prototype.getSection =function () {
        var sectionWidth = Math.floor( this.options.width / this.imageCount );
        var currentX = this.cursorPosition.left;
        var section = Math.floor(currentX / sectionWidth) + 1;
        section = section > this.imageCount ? this.imageCount : section;
    };

    Thumbify.prototype.createDelegate = function(scope) {
        var fn = this;
        return function() {
            return fn.apply(scope, arguments);
        }
    };

    Thumbify.prototype.destroy = function() {
        this.log('destroy');
    };

    $.fn.thumbify = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            new Thumbify(this, typeof option == 'object' && option);
        });
    };

    $.fn.thumbify.Constructor = Thumbify;

})(window.jQuery, window, document);