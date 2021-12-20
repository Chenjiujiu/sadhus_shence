/*
 *@Version  v5.0
 *@Author   苦行僧|2021/12/17
*/
~function () {
  class sadhus_shence{
    constructor(obj) {
      this.container=document.querySelector(obj.container);
      this.event=obj.event||'click';
      this.addFn=obj.customData||function (){return {}};
      this.customSession=obj.customSession||function (){return {}};
      this.type=obj.type||'';
      this.sendType=obj.sendType||obj.type;
      this.callback=obj.callback||function (){return false};
      this.debug=obj.debug||false;
      this.setSessionId=obj.setSessionId||'';
      this.getSessionId=obj.getSessionId||'';
      this.delSession=obj.delSession||false;
      this.scTypeName=obj.typeName||'sctype'
      this.scDataName=obj.dataName||'scdata'
      this.scEnableName=obj.enableName ||'scenable'
      this.scSessionName=obj.sessionName ||'scsession'
      this.bind();
    }
    target(ev){
      let targetEl=ev.target;
      while (targetEl!==this.container && (targetEl.dataset[this.scTypeName]!==this.type || !targetEl.dataset[this.scEnableName]) ){
        targetEl=targetEl.parentNode?targetEl.parentNode:'';
      }
      this.debug && console.info("匹配节点",targetEl);
      return targetEl===this.container?false:targetEl;
    }
    bind(){
      this.debug && console.info("绑定事件");
      if(this.event==="load"){
        this.debug && console.info("绑定事件",this.event);
        window.addEventListener('load',(ev)=>{
          this.debug && console.info("页面加载完毕");
          this.handle(this.container);
        })
      }else if(this.event==='sync'){
        this.debug && console.info("同步执行事件");
        this.handle(this.container);
      } else{
        this.debug && console.info("绑定事件",this.event);
        this.container.addEventListener(this.event,(ev)=>{
          this.debug&&ev.preventDefault();
          let el=this.target(ev);
          if(el){
            this.handle(el)
          }else{
            this.debug && console.info("本次点击不存在目标节点");
          }
        })
      }
    }
    getData(el) {
      let data = el.dataset[this.scDataName];
      if (data) {
        data=JSON.parse(data);
        this.debug && console.info("节点数据",data);
        if(data.original_price){
          data.original_price=Number((data.original_price/100).toFixed(2));
        }
        if(data.current_price){
          data.current_price=Number((data.current_price/100).toFixed(2));
        }
        if(data.result_number){
          data.result_number=Number(data.result_number);
        }
      } else {
        this.debug && console.warn("数据为空");
        data={}
        this.debug && console.info("节点数据",data);
      }
      data=this.addData(data,el);
      this.debug && console.info("合并数据",data);
      return data;
    }
    addData(data){
      let customData=this.addFn(this.container);
      this.debug && console.info("自定义追加数据",customData);
      Object.assign(data,customData)
      this.debug && console.info("追加数据");
      if(this.getSessionId && sessionStorage.getItem(this.getSessionId)){
        let sessionData=JSON.parse(sessionStorage.getItem(this.getSessionId));
        Object.assign(data,sessionData)
      }else if(this.getSessionId){
        this.debug && console.info("session为空，清空所有数据");
        return {}
      }
      return data;
    }
    handle(el){
      let data=this.getData(el)
      this.setSessionId&&this.setSession(el);
      this.debug && console.info("最终数据",data);
      if(Object.keys(data).length){
        this.sendData(data);
      }
      this.debug && console.info("启用回调");
      this.callback(el);
      this.debug && console.info("收尾处理");
      this.sendEnd(el);
    }
    sendEnd(el){
      this.debug && console.info("关闭上报");
      el.dataset[this.scEnableName]='';
      if(this.delSession){
        this.debug&&console.info("删除session")
        sessionStorage.removeItem(this.getSessionId);
      }
    }
    sendData(data){
      let sendType=this.sendType;
      let debug=this.debug;
      sensors.quick('isReady',function(){
        debug && console.info("准备",sendType,data);
        sensors.track(sendType,data);
        debug && console.info('上报完毕');
      })
    }
    setSession(el){
      let customSessionData=this.customSession(this.container);
      this.debug&&console.info("自定义追加session",customSessionData)
      let data=el.dataset[this.scSessionName];
      if(!data){data='{}'}
      data=JSON.parse(data);
      this.debug&&console.info("节点session",data)
      Object.assign(data,customSessionData)
      if(Object.keys(data).length){
        sessionStorage.setItem(this.setSessionId,JSON.stringify(data));
      }else{
        this.debug&&console.info("数据为空取消存储")
      }

      this.debug&&console.info("最终存储session",data)
    }
    updateFn(){
      let EnableName=this.scEnableName;
      let scDemoArr= this.container.document.querySelectorAll("[data-"+this.scTypeName+"="+this.type+"]");
      Array.from(scDemoArr).forEach(item=> item.dataset[EnableName]='1');
      this.debug&&console.info("重置可用性")
    }
  }
  window.sadhus_shence=sadhus_shence;
}()