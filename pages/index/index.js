//index.js
//获取应用实例
const JDPage = require('../../page.js');

const UserInfo = require('../components/userinfo/index.js');

new JDPage({
    components: {
        userInfo: UserInfo,
    },
    data: {
        motto: 'Hello World',
    },
})
