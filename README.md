#神策数据埋点函数声明
@Version  v4.0  
@Author   苦行僧|2021/12/17
##函数调用
```javascript
new sadhus_shence({
debug: true,                  /!* 布尔值，开启debug，会阻止默认事件，默认false *!/
container: "body",            /!* 字符串，查找元素的父容器选择器".","#"等 必填 *!/
type: "SearchResultClick",    /!* 字符串，元素匹配字段 data-sctype的值 *!/
sendType:"SearchResultClick", /!* 字符串，上报事件名称，默认为type值*!/
```
####设置session
```javascript
setSessionId:"sessionKey",    /!* 字符串，需要设置的session的id，值为data-scsession的值 *!/
```
####获取session
```javascript
getSessionId:"sessionKey",    /!* 字符串，需要获取的session的id数据 *!/
```
####额外添加数据
```javascript
customData function(container){return {}}  /!* 函数，需要额外添加的参数，函数需要返回一个对象 *!/
```
####额外添加存储session数据
```javascript
customSession: function(cantainer){return {}},  /!* 函数，需要额外添加的session数据，函数需要返回一个对象 *!/

```
####以下为扩展字段
```javascript
event:'click',                /!* 字符串，触发事件名，默认click *!/
delSession:false,              /!* 布尔值，是否需要清除getSessionId项 需配合getSessionId使用 默认调去后清除*!/
typeName: "sctype2",           /!* 字符串，标签标识自定义名，默认data-sctype *!/
dataName: "scdata2",           /!* 字符串，数据存储自定义属性名，默认data-scdata *!/
enableName: "scenable2",       /!* 字符串, 上报事件标志位，默认data-scenable *!/
sessionName: "scsession2",       /!* 字符串, 存储session数据标识，默认data-scssion *!/
callback:callback,            /!* 函数，结束后回调函数 一个参数为点击的节点el *!/

/!* 实例化对象有一个updateFn() 方法，可用于重置上报可用性 *!/
```
#dome节点属性挂载说明
```javascript
data-scenable='1'     //  是否允许上报 ''
data-sctype='search'  // 节点标识，可用于上报事件名
data-scdata='{"key":"value","key2":"value2"}' //需要上报的数据，json字符串
data-scsession='{"key":"value","key2","value2"}'// 需要存session的数据，
```
###以下为扩展字段
```javascript
data-自定义scenable (enableName)
data-自定义scctype (typeName)
data-自定义scdata (dataName)
data-自定义scsession(sessionName)
```
