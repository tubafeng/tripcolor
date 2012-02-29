//some constant value
//IE sniff from dean edward
var ant = {};
ant.debug = {};
ant.debug._DEBUG = true;
ant.constval  = {};
ant.constval.ua = {

	//var isMSIE = /*@cc_on!@*/false;
};

//language fix ? maybe
(function init() {

	//
	Function.prototype.method = function(name,fn) {
		this.prototype[name]  = fn;
		return this;
	};
	if (!Array.prototype.forEach) {
		Array.method('forEach', function(fn,thisObj) {
			var scope = thisObj||window;
			for ( var i = 0 ,len = this.length; i<len;++i) {
				fn.call(scope,this[i],i,this);
			}
		});
	}

	if(!Array.prototype.filter) {

		Array.method('filter', function(fn,thisObj) {
			var scope = thisObj || window;
			var a = [];
			for(var i=0, len = this.length; i<len;++i) {
				if (!fn.call(scope,this[i],i,this)) {
					continue;
				}
				a.push(this[i]);

			}

			return a;
		});
	}

	if (!Array.prototype.get) {
		Array.method('get', function() {
			return this.shift()||null;
		});
	}

	if (!Array.prototype.item) {
		Array.method('item', function(pos) {
			if(typeof pos == 'number') {
				return pos >= 0 ? (pos<this.length? this[pos] : null ): (Math.abs(pos)<this.length? this[this.length+pos] : null) ;
			}

			return null;
		});
	}

	if(!Array.prototype.peek) {
		Array.method('peek', function() {
			return this[0]||null;
		});
	}

	// the bind method 	 , from prototype
	Function.prototype._bind = Function.prototype.bind; // backup
	Function.prototype.bind = function(obj) {
		var fn = this;
		return function() {

			return fn.apply(obj,arguments);

		};
	};
	// a curry tool
	// a memory call , from javascript ninjia book , im i right?
	// :(
	Function.prototype._partial = Function.prototype.partial;
	Function.prototype.partial = function() {
		var args = Array.prototype.slice.call(arguments);
		var fn = this;
		return function() {

			//console.log(fn + "/n ------");

			var myargs = Array.prototype.concat.call(args,Array.prototype.slice.call(arguments));
			//console.log(myargs);
			return fn.apply(this,myargs);
		};
	};
})();
//language fix over   -----

//=============== for basic API defination ===================
//--------------- most of idea came from :
//             1 .the book <<pro javascript tecs>> by John Resig
//             2 . Dean Edward's website
//             3 . bigfoot from france : Gerard Ferrandez
//                   site: http://www.dhteumeuleu.com
//             4 . the book << javascript design patterns >>
//			   5 . some respected libs such as Jquery, prototype ......
//             6 . the class code is from John Resig's website , http://ejonh.org
//					  according J.R , this code is inspired/based by base2 and prototype,
//					  aparently D.E do not aggree with that,
//					  anyway, John 's code is more simple for a starter like me , so wherever it came from, it's tase goooood !
//				      it's possible the future JS code will be mostly base on this class code , not only for me .
//--------------- also inspired by :
//--------------- maybe some time in the future I'll have my own suits,
//--------------- after all , having fun please.
//=============== Sept 10 , 2010 by ant =====================

window.ant = window.ant || {};
ant.util = ant.util || {};
//for inheritance
//this is version 0,2 , these class code is from J.R
(function() {
	var initializing = false, fnTest = /xyz/.test( function() {xyz;
	})?
	/\b_super\b/ : /.*/; // for function serializition test

	ant.Class = function() {
	};
	ant.Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();  // the true init code lies in the function init() ,which is not excuted here , to save time, only construct the Class skeleton!
		initializing = false;
   
        function addAttribute(name){
        	
        	var p = prototype;
        	var aName = name.slice(0,1).toUpperCase() + name.slice(1);
        		
        			
       			    p['get'+aName]  = function(){
       				    return this._attributes[name] || null ;
       			  	};
       			  	
       			    p['set'+aName] = function(value, options){
       			      options || (options = {});
       				  if (this._attributes[name] === value){
       					  return ;
       				  }
       				  if (!options.silence){
       				  	if (this.dispatchEvent){
       				  		this.dispatchEvent('change:'+name, {origin: this._attributes[name], current: value});
       				  		//console.log(this._attributes[name] + '   <---origin value  , new value--->' + value );
       				  	}
       				  }
       				  this._attributes[name] = value;
       			  };
       			  
        };
        
        prototype["_set"] = function(attrs, options){
        	
        	var at = this._attributes = this._attributes || {};
        	for(var key in attrs){
        		var aName = key.slice(0,1).toUpperCase() + key.slice(1);
        		this['set'+aName](attrs[key],options);
        	}
        
        };
        
        prototype["_initAttributes"] = function(){
        	this._attributes = this._attributes? _.clone(this._attributes) : {};
            this._set(prop.attributes, {silence : true});
        };
		
		for(var name in prop) { //bind the _super for all functions
			
			
			if (name == 'attributes'){
				for (var key in prop['attributes']){
				   addAttribute(key);
				}
				continue;
			}
			
			prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ?
			(function(name,fn) {
				return function() {
					var tmp = this._super;
					this._super = _super[name];
					var ret = fn.apply(this,arguments);
					this._super = tmp;
					return ret ;
				};
			})(name, prop[name]): prop[name];
		}

		var Class = prop.attributes ?  function(){
	        	this._initAttributes(prop);
	        	if(!initializing && this.init)
					this.init.apply(this, arguments);
	        	
	        	
	        }: function(){
	        	if(!initializing && this.init)
					this.init.apply(this, arguments);
	        };
		Class.prototype = prototype; // pass the skeleton
		Class.constructor = Class; // ready to fire and holding on



		Class.extend = arguments.callee; // extend is useful , pass to children
		return Class; // done . a function is returned and wait for the new command .

	};
})();
//functions below is standard util function , the code can be found anywhere
ant.util.isFunction  = function(obj) {
	return (typeof obj === 'function');
};
ant.util.isUndefined = function(obj) {
	return ( obj === undefined);
};
ant.util.isString = function(obj) {
	return (typeof obj == "string" || obj instanceof String );
};
ant.util.isNumber = function(obj) {
	return (typeof obj == "number" || obj instanceof Number);
};
ant.util.isArray = function(obj) {
	return (obj instanceof Array);

};
ant.util.hasMethod = function(obj, fn) {
	return ( b != null && !ant.util.isUndefined(b[a]) && ant.util.isFunction(b[a]));
};

//inheritance over here -------

//function wrapper 



ant.util.string = {
	getUpperHead : function (str){
		return str.substr(0,1).toUpperCase() + str.substr(1);
	}
};

//a central timer tool , return false when you want remove it from the queue .
ant.util.timer = {
	timerID : 0,
	timers : [],
	start : function() {
		if (this.timerID)
			return;

		(function() {

			var Timers = ant.util.timer.timers;
			for (var i = 0 ; i< Timers.length ; i++) {
				if(Timers[i]() === false)
					Timers.splice(i,1);
				i--;
			}

			ant.util.timer.timerID = setTimeout(arguments.callee , 1);

		})();
	},
	stop : function() {
		clearTimeout(this.timerID);
		this.timerID = 0;
	},
	add : function(fn) {
		this.timers.push(fn);
		this.start();
	}
};

ant.util.data = {
	merge : function(dic1 , dic2) {
		for(var key in dic2) {
			dic1[key] = dic2[key];
		}
		return dic1;
	},
	clone : function(dic, deep){
	    
	}
};


