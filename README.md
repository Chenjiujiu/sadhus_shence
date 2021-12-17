#神策数据埋点函数声明
@Version  v5.0  
@Author   苦行僧|2021/12/17
##函数调用
1. 基本使用
```javascript
new sadhus_shence({
debug: true,                  /!* 布尔值，开启debug，会阻止默认事件，默认false *!/
container: "body",            /!* 字符串，父容器选择器".","#"等 必填 *!/
type: "SearchResultClick",    /!* 字符串，目标元素匹配字段字段,ata-sctype的值,默认使用此值做为事件名*!/
```
2. 深度使用  
   1. 事件  
      ```javascript
      event:'click', /!* 字符串，触发事件名，默认click *!/
      ```
   2. 事件上报名  
      ```javascript  
      sendType:"SearchResultClick", /!* 字符串，上报事件名称，缺省使用为type值 *!/
      ```
   3. 设置session  
      ```javascript  
      setSessionId:"sessionKey",    /!* 字符串，需要设置的session的id，值为data-scsession的值 *!/
      ```
   4. 获取session  
      ```javascript
      getSessionId:"sessionKey",    /!* 字符串，需要获取的session的id数据 *!/
      ```  
   5. 额外添加数据  
        ```javascript
        customData function(container){return {}}  /!* 函数，需要额外添加的参数，函数需要返回一个对象 *!/
        ```
   6. 额外添加session数据 
      ```javascript
      customSession: function(cantainer){return {}},  /!* 函数，需要额外添加的session数据，函数需要返回一个对象 *!/
      ```  
   7. 清除session  
      ```javascript
      delSession:false,  /!* 布尔值，是否需要清除getSessionId项 需配合getSessionId使用*!/
      ```
3. 扩展字段  
   1. 扩展字段，用于支持自定义data-属性的名
      ```javascript
      typeName: "sctype2",           /!* 字符串，标签标识自定义名，默认data-sctype *!/
      dataName: "scdata2",           /!* 字符串，数据存储自定义属性名，默认data-scdata *!/
      enableName: "scenable2",       /!* 字符串, 上报事件标志位，默认data-scenable *!/
      sessionName: "scsession2",       /!* 字符串, 存储session数据标识，默认data-scssion *!/
      ```  
   2. 回调函数  
      ```javascript
      callback:callback,/!* 函数，数据上报后回调函数 形参数为当前点击匹配节点 *!/
      ```  
   3. 更新函数  
      ```javascript
      updateFn(),   //实例化对象后，有updata函数用于更新所有匹配节点可用性
      ```
##节点挂载  
1. 节点基本属性  
   ```html
   <div class="container">
       <a
        data-scenable="1"   <!--上报可用性-->
        data-sctype="SearchResultClick"   <!--标签标识，默认用于上报事件名-->
        data-csdata='{"键":"值","键2":"值2","键3":"值3"}'  <!--上报数据的json字符串-->
        >这是需要匹配的标签</a>  
   </div>
   ```
2. 扩展属性  
   ```html
      <div class="container">
       <a
        data-自定义可用性="1"   <!--上报可用性，对应实例化的enableName -->
        data-自定义类型="SearchResultClick"   <!--标签标识，对应实例化的typeName-->
        data-自定义数据='{"键":"值","键2":"值2","键3":"值3"}'  <!--对应实例化的dataName-->
        data-自定义session='{"键":"值","键2":"值2","键3":"值3"}'  <!--对应实例化的sessionName-->
        >这是需要匹配2个时间事件的标签</a>  
   </div>
   ```
   
    

## 案例  
+ 基本挂载
   ```html
   <div class="search-bar">
      <button  type="submit"
         data-scenable="1"
         data-sctype="SearchRequest"
         data-scdata='{"result_number":"{{ search.results_count }}"}'
      >这是一个需要上报的标签</button>
   </div>
   ```
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"SearchRequest"
   })
   ```
+ 有数据不在标签属性上，需要额外增加数据
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"SearchRequest",
      customData: function(container){/*形参为当前容器dom */
         let newData={};
         let sel=container.querySelector("#search-product-type");
         newData.key_word= container.querySelector(".search-bar__input ").value;
         return newData  /*返回值必须为{}*/
      }
   })
   ```
