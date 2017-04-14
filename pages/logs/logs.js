//logs.js
const JDPage = require('../../page.js');
const util = require('../../utils/util.js');

new JDPage({
    data: {
        logs: []
    },
    onLoad: function() {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function(log) {
                return util.formatTime(new Date(log))
            })
        })
    }
})
