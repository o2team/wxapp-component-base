/**
 * 组件基类
 */
 
const Base = require('./base.js');
const Emitter = require('./utils/emitter.js');

const event = new Emitter();

/**
 * 解析对象路径
 * @param o {Object} 要解析的对象
 * @param s {String} 对应的路径，如 'foo.bar[2]'
 * @param d {Any} 路径不存在时，设置的默认值
 * @return {Any} 对应路径的值
 */
function resolvePath(o, s, d) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return o[k] = d;
        }
    }
    return o;
};

/**
 * 获取随机 ID
 * @return {String} ID 字符串
 */
function getID() {
    return Math.random().toString(36).substring(2, 15);
}

class Component extends Base {
    /**
     * 设置组件默认 data
     * @return {Object} 默认数据对象
     */
    defaultData() {
        return {};
    }

    /**
     * 设置依赖组件
     * @return {Object} 依赖组件
     */
    components() {
        return {};
    }

    /**
     * 初始化方法
     * @param target {Object} 组件挂载的 page 对象
     * @param ns {String} 组件挂载在页面 data 的对应路径，例如 'top.nav'
     */
    constructor(target, ns) {
        super(target);

        this.target = target;
        this.ns = ns;

        this._events = {};
        this.data.fn = {};

        if(typeof target.setData === 'function') this.page = target;


        this._mergeDefaultData();
        this._initComponents();

        this._mergeLifeCircle();
    }

    /**
     * 组件 ID
     */
    get cid() {
        if(!this._cid) this._cid = getID();

        return this._cid;
    }

    /**
     * 获取当前组件的 data 对象
     */
    get data() {
        let target = this.page || this.target;

        return resolvePath(target.data, this.ns, {});
    }

    set data(options) {
        console.log("~~~~~~~~~ set: ", options);
        // TODO set data
        throw Error("cannot set data yet!  @JD");
    }

    /**
     * 合并组件 data
     */
    _mergeDefaultData() {
        let defaults = this.defaultData();

        for(let key in defaults) {
            if(typeof this.data[key] == "undefined") this.data[key] = defaults[key];
        }

        // update page data if page is already exists
        if(this.page) {
            this.setData(this.data);
        }
    }

    _initComponents() {
        let components = this.components();

        this.components = {};

        for(let key in components) {
            this.components[key] = new components[key](this.target, this.ns + '.' + key);
        }
    }

    /**
     * 合并生命周期
     */
    _mergeLifeCircle() {
        let _self = this;
        let list = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload'];

        for(let fn of list) {
            if(!this[fn]) continue;

            let tempFn = this.target[fn];

            this.target[fn] = function() {
                if(!_self.page) _self.page = this;

                if(tempFn) tempFn.apply(this, arguments);
                _self[fn].apply(_self, arguments);
            }
        }
    }

    /**
     * 获取真正的函数名称
     * @param name {String}  组件内函数名称
     * @return {String} 挂载到页面的真正的函数名称
     */
    _getFuncName(name) {
        return `${name}_${this.cid}`;
    }

    /**
     * 更新组件数据
     * @param obj {Object} 更新内容，同微信的 setData
     * @param isGlobal {Boolean} 若为 true 时，更新作用域为当前页面的数据，默认 false
     */
    setData(obj, isGlobal) {
        if(!this.page) throw Error("no page object~  @JD");

        let {ns} = this;
        let data = {};

        if(isGlobal) {
            data = obj;
        } else {
            for(let key in obj) {
                data[ns+'.'+key] = obj[key];
            }
        }

        this.page.setData(data);
    }

    onLoad() {

    }

    /**
     * 添加回调方法供模板调用
     * @param name {String} 对应模板中调用时的方法名
     * @param fn {Function} 执行的回调方法，this 指向当前组件
     */
    addFunc(name, fn) {
        if(this.data[name]) {
            throw new Error(`function name ${name} is already exists~   @JD`);
        }

        const fnName = this._getFuncName(name);

        // notice to page if page object is already exists
        if(this.page) {
            this.setData({
                [`${name}`]: fnName,
            });
        } else {
            this.data[name] = fnName;
        }

        this.target[fnName] = fn.bind(this);
    }

    /**
     * 监听事件，同 Event 组件
     */
    on(name, fn) {
        if(!this._events[name]) this._events[name] = [];

        fn = fn.bind(this);
        this._events[name].push(fn);

        event.on(name, fn);
    }

    /**
     * 触发事件，同 Event 组件
     */
    emit() {
        event.emit(...arguments);
    }
}

module.exports = Component;
