
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



ant.collection = ant.ANObject.extend({
    init: function(options){
        this.modelClass = options.modelClass;

    },
    get : function(){},
    save: function(){},
    del: function(){}
});



var tripUser = ant.model.extend({
    attributes:{
        id: null,
        uname: null,
        email: null,
        displayName: null,
        sessionId:null,

    },

    //for userInfo :
    // {
    //   uname:
    // }
    init: function(userInfo){
        this._super();
        this.set(userInfo,{silent: true});
    },

    validate: function(){
          return true;
    },
    set : function(userInfo,options){
        this._set(userInfo, options)
    },

    validate: function(){
       return true;

    }

});