//for dom manipulate
ant.util.dom = {
	getGlobal : function(){
		return (1,eval)('this');
	},

	addScriptByStr : function(str) {
		var headele = document.getElementsByTagName("head")[0];
		var scpt  = document.createElement("script");
		scpt.appendChild(document.createTextNode(str));
		scpt.setAttribute('type', 'text/javascript');
		scpt.setAttribute('language', 'javascript');
		scpt = headele.appendChild(scpt);
		return scpt;
	},
	addCssByStr : function(str,src) {
		// prevent insert duplicatd css sheets
		// a simple compare 2 css str's length , if same then it will be the same css(:p)
		// still the collision chance is small enough 
		window._savedCssStr = window._savedCssStr || [];
		var cssArray = window._savedCssStr;
		for (var i= 0 ; i< cssArray.length ; i++){
			
		     if (str.length == cssArray[i]){
		    	 return ;
		     }
		}
		//console.log(str);
		cssArray.push(str.length);
		// real job 
		var styleSheet;
		if (document.createStyleSheet)
		{
			styleSheet = document.createStyleSheet(src);
		}
		else
		{
			styleSheet =jQuery("head")
		       .append('<link rel="stylesheet" type="text/css" href="'+ src + '" />'); 
		}
		
		
		return styleSheet;
	},
	domReady : function (fn) {

		if(ant.util.dom.domReady.done)
			return fn();
		// if already added a function
		if(ant.util.dom.domReady.timer) {

			// add an other
			ant.util.dom.domReady.ready.push(fn);
		} else {
			// attach an evnet for when the page finishes loading,
			// in case it finishes first , use addEvent.
			ant.util.event.addEvent(window,"load",ant.util.dom.isDOMReady);
			// now Initialize the array of functions to execute

			ant.util.dom.domReady.ready=[fn];
			ant.util.dom.domReady.timer= setInterval( function() {
				//alert("timer !!");
				ant.util.dom.isDOMReady();

			}
			,13);

		}
	},
	isDOMReady: function () {

		//if  already figured out that the page is ready, ignore

		if(ant.util.dom.domReady.done)
			return false;
		// check accessbilities

		if (document && document.getElementsByTagName && document.getElementById && document.body) {

			clearInterval( ant.util.dom.domReady.timer );
			ant.util.dom.domReady.timer = null;

			for (var i= 0 ; i< ant.util.dom.domReady.ready.length; i++) {
				ant.util.dom.domReady.ready[i]();
			}

			ant.util.dom.domReady.ready = [];
			ant.util.dom.domReady.done = true;
			ant.util.event.removeEvent(window,"load",ant.util.dom.isDOMReady);
			//domReady.IsDone = true;
			//alert("domisready!!");
		}
	},
	create : function (elem) {

		return document.createElementNS?
		document.createElementNS('http://www.w3.org/1999/xhtml',elem):
		document.createElement(elem);
	},
	remove : function (elem) {

		if(elem && elem.parentNode)
			elem.parentNode.removeChild(elem);
	},
	checkElem: function (a) {
		var r = [];
		// force it into an array;
		if (a.constructor != Array )
			a = [a];

		for (var i = 0 ; i< a.length; i++) {
			if(a[i].constructor == String ) {
				var div = ant.util.dom.create("div");

				div.innerHTML = a[i];
				// extract dom structure back to r
				for (var j=0; j<div.childNodes.length; j++)
					r[r.length] = div.childNodes[j];
			} else if(a[i].length) {
				for(var j=0; j<a[i].length;j++)
					r[r.length] = a[i][j];
			} else {
				r[r.length] = a[i];
			}
		}

		return r;
	},
	append : function (parent,elem) {
		var elems = ant.util.dom.checkElem(elem);
		for(var i=0 ; i< elems.length; i++) {
			parent.appendChild(elems[i]);
		}
		return elems[0];
	},
	attr : function (elem,name,value) {
		if(!name || name.constructor!=String)
			return '';
		name = { 'for': 'htmlFor', 'class': 'class'} [name] || name;
		if(typeof value != 'undefined') {
			elem[name] = value;
			if (elem.setAttribute)
				elem.setAttribute(name,value);
		}
		return elem[name] || elem.getAttribute(name) || '';
	}
};

