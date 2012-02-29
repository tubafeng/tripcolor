// set Ant.debug = false to disable the unitTest 
if (window.ant.debug._DEBUG && window.ant.debug._DEBUG == true ){
	console.log('debug begin ----- ');
	var PublicANUtest = new ant.ANUtest();
//DO NOT remove the test Wrapper up !!
	
	

	//--ANUtestStart--
	//--TASK : 
	// ANObject : test for Syntheise function 

	{
	 // todo : test for unwritten syntheise mehtod .

	}

	//--ANUtest End --

	//--ANUtestStart--
	//--TASK : 
	// ANObject : hasMethod , ANObject : preformMethod 
	{
	    PublicANUtest.registerTestCase("test for ANobject. hasMethod", function () {
	        var ob = new ant.ANObject();
	        PublicANUtest.assert(ob.hasMethod("hasMethod") == true);
	        PublicANUtest.assert(ob.hasMethod("notSuchMethod") == false);
	    });


	    PublicANUtest.registerTestCase("test for ANObject.preformMethod", function () {
	        var ob = new ant.ANObject();
	        PublicANUtest.assert(ob.preformMethod("No Such Method", 33) === undefined);


	    });
	    
	    PublicANUtest.registerTestCase("test for ANObject.addEvent and dispatchEvent", function () {
	        var ob = new ant.ANObject();
	        ob.addEvent('aEvent',function(){
	        	this.EventTrigger='999';
	        	});
	        PublicANUtest.assert(ob.EventTrigger === undefined);
	        ob.dispatchEvent('aEvent');
	        PublicANUtest.assert(ob.EventTrigger === '999');
	       


	    });


	    PublicANUtest.registerTestCase("test for ANObject.preformMethod", function () {
	        var ob = new ant.ANObject();
	        PublicANUtest.assert(ob.preformMethod("hasMethod", "init") == true);
	        PublicANUtest.assert(ob.preformMethod("hasMethod", "noSuchMethod ") == false);
	        ob.newAdd = function (a, b) {
	            return a + b;
	        };
	        PublicANUtest.assert(ob.preformMethod("newAdd", 4, 5) == 9);

	    });

	}

// let's create a shortHand of PublicANUtest.registerTestCase 
	
	//var createTest = PublicANUtest.registerTestCase;
	
	var createTest = function (testName, fn, testType){
		 PublicANUtest.registerTestCase(testName, fn, testType);
	};
// now thing's get a little easier 
	
	
	{

		createTest('ant.list test , for List creation _ positive ', function(){
			var uAssert  = PublicANUtest.assert; 
			var myList = new ant.List();
			uAssert(myList instanceof ant.List);
		
			
		});
		createTest('ant.list test , for List creation _ nagtive ', function(){
			var uAssert  = PublicANUtest.assert; 
			var myList = new ant.List();
			uAssert((myList instanceof Array) == false);
		
			
		});
		
		createTest('ant.list test , for List creation _ typeof test ,  ', function(){
			var uAssert  = PublicANUtest.assert; 
			var myList = new ant.List();
			uAssert(typeof(myList) == "object");
		
			
		});
		createTest('ant.list test , for List creation with type _ positive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			
			var newObj = new newType();
			var myList = new ant.List(newType);
			uAssert( newObj instanceof myList.elementClass );
		
			
		});
		
		createTest('ant.list test , for List creation with type _ nagtive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			uAssert( otherObj instanceof myList.elementClass  === false );
		
			
		});
		
		
		createTest('ant.list test , for List creation with type add other type _ nagtive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			try {
			uAssert(myList.add(otherObj) === -1 );
			}
			catch(e){
				console.log(e.msg);
				uAssert(e instanceof ant.List.Exception);
			}
			
		});
		
		
		createTest('ant.list test , for List creation with type add other type _ positive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			try {
			
			uAssert(myList.add(newObj) === 0 );
			//console.log(myList);
			uAssert(myList.items[0] == newObj);
			}
			catch(e){
				console.log(e.msg);
				uAssert(e instanceof ant.List.Exception);
			}
			
		});
		
		
		createTest('ant.list test , for List creation with type add other type  _ check _ nagtive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			try {
			
			uAssert(myList.add(newObj) === 0 );
			//console.log(myList);
			uAssert(myList.items[0] !== otherObj);
			}
			catch(e){
				console.log(e.msg);
				uAssert(e instanceof ant.List.Exception);
			}
			
		});
		
		
		createTest('ant.list test , for List creation with type add 3 element   _ positive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var newObj2 = new newType();
			var newObj3 = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			
			
			uAssert(myList.add(newObj) === 0 );
			uAssert(myList.add(newObj2) === 1 );
			uAssert(myList.add(newObj3) === 2 );
			//console.log(myList);
			uAssert(myList.items[2] === newObj3);
			
			
			
			
		});
		
		createTest('ant.list test , for List remove with type add 3 element and remove second  _ positive  ,  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			var otherType = ant.ANObject.extend({});
			var otherObj = new otherType();
			var newObj = new newType();
			var newObj2 = new newType();
			var newObj3 = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			
			
			uAssert(myList.add(newObj) === 0 );
			uAssert(myList.add(newObj2) === 1 );
			uAssert(myList.add(newObj3) === 2 );
			//console.log(myList);
			uAssert(myList.items[2] === newObj3);
			uAssert(myList.getLength() == 3);
			uAssert(myList.remove(newObj2) === newObj2);
			uAssert(myList.getLength() ===2 );
			uAssert(myList.items[1] === newObj3);
		
		});
		
		

		createTest('ant.list test , for add duplicate element, positive  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			uAssert(myList.add(newObj) === 0 );
			
			try {
				uAssert(myList.add(newObj) === -1 );
				
			
			}
			catch(e){
				uAssert(e instanceof ant.List.Exception);
			}
			
		});
		
		createTest('ant.list test ,not duplicate disabled , for add duplicate element, nagtive  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			
			var newObj = new newType();
			var myList = new ant.List(newType);
			//console.log(otherObj instanceof myList.elementClass);
			myList.add(newObj);
			try{
				myList.add(newObj);
			}catch(e){
				uAssert(e instanceof ant.List.Exception)
			}
			
			uAssert(myList.items.length == 1 );
				
			
		});
		
		createTest('ant.list test ,not duplicate enabled , for add duplicate element,  positive  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			
			var newObj = new newType();
			var myList = new ant.List(newType, true);
			//console.log(otherObj instanceof myList.elementClass);
			myList.add(newObj);
			try{
				myList.add(newObj);
			}catch(e){
				uAssert(e instanceof ant.List.Exception)
			}
			
			uAssert(myList.items.length == 2 );
				
			
		});
		createTest('ant.list test ,not duplicate enabled , for 3 add duplicate element,  nagtive  ', function(){
			var uAssert  = PublicANUtest.assert;
			var newType = ant.ANObject.extend({});
			
			var newObj = new newType();
			var myList = new ant.List(newType, true);
			//console.log(otherObj instanceof myList.elementClass);
			myList.add(newObj);
			try{
				myList.add(newObj);
			}catch(e){
				uAssert(e instanceof ant.List.Exception)
			}
			
			myList.add(newObj);
			uAssert(myList.items.length !== 2 );
			uAssert(myList.items.length !== 1 );
			uAssert(myList.items.length === 3 );
				
			
		});
		
		
	
		
	}
	

	//__ANUtestEnd--



	//--ANUtestStart--
	//--TASK : 
	//ANObject : multi init function test 
	// an object can be initialized by more than one init** function 
	// see the analog in OBJ_C COCOA,, 
	// usage  , myobj.initWithFrame(myRect) .....

	//--ANUtestEnd-- 
	
	
	
	
	
	/// below is the test wrapper , DO NOT remove ;
	
}