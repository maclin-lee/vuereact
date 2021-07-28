function Vue(options){
	// let self=this
    this.data=options.data
    this.methods=options.methods
    // console.log(Object.keys(this.data))
    observe(this.data)
    Object.keys(this.data).forEach((key)=>{
           this.proxy(key)
    })
     console.log(this)
   
    new Compiler(options.el,this)
}
Vue.prototype.proxy=function(key){
        // console.log(this.data)
        Object.defineProperty(this,key,{
        	configurable:true,
        	enumerable:false,
        	set:function setter(val){
                 console.log(this)
                 this.data[key]=val
                 // return val              
        	},
        	get:function getter(){
                // return 1
                // console.log(this.data[key])
               return this.data[key]
        	}
        })
// console.log(this)
}