+ 不需要提交数据，只需要存储数据
   ```html
   <div class="search-bar">
      <button  type="submit"
         data-scenable="1"
         data-sctype="searchjump"
         data-scsession='{"存储键":"值","存储键2":"值2"}'      
      >这是一个需要上报的标签</button>
   </div>
   ```
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"searchjump",
      setSessionId:"sensorsSearchRequesth"
      /*data值为空时，不会提交上报*/
   })
   ```
+ 需要额外存储session数据
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"searchjump",
      setSessionId:"sensorsSearchRequesth",
      customSession:function(container){
         let newData={};
         let sel=document.querySelector("#search-product-type");
         newData.key_word= document.querySelector(".search-bar__input ").value;
         newData.key_word_classification=sel.options[sel.selectedIndex].value;
         if(newData.key_word_classification===""){newData.key_word_classification="All categories"}
         return newData;
      }
   })
   ```
+ 需要获取session数据上报  
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"SearchRequest",
      getSessionId:"sensorsSearchRequesth"
   })
   ```
+ 页面加载时上报
   ```javascript
   new sadhus_shence({
			event:"load",
			container:".page__content .collection",
			type:"SearchRequest",
			getSessionId:"sensorsSearchRequesth",
			delSession:true /*获取上报完毕后删除session，避免重复提交，默认为false不删除*/
		})
   ```
+ 页面加载时上报,之后数据用于其它上报，进行session转存
   ```javascript
   new sadhus_shence({
			event:"load",
			container:".page__content .collection",
			type:"SearchRequest",
			getSessionId:"sensorsSearchRequesth",
      setSessionId: "sensorsSearchResultClick",
			delSession:true, /*获取上报完毕后删除session，避免重复提交，默认为false不删除*/
      customSession:function (container) {
        let newData={};
        newData=JSON.parse(sessionStorage.getItem('sensorsSearchRequesth'));
        /*获取sensorsSearchRequesth 转存入 sensorsSearchResultClick */
        return newData;
      }
   })
   ```
+ 单按钮有两个上报事件，使用自定义扩展
   ```html
   <div class="search-bar">
      <button  type="submit"
         data-scenable="1"
         data-sctype="SearchResultClick"
         data-scdata='{"result_number":"{{ search.results_count }}"}'
         data-scenable2='1'
         data-sctyp2="SearchRequest"
         data-scdata2='{"result_number":"{{ forloop.length }}"}'
      >这是一个需要上报2个不同事件的标签</button>
   </div>
   ```
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"SearchResultClick"  /*匹配默认属性值上报*/
   })   
   new sadhus_shence({
      container:".search-bar",
      type:"SearchRequest",
      enableName:"scenable2",
      typeName:"sctype2",
      dataName:"scdata2"  /*匹配自定义值属性上报*/
   })
   ```
+ 有两个上报，且上报事件名相同  
   ```html
   <div class="search-bar">
      <button  type="submit"
         data-scenable="1"
         data-sctype="type1"
         data-scdata='{"result_number":"{{ search.results_count }}"}'
         data-scenable2='1'
         data-sctyp2="type2"
         data-scdata2='{"result_number":"{{ forloop.length }}"}'
      >这是一个需要上报2个不同事件的标签</button>
   </div>
   ```
   ```javascript
   new sadhus_shence({
      container:".search-bar",
      type:"type1",  
      sendType:"SearchRequest"
   })   
   new sadhus_shence({
      container:".search-bar",
      type:"type2",  
      sendType:"SearchRequest",
      enableName:"scenable2",
      typeName:"sctype2",
      dataName:"scdata2"  /*匹配自定义值属性上报*/
   })
   ```
+ 上报一次后停止上报，输入框更新后，重新允许上报   
     ```html
   <div class="search-bar">
      <input type="text" class="username">
      <button  type="submit"
         data-scenable="1"
         data-sctype="SearchRequest"
         data-scdata='{"result_number":"{{ search.results_count }}"}'
      >这是一个需要上报的标签</button>
   </div>
   ```
   ```javascript
   let login=new sadhus_shence({
                container:".search-bar",
                type:"SearchRequest"
              })
   document.querySelector('.search-bar>input').addEventListener('change',login.updateFn)
   ```