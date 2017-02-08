/*
 * Thumbify Pruduct Image Slider v0.0.1
 */

;(function($, window, document, undefined) {

    function Thumbify(element, options){

        this.settings = null;
        this.options = $.extend({}, Thumbify.Defaults, options);
        this.constants = Thumbify.Constants;
        this.$element = $(element);
        this.$images = this.$element.find('img');
        this.imageCount = this.$images.length;
        this.$wrapper = null;
        this.$navbar = null;
        this.currentSection = null;
        this.cursorPosition = null;

        this.setup();
    }

    Thumbify.Defaults = {
        width:250,
        minImageCount: 2,
        maxImageCount: 4,
        showNagivation:true,
        wrapperClass:'',
        navClass: '',
        debugMode:false
    };

    Thumbify.Constants = {
        wrapper:"<div class='thumbify-outer {{wrapperClass}}'></div>",
        navigation:"<div class='thumbify-navigator {{navigatorClass}}' style='display: none'></div>",
        navigationStep:"<div class='thumbify-navigator-step' data-id='{{dataId}}'></div>",
        navStepDataIdReplaceKey:"{{dataId}}",
        navigationClassReplaceKey: "{{navigatorClass}}",
        wrapperClassReplaceKey: "{{wrapperClass}}",
        containerClass:'thumbify-stage',
        imageClass:'thumbify-item'
    };

    Thumbify.prototype.setup = function() {
        this.log('setup');

        if (this.imageCount >= this.options.minImageCount) {
            this.wrap();
            this.registerStyles();

            if (this.imageCount >= this.options.maxImageCount) {
                var overflowCount = this.imageCount - this.options.maxImageCount;
                this.hideOverflowedImages(overflowCount);
                this.imageCount = this.options.maxImageCount;
            }
            if(this.options.showNagivation){
                this.appendNavbar();
            }
            this.registerEvents();
        }
    };

    Thumbify.prototype.log = function(message) {
        if(this.options.debugMode){
            console.log('thumbify message -> ' + message);
        }
    };

    Thumbify.prototype.wrap = function(){
        this.log('wrap');
        var wrapper = this.getElement(this.constants.wrapper, this.constants.wrapperClassReplaceKey, this.options.wrapperClass);
        this.$element.wrap(wrapper);
        this.$wrapper = this.$element.parent();
    };

    Thumbify.prototype.hideOverflowedImages = function(overflowCount){
        var self = this;
        var i = this.imageCount;
        var lastShouldBeHiddenIndex = this.imageCount - overflowCount;
        for(var i = this.imageCount; i > lastShouldBeHiddenIndex; i-- ){
            console.log(i);

            $(self.$images[i]).hide();
        }
    };

    Thumbify.prototype.appendNavbar = function(){
        var self = this;
        self.log('appendNavbar');
        var navigation = this.getElement(this.constants.navigation, this.constants.navigationClassReplaceKey, this.options.navClass);
        self.$wrapper.append(navigation);
        self.$navbar = self.$wrapper.find('.thumbify-navigator');


        for(var i=1; i <= this.imageCount; i++){
            var navElement = self.getElement(self.constants.navigationStep, this.constants.navStepDataIdReplaceKey, i);
            self.$navbar.append(navElement);
        }
    };

    Thumbify.prototype.getElement = function(element, replaceKey, replaceValue){
        var result = element;
        if(!!element){
            var result = element.replace(replaceKey, replaceValue);
        }
        return result;
    };

    Thumbify.prototype.registerStyles = function(){
        var self =this;
        this.log('registerStyles');
        this.$element.addClass(this.constants.containerClass);
        this.$element.css('width', this.getImageContainerWidth());
        this.$element.css('transform', 'translate3d(0px, 0px, 0px)');
        this.$element.css('transition', '0');
        this.$images.addClass(this.constants.imageClass);
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