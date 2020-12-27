---
title: 'this.$emit()方法 Vue子组件向父组件传值'
date: 2020-08-14
sidebar: false
isShowComment: true
isFull: true
tags:
- 'Vue'
categories:
- 'Front-end'
---

## 子组件使用this.$emit()向父组件传值

### 在父组件中引入子组件

```html
<indexOrder ref="indexImportOrder" @closeMain="closeMain"/>

import indexOrder from './components/indexOrder'

components:{
        indexOrder
      }
```

### 子组件向父组件传值

1.使用this.$emit("function",param)
  其中function为父组件定义函数，param为需要传递参数

```js
viewBusiness(){
  let flag = false;
  this.$emit('closeMain',flag);
},
```

2.在父组件中子组件引用处添加函数@:function="function"
  其中function为子组件中定义函数

```html
<indexOrder ref="indexOrder" v-on:closeMain="closeMain"/>

<indexOrder ref="indexOrder" @closeMain="closeMain"/>
```

3.val及为子组件中flag，即接收的子组件参数

```js
closeMain(val){
  this.flag = val;
}
```



