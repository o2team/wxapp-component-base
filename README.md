# wxapp-component-base
京东微信小程序组件方案 - 组件基类

目前组件方案仍然处于探索阶段，欢迎共同探讨

主要分为三个文件 `base.js`、`page.js`、`component.js`

## base.js

页面类 和 组件类 都继承于该公共类，用于挂载公共方法

## page.js

页面基础类，替代原来 `Page()` 方法

```js
const JDPage = require('../../page.js');

new JDPage({
    data: {
        logs: []
    },
    onLoad: function() {
        // do something
    }
});

```

## component.js

组件基础类，用于创建一个组件

js
```js
const Component = require('../../../component.js');

class UserInfo extends Component {
    // 默认数据
    defaultData() {
        return {
            avatarUrl: '',
            nickName: 'aotu',
        };
    }

    constructor() {
        super(...arguments);

        // 组件页面需要绑定方法时，通过 addFunc() 暴露给页面。
        this.addFunc('_tapComponent', this.bindViewTap);
    }

    onLoad() {
        // do something
    }

    bindViewTap() {
        // do something
    }
}

module.exports = UserInfo;
```

wxml
```html
<template name="user-info">
    <!-- _tapComponent 是通过 addFunc 暴露出来的方法名 -->
    <view  bindtap="{{_tapComponent}}" class="userinfo">
        <image class="userinfo-avatar" src="{{avatarUrl}}" background-size="cover"></image>
        <text class="userinfo-nickname">{{nickName}}</text>
    </view>
</template>
```


## 引用组件

page.js
```js
const UserInfo = require('../components/userinfo/index.js');

new JDPage({
    components: {
        userInfo: UserInfo,
    },
    ...
});
```

page.wxml
```html
<import src="../path/to/component.wxml" />

<!-- data 属性传入对应组件的 key 值 -->
<template is="component-name" data="{{...userInfo}}" />

```

page.wxss
```css
@import '../path/to/component.wxss';

.usermotto {
  margin-top: 200px;
}
```

其他详情见代码...
