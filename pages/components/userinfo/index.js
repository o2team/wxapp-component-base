const Component = require('../../../component.js');

const app = getApp();

class UserInfo extends Component {
    defaultData() {
        return {
            avatarUrl: '',
            nickName: 'aotu',
        };
    }

    constructor() {
        super(...arguments);

        this.addFunc('_tapComponent', this.bindViewTap);
    }

    onLoad() {
        console.log('onLoad');
        //调用应用实例的方法获取全局数据
        app.getUserInfo(userInfo => {
            //更新数据
            console.log(userInfo);
            this.setData(userInfo);
        });
    }

    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        });
    }

}

module.exports = UserInfo;
