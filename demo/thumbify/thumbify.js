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
        this.$navbar = null;
        this.currentSection = null;
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
        navigation:"<div class='thumbify-navigator' style='display: none'></div>",
        navigationStep:"<div class='thumbify-navigator-step' data-id='{{dataId}}'></div>",
        navStepDataId:"{{dataId}}",
        debugMode:false,
    };

    Thumbify.prototype.setup = function() {
        this.log('setup');
        this.wrap();
        this.registerStyles();
        if(this.options.showNagivation){
            this.appendNavbar();
        }
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

    Thumbify.prototype.appendNavbar = function(){
        var self = this;

        self.log('appendNavbar');
        self.$wrapper.append(self.options.navigation);
        self.$navbar = self.$wrapper.find('.thumbify-navigator');

        for(var i=1; i<=this.imageCount; i++){
            var navElement = self.getNavElement(i);
            self.$navbar.append(navElement);
        }
    };

    Thumbify.prototype.getNavElement = function(dataId){
        var navElement  = this.options.navigationStep.replace(this.options.navStepDataId, dataId);
        return navElement;
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
        this.$wrapper.bind( "mousemove", $.proxy( this.onMouseMove, this));
        this.$wrapper.bind( "mouseenter", $.proxy( this.onMouseEnter, this));
        this.$wrapper.bind( "mouseleave", $.proxy( this.onMouseOut, this));
    };

    Thumbify.prototype.getImageContainerWidth = function(){
        return this.options.width * this.imageCount;
    };

    Thumbify.prototype.onMouseMove = function(e){
        this.log('onMouseMove');
        var parentOffset = this.$element.parent().offset();
        if(!!parentOffset){
            var relX = e.pageX - parentOffset.left;
            this.cursorPosition = {
                left: (relX < 0 ) ? relX * -1 : relX
            };
            this.slide();
        }
    };

    Thumbify.prototype.onMouseEnter = function(){
        this.log('onMouseEnter');
        this.showHideNavbar(true);
    };

    Thumbify.prototype.onMouseOut = function(){
        this.log('onMouseOut');
        this.showHideNavbar(false);
        this.destroy();
    };

    Thumbify.prototype.showHideNavbar =function (show) {
        this.log('showHideNavbar');

        if(this.options.showNagivation){
            if(show){
                this.$navbar.show();
            }else{
                this.$navbar.hide();
            }
        }
            var section = this.getSection();
        this.slideTo(section);
    };

    Thumbify.prototype.slide =function () {
        this.log('slide');
        var section = this.getSection();

        if(this.currentSection != section){
            this.slideTo(section);
            if(this.options.showNagivation){
                this.navTo(section);
            }

        }
    };

    Thumbify.prototype.slideTo = function(section){
        this.log('slideTo');
        var translateToX = this.getTranslateToX(section);
        var coordinates= "translate3d(-" + translateToX + "px, 0px, 0px)";
        this.$element.css('transform', coordinates);
    };

    Thumbify.prototype.navTo = function(section){
        this.log('navTo');
        var steps = this.$navbar.find('.thumbify-navigator-step');

        if(!!steps){
            $(steps).removeClass('active');
            var currentNavStep = steps[section];

            if(!!currentNavStep){
                $(currentNavStep).addClass('active');
            }
        }
    };

    Thumbify.prototype.getTranslateToX = function(section){
        var translateToX = section*this.options.width;
        return translateToX;
    };

    Thumbify.prototype.getSection =function () {
        var sectionWidth = Math.floor( this.options.width / this.imageCount );
        if(!!this.cursorPosition){
            var currentX = this.cursorPosition.left;
            var section = Math.floor(currentX / sectionWidth);
            section = section >= this.imageCount ? this.imageCount - 1 : section;
            return section;
        }
    };

    Thumbify.prototype.createDelegate = function(scope) {
        var fn = this;
        return function() {
            return fn.apply(scope, arguments);
        }
    };

    Thumbify.prototype.destroy = function() {
        this.log('destroy');
        this.$element.css('transform', 'translate3d(0px, 0px, 0px)');
    };

    $.fn.thumbify = function(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            new Thumbify(this, typeof option == 'object' && option);
        });
    };

    $.fn.thumbify.Constructor = Thumbify;

})(window.jQuery, window, document);