//for event manipulate  from dean edward
ant.util.event = {

	eventGuid : 1,
	addEvent : function (element,type,handler) {

		if (!handler.$$guid)
			handler.$$guid = ant.util.event.eventGuid++;

		if(!element.events)
			element.events={};

		var handlers = element.events[type];
		if(!handlers) {
			handlers = element.events[type] = {};
			if(element["on" + type]) {
				handlers[0] = element["on" + type];
			}

		}
		handlers[handler.$$guid] = handler;

		element["on"+type] = ant.util.event.handleEvent;

	},
	removeEvent: function (element,type,handler) {
		if(element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	},
	handleEvent: function (event) {

		var returnValue = true;
		event = event||ant.util.event.fixEvent(window.event);
		var handlers = this.events[event.type];

		for(var i in handlers) {
			this.$$handleEvent = handlers[i];
			if(this.$$handleEvent(event) === false) {
				returnValue = false;
			}
		}
		return returnValue;
	},
	fixEvent: function (event) {
		// sarfari's touch Event is still have some problems , todo----- //
		event.preventDefault = ant.util.event.fixEvent.preventDefault = function() {
			this.returnValue = false;

		};
		event.stopPropagation = ant.util.event.fixEvent.stopPropgation = function() {
			this.cancelBubble = true;
		};
		//  mouse position
		event.pageY = (event.clientY + document.body.scrollTop)||0;
		event.pageX = (event.clientX + document.body.scrollLeft)||0;
		// mouse position related to current element
		event.layerX = event.offsetX||0;
		event.layerY = event.offsetY||0;
		return event;
	},
	// for Class use , the backbone of the event driving   , diprecated
	Observer : function() {
		this.fns = [],
		subscribe = function(fn) {
			this.fns.push(fn);
		},
		unsubscribe= function(fn) {
			this.fns = this.fns.filter( function(el) {
				if (el!==fn) {
					return el;
				}
			}
			);
		},
		fire= function(o) {
			this.fns.forEach( function(el) {
				el(o);
			});
		}
	},
	// my stuff , just a extension of D.E's code
	//propers : some time you want define a event interface and NOT want bind any handler's , USE createEvent
	createEvent : function(ele,type) {
		if (!ele.events)
			ele.events = {};
		if (!ele.events[type])
			ele.events[type]={};

	},
	dispatchEvent : function(ele,type,props) {
		var e = {};
		e.target = ele;
		e._ant_target = ele ;
		e._ant_type = type;
		// some addtional info pass with event e
		if (!props)
			props = {};
		for (var p in props) {
			e[p] = props[p];
		}
		e.type = type;
		if (ele.events && ele.events[type]) {
			ant.util.event.handleEvent.call(ele,e);
		}
	},
	// it is the backward operation of createEvent
	clearEvent : function(ele, type) {
		if(!ele.events)
			return;
		if (!ele.events[type])
			return;
		ele.events[type] = {};
		return;

	},
	addEventOnce : function(ele, type , fn ) {
		ant.util.event.addEvent(ele,type, function(e) {
			fn.apply(ele, arguments);
			ant.util.event.removeEvent(ele, type, arguments.callee);
		});
	},
	getSourceElem : function(e) {
		return e.srcElement;

	}
};

//for css manipulation
ant.util.css = {

	// For cssStylesheet manipulation ,
	getStylesheetByName : function(SSName) {
		var sh = document.styleSheets;
		for (var i = 0 , sLength = sh.length; i< sLength ; i++) {
			if (sh[i].title == SSName)
				return sh[i];
		}
	},
	addStyleSheet : function(sheetTitle) {
		var headele = document.getElementsByTagName("head")[0];
		var ssht  = document.createElement("style");
		ssht.appendChild(document.createTextNode(''));
		var sheetsLength = document.styleSheets.length;
		headele.appendChild(ssht);

		var mysheet = document.styleSheets[sheetsLength];

		if(sheetTitle && sheetTitle.constructor == String)
			mysheet.title = sheetTitle;

		return mysheet;
	},
	deleteStyleSheet: function(sheet) {
		if(sheet.constructor == CSSStyleSheetConstructor) {
			var len = sheet.cssRules.length;
			//if(len) throw Error('sheet is not empty');
			sheet.ownerNode.parentNode.removeChild(sheet.ownerNode);
		} else {
			throw Error('First Argument Must be CssStyleSheet Object');
		}
	},
	addRule : function(sheet, selecttor,  rText) {
		if(sheet.constructor == CSSStyleSheetConstructor) {
			var len = sheet.cssRules.length;
			var insertText = selector + '{' + rText+ '}';
			sheet.insertRule(rText,len);
		} else {
			throw Error('First Argument Must be CssStyleSheet Object');
		}
	},
	modifyRule : function(sheet,selector,rText) {
		if(sheet.constructor == CSSStyleSheetConstructor) {
			var len = sheet.cssRules.length;
			for (var i = 0 ; i< len ; i++) {
				var rule = sheet.cssRules[i];
				if (rule.selectorText = selector) {
					rule.cssText=selector+'{' + rText + '}';
				}
			}
		} else {
			throw Error('First Argument Must be CssStyleSheet Object');
		}
	},
	// For className manipulationßßßß

	hasClass : function(ele, clsName) {
		var ret = false;
		ret = ret || new RegExp("(^|\\s)" + clsName + "(\\s|$)").test( ele.className );
		return ret;
	},
	addClass : function(ele,clsName) {

		if (!ant.util.css.hasClass.call(ele,clsName))
			ele.className += " "+clsName;

	},
	removeClass : function(ele,clsName) {

		if (ant.util.css.hasClass.call(ele,clsName)) {
			var reg = new RegExp('(\\s|^)'+clsName+'(\\s|$)');
			ele.className=ele.className.replace(reg,' ');
		}

	},
	//  John'sƒƒ

	getStyle: function(ele, name) {

		if (name=='opacity' ) {

			
		}
		if(ele.style[name])
			return ele.style[name];
		else if (ele.currentStyle)
			return ele.currentStyle[name];
		else if (document.defaultView && document.defaultView.getComputedStyle) {
			//console.log(name);
			name = name.replace(/([A-Z])/g,"-$1");
			name = name.toLowerCase();
			var s = document.defaultView.getComputedStyle(ele);
			return s && s.getPropertyValue(name);
		} else
			return null;
	},
	setStyle: function(ele,prop,val) {

		if (prop == "opacity") {
			ant.util.css.setOpacity(ele,val);
			return;
		}

		if( prop == "left" || prop == "top" || prop == "height" || prop == "width" ) {
			val = val+"px";
		}

		ele.style[prop] = val;

	},
	pageX : function(ele) {

		return ele.offsetParent ?
		ele.offsetLeft + ant.util.css.pageX(ele.offsetParent):
		ele.offsetLeft;
	},
	pageY : function(ele) {
		return ele.offsetParent ?
		ele.offsetTop + ant.util.css.pageY(ele.offsetParent):
		ele.offsetTop;

	},
	parentX: function(ele) {
		return ele.parentNode == ele.offsetParent ?
		ele.offsetLeft:
		ant.util.css.pageX(ele) - ant.util.css.pageX(ele.parentNode);
	},
	parentY: function(ele) {
		return ele.parentNode == ele.offsetParent ?
		ele.offsetTop:
		ant.util.css.pageY(ele) - ant.util.css.pageY(ele.parentNode);
	},
	posX: function(ele) {
		return parseInt(ant.util.css.getStyle(ele,"left"));
	},
	posY: function(ele) {
		return parseInt(ant.util.css.getStyle(ele,"top"));
	},
	setX: function(ele,pos) {
		ele.style.left = pos + "px";
	},
	setY: function(ele,pos) {
		ele.style.top = pos + "px";
	},
	addX : function(ele, dx) {
		setX(ele, ant.util.css.posX(ele) + dx);
	},
	addY : function(ele, dy) {
		setY(ele, ant.util.css.posY(ele) + dy);
	},
	getHeight: function(ele) {
		return parseInt(ant.util.css.getStyle(ele,'height'));
	},
	getWidth: function(ele) {
		return parseInt(ant.util.css.getStyle(ele,'width'));
	},
	fullHeight: function(ele) {
		if(ant.util.css.getStyle(ele,'display')!='none')
			return ele.offsetHeight || ant.util.css.getHeight(ele);
		var old = ant.util.css.resetCss(ele,{
			display:'',
			visibility:'hidden',
			position:'absolute'
				});

		var h= ele.clientHeight || ant.util.css.getHeight(ele);
		ant.util.css.restoreCss(ele,old);
		return h;
	},
	fullWidth : function(ele) {
		if(ant.util.css.getStyle(ele,'display')!='none')
			return ele.offsetWidth || ant.util.css.getWidth(ele);
		var old = ant.util.css.resetCss(ele,{
			display:'',
			visibility:'hidden',
			position:'absolute'});

		var w= ele.clientWidth || ant.util.css.getWidth(ele);
		ant.util.css.restoreCss(ele,old);
		return w;
	},
	pageHeight : function() {
		return document.body.scrollHeight;
	},
	pageWidth : function() {
		return document.body.scrollWidth;
	},
	scrollX : function() {
		var de = document.documentElement;

		return self.pageXOffset||(de&&de.scrollLeft)||document.body.scrollLeft;
	},
	scrollY : function() {
		var de = document.documentElement;

		return self.pageYOffset||(de&&de.scrollTop)||document.body.scrollTop;
	},
	windowWidth : function() {
		var de = document.documentElement;
		return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	},
	windowHeight : function() {
		var de = document.documentElement;
		return self.innerHeight || (de&&de.clientHeight)||document.body.clientHeight;
	},
	resetCss : function(ele,prop) {
		var old = {};
		for(var i in prop) {
			old[i] = ele.style[i];
			ele.style[i] = prop[i];
		}
		return old;

	},
	restoreCss : function(ele,prop) {
		for (var i in prop) {
			ele.style[i] = prop[i];
		}
	},
	// level from 0 to 100
	setOpacity: function (ele,level) {
		// filters !!
		if (ele.filters) {

			// ele.style.filter.item('DXImageTransform.Microsoft.alpha').opacity = parseInt(level);
			// style.filter !!!!
			ele.style.filter = 'alpha(opacity=' + level + ')';
		} else
			ele.style.opacity = level/100;

		return true;

	}
};

/// start of Ajax

ant.ajax = {};
ant.ajax.getDefaultRequest = function() {
	var req = {
		priority: 5,
		type: "POST",
		retryCount: 5,
		async : true ,
		cache: "no-cache",
		url: "",
		data: "",
		scope : window, 
		load: function (e) {
			console.log('xhr canceled ');
		},
		onerror: function (e) {
			console.log('xhr failure ');
		},
		onprogress: function (e) {
			console.log('xhr on progress ');
		}
		
	};
	return req;
};
ant.ajax.Manager = (function(context) {
	// queue defination start --------------
	var queque = (function() {
		var _mission = [];
		var _compare = function(a,b) {
			var a = parseInt(a);
			var b = parseInt(b);
			return (a>b)? 1 : ((a==b) ? 0 : -1) ;
		};
		var single = function() {
			if(this.__defineGetter__){
				this.__defineGetter__('length', function() {
					return _mission.length;
				});
			}
		};
		var methods = ['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'join'];
		for(var i = 0 ; i< methods.length ; i++) {
			single.prototype[methods[i]] = (function(fnName) {
				return function() {
					return Array.prototype[fnName].apply(_mission, arguments);
				};
			})(methods[i]);
		}
		single.prototype.sort = function(comparefn) {
			return Array.prototype.sort.call(_mission, comparefn || _compare);
		};
		single.prototype.setCompFn= function(cmpFn) {
			_compare = compFn;
		};
		single.prototype.getLength = function(){
			return _mission.length;
		};
		single.prototype.list = function() {
			console.log('-----');
			var str = '';
			for (var i = 0 ; i< _mission.length ; i++) {
				str = str + ' - ' + (_mission[i].priority);

			}
			console.log(str);
			console.log('-----');
			return _mission.length;
		};
		return new single();

	})();
	// queque defination end ------------------
	// queue Tests start here ----------------

	// Create XHR object Start -----------------
	function createXHR () { // factory method use memorize
		var methods = [
		function () {
			return new XMLHttpRequest();
		},

		function () {
			return new ActiveXObject('Msxml2.XMLHTTP');
		},

		function () {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}

		];
		for (var i = 0, len = methods.length; i < len; i++) {
			try {
				methods[i]();
			} catch (e) {
				continue;
			}
			createXHR = methods[i]; // Memoize the method.
			return methods[i]();
		}
		throw new Error('Create XHR request Error: could not create XHR object');
	}

	// Create XHR object End  -----------------------

	// XHR POOL start ---------------------
	var xhrPool = function() {
		this.MAX_CONN = 10;
		this.activeConnection  = 0 ;
	};
	xhrPool.prototype = {
		getXhr : function() {
			if(this.activeConnection >= this.MAX_CONN) {
				//console.log('can not get more xhr');
				return null;

			} else {
				var that = this;
				xhr = createXHR();
				xhr.addEventListener('load',(function(pool) {
					return function() {
						that.activeConnection --;
						//console.log('active connection is : ' +that.activeConnection);
					};
				})(that),false);
				xhr.addEventListener('error',(function(pool) {
					return function() {
						that.activeConnection --;
						console.log('Error happened : ' +  this.url);
						console.log('active connection is : ' +that.activeConnection);
					};
				})(that),false);
				this.activeConnection++ ;
				return xhr;

			}
		}
	};

	var mypool = new xhrPool();

	// XHRPOOL define end here ----------------------

	var Manager = function() {
		this.mypool = mypool;
		this.queue = queque;
		this.timer = 0 ;
		this.retryInterval = 70;
		this.cmpfn = function(req1 , req2) {
			return req1.priority > req2.priority ?  1 : (req1.priority == req2.priority) ? 0 : -1 ;
		}
	};
	Manager.prototype = {
		add : function(request) {
			request = ant.util.data.merge(ant.ajax.getDefaultRequest(),request);
			this.queue.push(request);
			//console.log('before sort ');
			//queue.list();
			this.queue.sort(this.cmpfn);
			//console.log('after sort');
			//queue.list();
			this.flush();
		},
		flush : function() {
			var that = this;
			if ((!(this.queue.length)) || (this.queue.getLength()===0)) {
				clearTimeout(this.timer);
				this.timer = 0;
				return ;
			}
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = 0 ;

			}

			var xhr = this.mypool.getXhr();
			if (!xhr) {
				//console.log('no xhr get , set Timer ');
				this.timer = setTimeout((function(manager) {
					//var t = new Date();
					//t = t.getMilliseconds();
					//this.setTimerTime = t;
					//console.log( this.setTimerTime = t);
					return function() {
						//var t2 = new Date();
						//t2 = t2.getMilliseconds();
						//console.log('time passed : ' + (t2 - manager.setTimerTime));
						manager.setTimerTime = 0 ;
						//console.log('reflushing !')
						manager.flush();
					}
				})(that), this.retryInterval);
				return;
			}

			var req = this.queue.shift();
			this._send(xhr,req);

		},
		_send : function(xhr,req) {
			var that = this;
			(function(request,xhr) {
				//xhr.addEventListener('readystatechange',function(){console.log('state change  : ' + this.readyState + ' ** ' +  this.status+ '**' + request.url);},false);
				//xhr.onreadystatechange = function(){console.log('state change  : ' + this.readyState + ' ** ' +  this.status+ '**' + request.url);}
				xhr.addEventListener('load',request.load,false);
				xhr.addEventListener('error',request.onerror,false);
				xhr.open(request.type,request.url,request.async);
				xhr.setRequestHeader("Pragma", request.cache);
				xhr.setRequestHeader("Cache-Control", request.cache);
				xhr.send(request.data);

			})(req,xhr);
			this.flush();
		}
	};

	return new Manager();

})(ant);

// for test 

ant.loadTestFile = ant.debug._DEBUG == true ?
		  function(){}
		: function(){};
ant.ANUtest = ant.Class.extend({ // a singlton
 init: function () {
     this.testCases = {};
     this.testCount = 0;

 },
 assert: function (result) {
     if (!result) {
         throw ("wrong !" + "/n " + "in " + arguments.callee.caller + "arguments : " + Array.prototype.slice.call(arguments));
     }
 },
 registerTestCase: function (testName, fn, testType) { // usage  :
     // registerTestCase("the Object hasMethod test", function(){
     //        var ANObject = new AN___Object();  // this is a problem line should cause problem
     // }, fasle) // testType is for futhur use
     var testFn = function () {
     	var wrong = false ;
         if (!PublicANUtest) {
             throw ("NO PublicANUtest found");
         } else {
             var ret;
             try {
                 ret = fn();
             } catch (err) {
             	wrong = true ;
                 console.log(err);
             }
             if (!wrong){
             	console.log(testName+ 'is successful.');
             }


         }
     };

     this.testCases[this.testCount] = testFn;
     testFn();
     this.testCount++;
 }
});



//

ant.ANObject = ant.Class.extend({
 init: function (){
 	
 	this.addEvent = function(type,fn){
 		return ant.util.event.addEvent(this,type,fn);
 	};
 	this.dispatchEvent = function(type,eventArg){
 		return ant.util.event.dispatchEvent(this,type,eventArg);
 	};
 	
 	this.createEvent = function(type){
 		return ant.util.event.createEvent(this,type);
 	};
 	
 	this.removeEvent = function(type,fn){
 		return ant.util.event.removeEvent(this,type,fn);
 	};
 	this.clearEvent = function(type){
 		return ant.util.event.clearEvent(this,type);
 	};
 	this.addEventOnce = function(type, fn){
 		return ant.util.event.addEventOnce(this, type, fn);
 	};
 },
 createException  : function(msg){
 	var exceptionClass = this.defaultExceptionClass || ant.Exception;
 	throw new exceptionClass(msg);
 },
 toJSON : function(){
	 return _.clone(this._attributes);
 },
 _mergeOptions : function(origin,newOption){
 	for(var key in newOption){
 		origin[key] = newOption[key];
 	}
 	return origin;
 },
 delay: function(fn,context,timeDelay){
 	var global =ant.util.dom.getGlobal();
 	global.setTimeout(function(){
 		fn.apply(context);
 	},timeDelay);
 },
 destructor: function () {}, // not Implemented
 hasMethod: function (methodName) {
     return !!(this[methodName] && (typeof this[methodName] == 'function'));
 },
 
 //need a syntheise
 syntheise : function(strPropName){
     if (this[strPropName] !== undefined) {
         //// write when needed :P  
     }
 },
 // return bool
 preformMethod: function (methodName) { // use :
     // myobj.preformMethod("move", 54);
     var args = Array.prototype.slice.call(arguments, 1);
     if ((args.length === 1) && (ant.util.isArray(args[0]))){
     	args = args[0];
     }
     if (this.hasMethod(methodName)) {
         ret = this[methodName].apply(this, args);
         return ret;

     } else {

         if (this.delegate && this.delegate.hasMethod(methodName)) {
             ret = this.delegate.preformMethod[methodName].apply(this, args);
             return ret;
         }
     }

    // console.warn("can't preform , method Does NOT exist ! ==>  mehthodName:" + methodName);
     return undefined;

 },
 
 
 preformMethodStrict: function (methodName) { // do the same thing as preformMethod, but if the method do not Exist,  send a warnning 
     // myobj.preformMethod("move", 54);
     var args = Array.prototype.slice.call(arguments, 1);
     if (this.hasMethod(methodName)) {
         ret = this[methodName].apply(this, args);
         return ret;

     } else {

         if (this.delegate && this.delegate.hasMethod(methodName)) {
             ret = this.delegate.preformMethod[methodName].apply(this, args);
             return ret;
         }
     }

     console.warn("can't preform , method Does NOT exist ! ==>  mehthodName:" + methodName);
     return undefined;

 },
 
 waitFor : function(flagNameString , fn , timeOut, interval){
     var waitId =  new Date();
     var flag = this[flagNameString];
     var that = this ;
     var timeOut = timeOut || 10 * 1000;
     var interval = interval || 200;
     
     var fnThis = arguments.callee;
     var context = this ;
     var args =  Array.prototype.slice.call(arguments,0);
     
     if (flag){ 
     	fn.call(context);
     	return  1 ;
     }
     else{
     	window.setTimeout(function(){
     		fnThis.apply(context , args);
     	},interval);
     	
     }
 }
 // use for deleaget method call , avoid unclear delegate contexts
});
//below for basic exception handle
ant.Exception = ant.ANObject.extend({
	init : function(msg, origin){
		this.msg = msg ;
		this.source = origin || "ant_Class";
	}
});



ant.List = ant.ANObject.extend({
	init : function(elementClass,allowDup){
		this._super();
	    this.items = [];
	    this.elementClass = elementClass || null; //for none elementClass , the checkType always return true
	    this.allowDup = allowDup||false;//can List store a element twice in same List ? TODO 
	    
	},
	clone : function(deep){
		var newList = new this(this.elementClass, this.allwDup);
		if (deep){
			for (var i= 0 ; i< this.getLength() ; i ++){
				if (ant.util.isFunction(this.items[i].clone)){
					newList.items[i] = this.items[i].clone(deep);
				}
				    newList.items[i] = this.items[i];
			}
		}
	},
	getLength : function(){
		return this.items.length ;
	},
	
	checkType : function(element, triggerException){
		if (this.elementClass === null){//for none elementClass , the checkType always return true
			return true ;
		}
		var ret = element instanceof this.elementClass ;
		if (triggerException && !(ret)){
			throw new ant.List.Exception("can't add element to List , because element's type is incompatible with the List!");
			
		}
		return  ret;
	},
	
	addAtPosition : function(element, pos){
		if (!this.checkType(element,true)){//when type error , use true for throw exception 
			return -1;
		}
		if ((this.find(element)>-1) && !this.allowDup){
			throw new ant.List.Exception("find elem in List, and this List is not allow duplicate");
			return -1;
			
		}
		if(pos <= 0){//insert at first
			this.items.splice(0,0,element);
			return  0 ;
		}
		
		if (pos >= this.getLength()){//insert last
			this.items.push(element);
			return this.getLength()-1;
		}
		
		if(pos < this.getLength() && pos > 0 ){
			this.items.splice(pos,0 , element);
			return pos;
		}
		
		throw new ant.List.Exception("position parameter error");
		return -1 ;
		
	},
	
	add : function(elem){
		return this.addAtPosition(elem,this.getLength());
	},
	find : function(elem){
		if (Array.prototype.indexOf) {
			return this.items.indexOf(elem);
		}
		
		var len = this.getLength();
	    for (var i= 0 ; i< len ; i++){
	    	if (this.items[i]==elem){
	    		return i ;
	    	}
	    }
	    return -1 ;
	},
	
	remove : function(elem){
		if(!this.checkType(elem)){
			return  -1;
		}
		var found = this.find(elem);
		if(found>=0){
			var item = this.items[found];
			this.items.splice(found,1);
		}
		return item;
		
	},
	
	pop : function(){
		if (Array.prototype.pop){
			return this.items.pop();
		}else {
			var len = this.getLength();
			return this.remove(this.items[len-1]);
			
		}
		
	}
});
	
	
	
ant.List.Exception = ant.Exception.extend({
	init : function(msg,origin){
		this._super(msg,origin);
		this.source =origin|| "ant.List_class";
	}
});

ant.ui ={};

//track screen size .
ant.ui.screen = {};
ant.util.event.createEvent(ant.ui.screen, 'resize');
ant.ui.screen.width = jQuery(window).width();
ant.ui.screen.height = jQuery(window).height();
ant.util.event.addEvent(window,'resize', function(){
	ant.ui.screen.width = jQuery(window).width();
	ant.ui.screen.height = jQuery(window).height();
	ant.util.event.dispatchEvent(ant.ui.screen, 'resize');
});

ant.ui.point = ant.Class.extend({
 init: function (x, y) {
     if (!(ant.util.isNumber(x) && ant.util.isNumber(y))) {
         throw (" ant.ui,point need 2 Number for init ");
     }
     this.x = x;
     this.y = y;
 },
 isEqual: function (pt) {
     return (this.x == pt.x && this.y == pt.y);
 }
});
ant.ui.size = ant.Class.extend({

 init: function (w, h) {
     if (!(ant.util.isNumber(w) && ant.util.isNumber(h))) {
         throw ("ant.ui.size need 2 Number for init");
     }
     this.width = w;
     this.height = h;
 },
 isEqual: function (sz) {
     return (this.width == sz.width && this.height == sz.height);
 }
});
ant.ui.rect = ant.Class.extend({

  
 init: function (left, top, right, bottom) {
     this.left = 0 ;
     this.top = 0;
     this.right = 0 ;
     this.bottom = 0 ;
     
     var isNum = ant.util.isNumber;
     if (!(isNum(left) && isNUm(right) && isNumb(top) && isNum(bottom))) {
         throw ("ant.ui.rect neec 4 Number for init");
     }
     this.left = left;
     this.right = right;
     this.top = top;
     this.bottom = bottom;
 },
 createFromPointAndSize: function (pt, size) {
     if (!(pt instanceof ant.ui.point && size instanceof ant.ui.size)) {
         throw ("createFromPointAndSize need ant.ui.point and ant.ui.size for param");
     }
     var left = pt.x;
     var top = pt.y;
     var right = pt.x + size.width;
     var bottom = pt.y + size.height;
     return new ant.ui.rect(left, top, right, bottom);
 },
 createFromPointAndPoint: function(pt1, pt2) {
     if (!(pt1 instanceof ant.ui.point && pt2 instanceof ant.ui.point)) {
         throw ("createFromPointAndPoint need 2 ant.ui.point for param");
     }
     var left = Math.min(pt1.x, pt2.x);
     var right = Math.max(pt1.x, pt2.x);
     var top = Math.min(pt1.y, pt2.y);
     var bottom = Math.max(pt1.y, pt2.y);
     return new ant.ui.rect(left, top, right, bottom);
 },
 createFromElement: function (ele) {
     if (!(ele && ele.nodeType)) {
         return null;
     } else {
         var style = window.getComputedStyle(ele);
         var left = ant.util.css.pageX(ele);
         var top = ant.util.css.pageY(ele);
         var height = ant.util.css.fullHeight(ele);
         var width = ant.util.css.fullWidth(ele);
         return new ant.ui.rect(left, top, left + width, top + height);
     }
 },
 makeDivElement: function () {
     var ele = document.createElement('div');
     ele.style.left = this.left + "px";
     ele.style.top = this.top + "px";
     ele.style.width = (this.right - this.left) + "px";
     ele.style.height = (this.bottom = this.top) + "px";
     return ele;
 },
 isPointIn: function (pt) {
     if (!(pt instanceof ant.ui.point)) {
         throw "isPointIn need a ant.ui.point for paramater";
     }
     return (pt.x >= this.left && pt.x <= this.right) && (pt.y >= this.top && pt.y <= this.bottom);
 },
 GetIntersectRect: function (rc) {
     if (!(rc instanceof ant.ui.rect)) {
         throw ("intersect neect a ant.ui.rect for paramter");
     }

     function lineIntersect(x1, x2, x3, x4) { // x1, x2 for line 1 , x3, x4 for line 2

         function isBetween(a, b, c) { // a for the value to be jugded , b ,  c together define the range.
             return (a <= c && a >= b) || (a <= b && a >= c);
         }
         return isBetween(x3, x1, x2) || isBetween(x4, x1, x2);
     }

     function GetLineOverlap(x1, x2, x3, x4) { // x1, x2 for line 1 , x3, x4 for line 2
         var line = {
             start: 0,
             end: 0
         };
         if (!lineIntersect(x1, x2, x3, x4)) return null;
         var vt = [].slice.call(arguments); // vt for votex
         var max = Math.max.apply(Math, vt);
         var min = Math.min.apply(Math, vt);
         vt.forEach(function (ele, index) {
             if ((ele == max) || (ele == min)) {
                 this.splice(index, 0);
             }
         }, vt);
         line.start = Math.max.apply(Math, vt);
         line.end = Math.min.apply(Math, vt);
         return line;
     }
     console.log("not implement !!");
     return false; // not implemented !!! .
 }
});


/*

	ant.resource : 
		init : accept a resourceDic , sample 
			   {
			   	script : ['a.js', '/js/b.js',], 
			   	css : ['a.css','/css/b.css',],
			   	html: ['/viewer/viewer.html'],
			   }
			   note : the script can not accept cross domain request 
			          the html should contain info for UIView's load method to get the LAYER object, this is important!!
		beginLoad : NOT provoked by init, this means the load resource MUST be invoked by your customer code 
					, in the case of UIView , a method getResource is a blank , override it ,in the child class of the UIview
					  and implement it, your MUST setup your resource in this func, but the beginLoad is not invoked,
					  there is TWO way it's fired  
					  1. you manully invoke your UIView's beginLoad method 
					  2. you invoke show() method of your View's method , 
					     it will check the loaded flag , if not loaded yet, 
					     then it will invoke the View's own beginLoad() which inturn invoke resource's beginLoad()
		checkLoad :  invoked in beginLoad()
					 it will constantly invoke it self until 1, loadFailed , 2. load , 3. timeOVer 
					 if load is failed or timeOver , it simply return 
					 								 it will NOT dispatch 'loadFail' Event, the task is NOW taken by loadResource method
					 								 this could cause some trouble,!!!, 
					 								  
					 if load is success , it will dispatch 'load' event 
					 the time over's default value is 10s , NOT YET add the set default timeover method 
		loadResource : for image , create a dom img object ,assign the src , monitor the load or error event , set the resourceFlag
		               for script , load it via ajax as response text , runit on GLOBAL env, 
		               												  , it is GLOBAL mean it is not much of use .
		               for css , load via ajax as response text , then  add it to document as a style sheet 
		               for html , this is little complicate : 
		               				1.load the html via ajax as response text 
		               				2. FOR NOW use jquery 's $() method turn it to a Jquery object, 
		               				   in the current UIView version this object will be appendto document.body and inturn assign to 
		               				   view.layer , this is not going to last too long !!!
		               				3. the object will be stored into the Resource[html][i] to replace the origin address !!
		               					this is ugly .
	  generateLoadFlag: according the resouceDic , this func will generate a dic with false flag to each of resource , 
	  					when specific resource is load , crossponding flag  will be set to true,
	  					the checkLoad() will check the flags constantly until it's all true , then dispatch 'load' event.  
	
					 
					  
			     
* */

ant.resource = ant.ANObject.extend(
{
	init: function(resourceDic, fnload) {
		this._super();
		this.retryCount = 5 ; // not used now ; 
		this.timeOut =10000;  // 10s
		this.timeOver = false; 
		this.loadFailed = false;
		this.checkLoadTimer = 0 ; // for function checkLoad
		this.createEvent('loadFail');
		this.createEvent('load');
		if( fnload && ant.util.isFunction(fnload)) {
			this.addEvent('load',fnload);
		}
		this.addEvent('loadFail',function(){
			this.loadFailed = true;
		});
		this.resourceDic = resourceDic;
		this.loadFlagDic = this.generateLoadFlag();
	},
	beginLoad : function() {
		var that = this;
		window.setTimeout(function(){
			that.timeOver = true;
		},this.timeOut);
		this.loadResource();
		this.checkLoad();
	},
	checkLoad : function() {
		//console.log('checking');
		var that = this;
		if (this.loadFailed ){
		
			return ;
		}
		if (this.timeOver){
			this.dispatchEvent('loadFail',{reason:'timeOver'});
			return ;
		}
		for (key in this.loadFlagDic) {
			for (var i = 0 ; i< this.loadFlagDic[key].length ; i++) {
				if (!this.loadFlagDic[key][i]) {
					this.checkerTimer = window.setTimeout( function() {
						that.checkLoad();
					}, 250);
					return ;

				}

			}
		}

		this.dispatchEvent('load');

	},
	generateLoadFlag : function() {
		var ret = {};
		for (var key in this.resourceDic) {
			ret[key] = [];
			for( var i = 0 , len = this.resourceDic[key].length ;  i< len ; i ++ ) {
				ret[key][i] = false ;
			}
		}
		return ret;
	},
	loadResource : function() {
		var that = this;
		for (key in this.resourceDic) {
			if (key == 'image') {
				for (var i= 0 , len = that.resourceDic[key].length ; i<len ; i++) {
					var img = document.createElement('img');

					img.src = that.resourceDic[key][i];

					(function(that, i , img , key) {
						img.addEventListener('load', function() {
							that.loadFlagDic[key][i] = true ;
						},false);
						img.addEventListener('error',function(){
							that.dispatchEvent('loadFail',{reason:'image error',src : img.src});
						},false);
					})(this, i , img , key );
				}
				continue ;
			}
		    /*	
			if(key == 'css'){
				for (var i= 0 , len = that.resourceDic[key].length ; i< len ; i++){
					var styleSheet;
					if (document.createStyleSheet)
					{
						styleSheet = document.createStyleSheet(that.resouceDic[key][i]);
					}
					else
					{
						styleSheet =jQuery("head")
					       .append('<link rel="stylesheet" type="text/css" href="'+ that.resourceDic[key][i] + '" />'); 
					}
				   (function(that, i , cssSheet, key){
					    jQuery(cssSheet).load(function(){
					    	that.loadFlagDic[key][i] = true;
					    });
					   
				   })(this, i , styleSheet, key);

				}
				
			}*/

			for(var i= 0 , len = this.resourceDic[key].length ; i< len ; i++) {
				//console.log(key);
				(function(key, i, that) {
					var cssurl =that.resourceDic[key][i];
					var req = {
						type : "GET",
						url : that.resourceDic[key][i],
						onerror : function (){
							that.dispatchEvent('loadFail',{reason:'ajax error', url: that.resourceDic[key][i]});
						},
						load : function(data) {
							//console.log(data);
							switch(key) {//
							     // TODO , for resource , ther is 2 kind : 
							    // 1, need duplicate 
							    // 2, do not need duplicate(like css , and some script maybe)
							    // need to set up a machanism to solve it , 
								case 'script':// should not be global eval , 
									          //
								    (1,eval)(data);
								    // TODO : now script is evaled when dulicated ,need adjust
									break;
									
								case 'css' :
									ant.util.dom.addCssByStr(data, cssurl);
									//TODO : now css is added when duplicated , need adjust 
									//
									break;

								case 'html' :
									that.resourceDic['html'][i] = jQuery(data).get() ;//checkEle return array !!;
									break;

							}
							that.loadFlagDic[key][i] = true;

						}
					};
					//console.log(req);
					//ant.ajax.Manager.add(req);
					
					jQuery.ajax({
						url : req.url,
						success: req.load,
						cache : true
					});
				})(key ,i, this);
			}
		}
	}
}
);

ant.ui.transitionSupport = (function(){
	// implement transition support test here 
})();
ant.ui.transition = ant.ANObject.extend({
		init: function(options){
			
			this.startProperties =options[startProperties] || null;
			this.endProperties = options[endProperties] || null ;
		},
		runOnLayer : function(DomLayer,callback){
						
		}
		
			
		
	});

//preload : 
//if preload is true , then view will beginLoad  inside init, otherwise it will wait until the show() is called .
//maybe for a image like object the method is differ .
// important notice 
// the view default Events 
// 1. load : all resource for view is loaded ,but the layer maybe not ready, 
// 2. loadFail : load resource failed . 
// 3. layerReady : the view's dom layer is ready for use 

// 



ant.ui.UIView = ant.ANObject.extend({
 

 init: function (options) {
     this._super();
     this.options = options || {};
     this.container = this.options.container || document.body;
     var that = this ;
     this.loaded = false;
     this.loadFailed = false;
     this.layerReady = false;
     
     this.createEvent('loadFail');
     this.createEvent('load');
     
     //init load and loadFail events
     this.addEvent('load',function(){this.loaded=true;});
     this.addEvent('load',function(){this.load();}); // you should overload  load funciton to customize your view.
     this.addEvent('loadFail', function(){this.loadFailed = true;});
     //this.addEvent('layerReady', function(){this.layerReady = true;});
     //init resource and connect resource's load , loadFail to view.

     
     //this.delegate = null;  // 
     this.visible = false ;
     this.layer = null;
     this.domLayer = null;
     this.bound = null;
     this.anchor = null;
     this.frame = null;
     this.responseTouch = false; // if this is true , mousedown mouseup mousemove touchstart touchmove touchEnd should be handled
     this.interactionEnabled = false; // no use 
     this.subViews = [];
     this.superView = null;
     this.transform = null; // for transition enabled browsers
     this.index =  1 ; // for layer's z-index;
 	
 	
 	this.screen = ant.ui.screen;
 	this.createEvent('screenResize');
    
     ant.util.event.addEvent(ant.ui.screen,'resize', function(){
     	that.dispatchEvent('screenResize',ant.ui.screen);
     });
     
     this.addEvent('screenResize', function(){
     		this.screenResize();
     });
     
     
     
     this.resource = this.getResource() ;  
     
     if(this.resource){
     	this.resource.addEvent('load', function(){that.dispatchEvent('load');});
     	this.resource.addEvent('loadFail',function(){that.dispatchEvent('loadFail');});
         // load resource imediatly . when option.preLoad = true;
        if (this.options.preLoad){
        	this.beginLoad();
        }
        
     }else{
     	this.dispatchEvent('load');
     }
     
 },
 
 
	getResource : function(){
		//console.log('not Implemented yet : getResource');
		return null; // overload this ,by your own resource factory
	},
	
	pageX : function(){
		if (this.domLayer===null) {return null;}
		return ant.util.css.pageX(this.domLayer);
	},
	
	pageY : function(){
		if (this.domLayer===null) {return null;}
		return ant.util.css.pageY(this.domLayer);
	},
	
	screenResize : function(){},
	load : function(){},
	getLayer : function(){
		if(!this.layerReady){

			this.addEvent('layerReady', function(){
				this.switchLayer(this.loadingLayer, this.layer);
			});

            return this.getLoadingLayer();
		}
		
	},
	switchLayer : function(origin, newLayer){
        console.log('switching layer!');
		var parent = origin.parentNode;
        if(!parent) return;

		var next = origin.nextSibling;

		jQuery(origin).stop().animate({opacity: 0}, 2000, function(){
			jQuery(origin).remove();
			if(next){
				jQuery(newLayer).stop().css({opacity:0}).insertBefore(next).animate({opacity: 1}, 500);
				return;
			}else{
				jQuery(newLayer).stop().css({opacity:0}).appendTo(parent).animate({opacity: 1}, 500);
			}
		});
	
	},
	getLoadingLayer: function(){
		if (!this.loadingLayer){
			var loading = '<div class="loading_layer">loading......</div>';
			this.loadingLayer = jQuery(loading)[0];
		}
		
		return this.loadingLayer;
	},
	show : function(){
		/*   for show is must run AFTER the view is loaded , 
		 *   so if view is not loaded ,load it , 
		 *   then wait for the load event ,then invoke the realShow method , 
		 *   the realShow method may have paramaters , 
		 *   here if there only NONE ARRAY paramater , i can handle, 
		 *   see detail in ANUTILIY.js, ANOBJECT's preformMethod's implemention
		 
		var args = Array.prototype.slice.call(arguments, 0);
		
		if (!!!this.loaded) {
			this.addEvent('load',function(){
				this.preformMethod('realShow', args);
			});
			this.beginLoad();
			return;
		}
		
		if (!this.layer){
			return ;
		}
		
		this.preformMethod('realShow',args);
		this.visible = true;
		* */

		jQuery(this.getLayer()).appendTo(this.container);
		// 
	},
		
	hide : function(){
		var args = Array.prototype.slice.call(arguments, 0);
		if (!!!this.loaded) {
			return ;
		}
		if (!this.layer){
			return ;
		}
		this.preformMethod('realHide');
		this.visible = false;
	},
	/**
	 * 
	
	realShow : function(){
		//only work 
		//can be override by client
		jQuery(this.layer).show(200);
	},
	realHide : function(){
		jQuery(this.layer).hide(200);
	},
	 */
	beginLoad : function(){
		if(this.resource){
		   this.resource.beginLoad();
		}else{
			this.dispatchEvent('load');
		}
	},
 
 getPositionInSubviews : function(subView){
     if (subView.superView == this){
       
       return subView.index; // WRONG !!!!!
     }
     else {
        console.warn("getPositionInSubviews : the subView param is not belong to ME ");
     }
     
 },
 // core fun to add SubView 
 addSubviewAtIndex: function (subTobeAdd, index) {
     var len = this.subViews.length ;
     if (index < 0 || index > len){
         console.warn(" addSubviewAtIndex : index para out boundary");
         return -1;
     }
     this.subViews.splice(index, 0 ,subTobeAdd);
     subTobeAdd.superView = this ;
     for (var i = index ; i< len ; i++ ){
         this.subViews.index = i ; // save for later get subviwe use . 
     }
     subTobeAdd.addedToSuperView();
     // Not using event here , use ViewController ;
    //  this.dispatchEvent("SubViewsChange");       
 },
 // core fun to add subView end 
 
 bindLayer : function(DOMLayer){
     this.layer = DOMLayer;
     
     
 },
 
 
 
 addSubview: function (subTobeAdd) {
    this.addSubviewAtIndex(subTobeAdd , this.subViews.length);
     
 },
  
 addSubviewBeforeSubview: function (subTobeAdd, subAfter) {
     
     var index = subAfter.index;
     this.addSubviewAtIndex(subTobeAdd, index);
     
 },
 
 addSubviewAfterSubview: function (subTobeAdd, subBefore) {
     var index = subBefore.index +1 ;
     this.addSubviewAtIndex(subTobeAdd , index);
 },
 
 /// core fun for remove subview 
 removeSubviewAtIndex: function (index) {
     var len = this.subViews.length;
     if (index < 0 || index > length){
         console.warn("removeSubviewAtIndex : can not find subView to remove");
         return undefined;
     }
     
     this.subViewWillBeRemoved(this.subViews[index]);
     this.subViews[index].index = -1 ;
     this.subViews[index].superView = null;
     this.subViews[index].removedFromSuperView();
     this.subViews.splice(index,1);
     this.subViewDidRemoved(this.subViews[index]);
 },
 // core fun for remove subview end 
 
 removeSubview: function (subTobeRemoved){
     
     this.removeSubviewAtIndex(!!subTobeRemoved.index || subTobeRemoved.index === 0 ? subTobeRemoved.index : -1);
 },
 removeSubviewBeforeSubview: function (subAfter) {
     var index = subAfter.index + 1 ;
     this.removeSubviewAtIndex(index); 
 },
 removeSubviewAfterSubview: function (subBefore) {
     var index = subBefore.index -1 ;
     this.removeSubviewAtIndex(index);
 },

 addedToSuperView : function(){ // 
 
 },
 removedFromSuperView : function(){},
 
 subViewWillBeAdded: function (subTobeAdd) {},
 subViewWillBeRemoved: function (subTobeRemove) {},
 subViewDidAdded: function (subAdded) {},
 subViewDidRemoved: function (subRemoved) {},

 exchangeSubViewAtIndex: function (index1, index2) {
     var temp = this.subViews[index1];
     this.subViews[index1] = this.subViews[index2];
     this.subViews[index1].index = index1 ;
     this.subViews[index2] = temp;
     this.subViews[index2].index = index2 ;
 },


 hookDelegate: function (delegatOb) {

 },

 isDecendentOfView : function(superV){
    var veiw = this.superView;
     while(view &&  view  instanceof UIView ) {  // need fix from  the instanceof UIView , to ant.ui.uiView
         if (view = superV){
             return true;
         }
         view = view.superView;
     }
     
     return false;
     
 },
 getWidth : function(){
 	if (!this.domLayer){
 		return;
 	}
 	return ant.util.css.getWidth(this.domLayer,'width');
 },
 
 getHeight : function(){
 	if (!this.domLayer){
 		return;
 	}
 	return ant.util.css.getWidth(this.domLayer,'height');
 },
 
 getZindex : function(){
 	if (!this.domLayer){
 		return;
 	}
 	return ant.util.css.getWidth(this.domLayer,'zIndex');
 	
 }
});


ant.ui.viewDecorator = ant.ANObject.extend({
	init : function (){},
	decorate : function(view){}
});


ant.ui.mouseRespondDecorator = ant.ui.viewDecorator.extend({
	init : function(mouseFunctions){//
		// mouse functions sample
		/*
			{
				mousedown : function(){},
				mousemove : function(){},
				mouseup : function(){},
				mousein : function(){},
				mouseout : function(){},
				
			}
		* */
		this.mouseFunctions = mouseFunctions;
	},	
	decorate : function(view){
		var originFn = view.load;
		var that = this;
		view.load = function(){// all injection will run AFTER the view is loaded !!!
			var ret = originFn.call(view);
			var domLayer = view.domLayer ;
			
			if (!domLayer){
				throw Error('can\'t decorate a view without dom Layer !!!');
				return null ;
			}
			var mouseEvents = ['mousedown','mouseup', 'mousemove', 'mouseover', 'mouseout', 'click' ,'dblclick'];
			
			function bindEvent(target, eventName){ // only use for View target !
				target.createEvent(eventName);
				target.addEvent(eventName,function(e){
					target.preformMethod(eventName,e);
				});
				ant.util.event.addEvent(target.domLayer,eventName,function(e){
					target.dispatchEvent(eventName,e);
				});
			}
			
			if(!view.RespondMouse) {
				for (var i= 0 ; i< mouseEvents.length ; i++){
					bindEvent(view,mouseEvents[i]);
				}
				view.ResponseMouse = true ;			
			}

			for (var eventName in that.mouseFunctions){// beware the loop , use closure . 
				(function(eventName,that){
				ant.util.event.addEvent(domLayer,eventName, function(e){
					that.mouseFunctions[eventName].call(this,e);
				});
				})(eventName, that);
				
			}
		};
		return view ;
	}
});





//test code  ------------------ start here 
var UIDelegate = ant.ANObject.extend({
 init: function () {
     
     this.events = {}; // events like the following , {"onclick" : hook = function(){} }
     // event delegate only responsible for hook the event to the view , and not responseble for handle it , when it recive the event, it may repack the event , and simplly
     // dispatch it the handler mostly in viewContrllor and View it self .
 }

});
					
var UIViewController = ant.ANObject.extend({ // controller response for view layout , views interaction in subviews of the root view( this.view is root view .)
 // handle view change transition ? or .....that.mouseFunctions[eventName]
 // hanle  viewLoad, resource ready , intOver??
 init: function () {
     this.view = null;
     this.dataSource = null; // these will be set in a SubClass , for particulia VIEW and DATA Source

 },
 createView : function(viewClass, isPreLoad){ // see UIView's init func for means of isPreLoad
     this.view = new viewClass(isPreLoad);
     
 },
 loadView: function () {},
 preLoadView: function() {},
 
 
 displayView : function(){},
 converPointToView: function (ponit, toView) {},

 

 layoutSubviews: function () {},
 drawView: function () {}


});


ant.ui.image = ant.ANObject.extend({
	init : function(src){
		var that = this ;
		this.createEvent('load');
		this.addEvent('load',function(e){
			this.preformMethod('load', e);
		});
		
		this.createEvent('error');
		this.addEvent('error',function(e){
			this.preformMethod('error',e);
		});
		this.domImg = null ;
		this.width = 0;
		this.height = 0 ;
		this.loaded = false ;
		if(ant.util.isString(src)){
			this.src = src ;
		}
		this.src = null;
	},
	beginLoad : function(){
		if (!this.src) {
			throw Error('can\'t load , no src ! ');
			return ;
		}
		var that = this; 
		var img = document.createElement('image');
		
		ant.util.event.addEvent(img,'load',function(e){
			 that.dispatchEvent('load',e);
		});		
		ant.util.event.addEvent(img,'error', function(e){
			that.dispatchEvent('error',e);
		});		
		this.domImg = img;
		img.src = this.src ;
		
		
	},
	
	load : function(e){
		this.width = this.domImg.naturaWidth || this.domImg.width;
		this.height= this.domImg.naturaHeight || this.domImg.height;
		this.loaded = true ;
		
	},
	
	freeImage : function(){
		if (this.domImage){
			this.domImage = null;
			this.loaded = false; 
		}
	},
	error: function(e){
		
		console.log('image load error , src : ' + this.src);
	}
});

/// think about it ......
ant.ui.page  = ant.ANObject.extend({//page and pageList below is DATA/MODEL NOT VIEW !!!
	                                 // it is a service to VIEW module
	                                // for conventional MVC there is none such thing !! 
	                                // add a middle layer of these for quick change 
	init : function(pageDom){
		this._super();
		this.pageDom = pageDom;
		
	},
	getPageDom : function(){
		return this.pageDom;
	}
});
ant.ui.pageList = ant.List.extend({
	init : function(){
		this._super(ant.ui.page);
		
	
	},

	getPageCount : function(){
		return this.getLength();
	},
	
	getPageByPageNumber : function(){
		
	}
	
	
});


ant.ui.helper = {//not much of use .......
	shinning : function(dom, maxSpan){
   
     	var thisFn = arguments.callee;
     	var maxSpan = maxSpan || 2000;
     	var span = Math.random() * maxSpan;
			var delayTime = span / 100;
			var currentOpacity = parseInt(jQuery(dom).css('opacity'));
			var destOpacity = currentOpacity ? 0 : 1 ;
     	 jQuery(dom).delay(delayTime).animate({'opacity': destOpacity},span , function(){
     		 ant.ui.helper.shinning(this);
     		 
     	 });
     }
		
};