function Compiler(el,vm){
     this.el=el
     this.vm=vm
     this.frag=null
     this.methods=vm.methods
     this.init()
}
Compiler.prototype={
	init:function(){

        if(this.el){
            this.nodeToFragment(this.el)
            this.compile(this.frag)
            this.el.appendChild(this.frag)
        }else{
        	console.log("你无有效的dom可编译")
        }
	},
	nodeToFragment:function(el){
         // console.log(el)
         var nodeFragment=document.createDocumentFragment()
         var child=el.firstChild
       
         while(child){
             nodeFragment.appendChild(child)
             child=el.firstChild

         }
         this.frag=nodeFragment
         // console.log(this.frag)
	},

	compile:function(node){
           var childnodes=node.childNodes
           var nodeArrs=[].slice.call(childnodes)       
           nodeArrs.forEach((node)=>{
         	    // console.log(this)
         	    if(this.isElement(node)){
                     this.compileElement(node)
         	    }else if(this.isText(node)){
                     this.compileText(node)
         	    }
         	    if(node.childNodes&&node.childNodes.length>0){
         	    	this.compile(node)
         	    }
                // console.log(node,node.nodeType)
          })
	},
	isElement:function(node){
         return node.nodeType===1
	},
	isText:function(node){
		 return node.nodeType===3
	},
	compileElement:function(node){
	   var nodeAttrs=node.attributes
	   Array.prototype.slice.call(nodeAttrs).forEach(attr=>{
	     	// console.log(attr,attr.name,attr.value)
	        var attrName=attr.name
	        var exp=attr.value
	     	if(this.isDirect(attrName)){
                this.compileModel(attrName,exp,node)
	     	}else if(this.isEvent(attrName)){
	     		
                this.compileEvent(attrName,exp,node)    
	     	}
	     })
	   // console.log(node.attributes)
	},
	compileText:function(node){
          var reg=/\{\{(.*)\}\}/
          var text=node.textContent
          // console.log(reg.exec(text),text)
         if(reg.exec(text)){
          //获取实例中响应的字段值，并添加到观察者
          var exp=reg.exec(text)[1]
          var initText=this.vm[exp]
          this.updateText(node,initText)
          new Watch(this.vm,exp,(val)=>{
          	   node.textContent=val
          })
         }

	},
	updateText:function(node,text){
          node.textContent=typeof(text)=="undefined"?"":text
	},
	compileEvent:function(attr,val,node){
        var attrArr=attr.substring(2).split(":")
        var dir=attrArr[1]
        // 此处需要获取响应的字段。。
        console.log(val,this.methods)
        var cb=this.methods[val]
        node.addEventListener(dir,cb,false)
        node.removeAttribute(attr)
	},
	compileModel:function(attr,exp,node){
       // console.log(attr,exp,node)
       var value=this.vm[exp]
       this.updateMode(node,value)
       new Watch(this.vm,exp,(val)=>{
            this.updateMode(node,val)
       })
       node.addEventListener("input",(e)=>{
            var newValue=e.target.value
            console.log(newValue)
            if(value==newValue)return;
            this.vm[exp]=newValue
       },false)
	},
	updateMode:function(node,val){
      node.value=typeof(val)=="undefined"?"":val
	},
	isDirect:function(attr){
		return attr.indexOf("model")>=0
	},
	isEvent:function(attr){
		// console.log(attr.indexOf(":"))
	    return attr.indexOf(":")>=0
	}
}