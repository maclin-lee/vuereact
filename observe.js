function Observe(data){
	// var self=this
  // console.log(data) 
	this.data=data
	Object.keys(this.data).forEach(key=>{
        // console.log(this.data,key)
         this.defineReactive(data,key,data[key])
	})
}
Observe.prototype={
      defineReactive:function(data,key,val){
            // var self=this
            // console.log(this.data)
      	    var dep=new Dep()
      	    var childObject=observe(data[key])
            Object.defineProperty(data,key,{
            	   configurable:true,
                 enumerable:true,
                 set:function setter(newval){
                  // console.log(val)
                  if(newval==val)return;
                  val=newval
                  dep.notify()

                 },
                 get:function getter(){
                
                   // console.log(val,this)
                     if(Dep.target){
                     	dep.addSub(Dep.target)
                     }
                     return val
                 }
            })
      }
}
function observe(val){
    if(!val||typeof(val)!=="object"){
    	return;
    }
    return new Observe(val)
}
function Dep(){
	this.subs=[]
}
Dep.prototype={
	addSub:function(watch){
        this.subs.push(watch)
	},
	notify:function(){
        this.subs.forEach(function(watch){
           watch.update()
        })
	}
}
Dep.target=null