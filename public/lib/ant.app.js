window.ant = window.ant || {};
var ant =  window.ant;
ant.debug._DEBUG = false;

ant.controller = ant.ANObject.extend({
    attributes:{
        user: null

    },
    init:function(){
        this._super();
        this.lanuch();
    },
    launch:function(){
        this.appView =   new ant.app.view();
        this.userView =  new ant.app.userView();
        this.coverView = new ant.app.coverView();

    }
});

ant.command = ant.ANObject.extend(
    {attributes: {
       target: null,
       fnName: null
     },
      init: function(options){
          this._super();
          this.options = options || {};
          this.excuter = this.options.obj;
          this.fnName = this.options.fnName;
      },
      excute: function(){
          this.excuter[this.fnName].apply(this.excuter,Array.prototype.slice.call(arguments));
      }

    }
);



ant.controller = ant.ANObject.extend({
	init : function(){
		this._super();
        this.commandList = [
            'showReg',
            'hideReg',
            'showLogin',
            'hidLogin',
            'showLoading',
            'hideLoading'
        ];

	},
    createCommand: function(cmdName, excuter, fn){

    },

	
});

ant.statics = ant.statics || {};
ant.statics.zIndex = {
	 OVERLAY : 999,
     COMPONENT : 899,
     VIEW: 799,
     WINDOW: 1
};
ant.app= ant.app || {};
ant.app.view = ant.ui.UIView.extend({
	init : function(){
		this._super({preLoad: true});
		this.layer = null;
		console.log('initing !');
		
	},
	initWithContainer: function(container){
	     var obj = new ant.app.view();
	     obj.container = container;
	     return obj;
	},
	getResource : function(){
		return new ant.resource({
			css : ['public/resource/app/css/app.css'],
			html : ['public/resource/app/html/app.html']
		});
	},
	launch: function(){},
	
	load : function(){
		console.log('app load');
		this.setupLayer();
		//this.show();
	},
	realShow: function(){
		
		jQuery(this.getLayer()).css({opacity: 0}).appendTo(document.body).stop().animate({opacity: 1},900);
		
	},
	setupLayer : function(){
		//jQuery(this.container).css({width: jQuery(window).width(), height: jQuery(window).height()});
		this.layer = this.resource.resourceDic['html'][0];
        this.dispatchEvent('layerReady');
	    this.setFullScreen();
	},
	

	getContainerInfo : function(){
		if(this.container == document.body){
			return {height: jQuery(window).height(), width: jQuery(window).width()};
		}else{
			return {height: jQuery(this.container).height(), width: jQuery(this.container).width()};
		}
		
	},
	setFullScreen: function(){
		
		var h = jQuery(window).height(),
	       w =  jQuery(window).width();
		jQuery(this.layer).css({height:h, width:w});
	},
	screenResize : function(){
		
		var that = this;
		var theLayer = this.layer;
		jQuery(theLayer).animate({opacity: 0},200,function(){
			jQuery(theLayer).detach().css(that.getContainerInfo());
			jQuery(theLayer).appendTo(that.container).animate({opacity: 1},200);
		});
	}
});

ant.ui.menuView =  ant.ui.UIView.extend({
	init : function(options){
		this._super();
		this.options = options || {};
		
	},
	getResource : function(){
		return new ant.resource({
			css: ['resource/menu/menu.css'],
			html: ['resource/menu/menu.html']
		});
	},
	load: function(){
		this.setupComponet();
		
	}
});

/**
 * options {
 * 	attributes :  {name :  ,  class: 3 , age: 5},
 *  
 * }
 */


ant.model = ant.ANObject.extend({
	init: function(options){
	    this._super();
	    var options = options || {};
	    this.setupAttributes(options.attributes);
	    
	},
	addAttribute: function(aName,defaultValue){
		this.attributes = this.attributes || {};
		if (! typeof aName == 'string') {
			this.createException('attribute name must be a string');
			return ;
		}
		var aName = aName.slice(0,1).toUpperCase() + aName.slice(1,aName.length);
		if (this.attributes['_'+aName]  === 'undefined' || this['get'+aName] === 'undefined' || this['set'+aName] === 'undefined'){
			 if (defaultValue !== 'undefined'){
				 this.attributes['_'+aName] = defaultValue;
			 }
			 this['get'+aName]  = function(){
				  return this.attributes['_'+aName] ;
			  } ;
			  this['set'+aName] = function(value){
				  if (this.attributes['_'+aName] === value){
					  return;
				  }
				  this.dispatchEvent('change:'+aName, {old: this['get'+aName](), current: value});
				  this.attributes['_'+aName] = value;
			  };
			  
			  
		}else{
		    this.createException('the attribute can not be added');
		}
	},
	setupAttributes : function(attribs){
		if (!attribs) return ;
		for(var aName in attribs){
			this.addAttributes(aName, attribs[name]);
		}
	},
	get : function(){
		//override in your data interface
	},
	save: function(){
		//override in your data interface
	},
	del : function(){
		//override in your data interface
	}
	
});



ant.data.collection = ant.ANObject.extend({
	init: function(options){
		this.modelClass = options.modelClass;
		
	},
	get : function(){},
	save: function(){},
	del: function(){}
});



