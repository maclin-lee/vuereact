function Watch(vm,exp,cb){
    this.vm=vm
    // this.el=el
    this.cb=cb
    this.exp=exp
    this.value=this.initValue(exp)
}
Watch.prototype={
   initValue:function(exp){
        Dep.target=this
        var value=this.vm[exp]
        Dep.target=null
        return value
   },
   update:function(){
   	   this.run()
   },
   run:function(){
       var value=this.vm[this.exp]
       if(value!==this.value){
       	  this.value=value
       }
       this.cb.call(this,value)
   }
}