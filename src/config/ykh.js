/**
 * 公共JS类
 */
var ykh = ykh || {}
import Vue from 'vue' //vue核心库
import configParams from './config'//配置文件库
import { Message, MessageBox  } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';


ykh.v = configParams;

ykh.success = function (tips,time) {
    if(!tips){
       tips = '操作成功'
    }

    Message.success(tips)
}
/**
 * 红色错误
 * @param {提示} tips
 */
ykh.error = function (tips,time) {
    if(!tips){
        tips = '操作失败';
    }
    Message.error(tips)
}
/**
 * 黄色警告
 * @param {提示} tips
 */
ykh.warn = function (tips,time) {
    if(!tips){
        tips = '警告';
    }
    Message.warning(tips)
}
/**
 * 纯文本的提示
 * @param {提示} tips
 */
ykh.text = function (tips,time) {
    if(!tips){
        tips = '提示';
    }
    Message.info(tips)
}


ykh.confirm = function (title, content, onConfirm,cancel) {
            MessageBox.confirm(content, title, {
              distinguishCancelAndClose: true,
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            })
              .then(() => {
                  onConfirm()
              })
              .catch(action => {
                if(cancel){
                  cancel()
                }
              });
}
/******************************************************************************** axios 拦截器和请求 ********************************************************************************/
import axios from 'axios' //ajax请求的 内容
//取消请求
let pending = []
let CancelToken = axios.CancelToken
let removePending = (config, f) => {
    let flagUrl = config.url + '&' + config.method + '&' + Date.parse(new Date()) / 100
    if (pending.indexOf(flagUrl) !== -1) {
        if (f) {
            f() // 执行取消操作
        } else {
            pending.splice(pending.indexOf(flagUrl), 1)// 把这条记录从数组中移除
        }
    } else {
        if (f) {
            pending.push(flagUrl)
        }
    }
}
axios.defaults.baseURL = configParams.apiPath;
//设置请求超时时间
axios.defaults.timeout = 5000

//开始请求设置，发起拦截处理 config代表发起请求的参数实体
axios.interceptors.request.use(config => {
    var index = '?'
    if (config.url.indexOf("?") > 0) {
        index = '&'
    }
    config.url += index + '&_t' + '=' + Date.parse(new Date()) / 100

    //请求拦截器
    config.cancelToken = new CancelToken((c) => {
        removePending(config, c)
    })
	config.headers["Content-Type"] ="application/json;charset=UTF-8";
    //免登录
    if (config.url.indexOf(configParams.jwtUrl) != -1) {
		config.headers[configParams.Authorization] = ykh.getVal("jwt");
    }
    return config;  //添加这一行
}, error => {
    return error;
})

//请求到结果的拦截处理
axios.interceptors.response.use(data => {
     //console.log(data) //统一打印返回值
    //返回请求的正确结果
    if(data && data.data  && data.data.status==9999){
      MessageBox.confirm("登录已过期", "重新登录", {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
            ykh.go('/login')
        })
        .catch(action => {
          ykh.go('/login')
        });
        return
    }
    return data.data;
}, error => {
    //如果头部令牌已经无效
    if (error.response && error.response.data && error.response.data.error && error.response.data.error .indexOf("JWT expired")!=-1) {
		ykh.go('/login')
	}

    if (error.response) {
        return error.response.data;
    }

})


//将axios的get方法绑定到S上面
ykh.get = function (url, params, callback) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: params })
            .then(res => {
                // resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}

//将axios的post方法绑定到ykh上面
ykh.post = function (url, params, callback) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                //resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}


//将axios的patch方法绑定到ykh上面
ykh.patch = function (url, params, callback) {
    return new Promise((resolve, reject) => {
        axios.patch(url, params)
            .then(res => {
                // resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}
//将axios的put方法绑定到ykh上面
ykh.put = function (url, params, callback) {
    return new Promise((resolve, reject) => {
        axios.put(url, params)
            .then(res => {
                // resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}
//将axios的del方法绑定到ykh上面  删除的id 在url后 例如：/api/users/123  删除id为123的用户
ykh.del = function (url, callback) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {})
            .then(res => {
                // resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}
//将axios的delete方法绑定到S上面
ykh.delete = function (url, params, callback) {
    return new Promise((resolve, reject) => {
        axios.delete(url, params)
            .then(res => {
                // resolve(res)
                callback(res)
            }).catch(err => {
                // callback(err)
                reject(err)
            })
    })
}
/**********************************************************************vuex localStorage 组件间和缓存********************************************************************* */

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}

/**
 * 取值
 * @param {} key
 */
ykh.getVal = function (key) {
    // return store.state[key];
    return localStorage.getItem(key);

}
/**
 *
 * @param {key} key
 * @param {值} value
 */
ykh.setVal = function (key, value) {
    localStorage.setItem(key, value);
}
/******************************************************************************** i18n 国际化 ********************************************************************************/

/******************************************************************路由跳转************************************************************************* */
//路由
import router from '../router'

/**
 * 原生路由跳转
 */
ykh.go = function(params){
    router.push(params)
}
/**
 * 跳转传递参数 例如：/users?id=1   s.goQ("/users",{id:1})
 */
ykh.goQ = function(url,params){
    router.push({path:url,query:params})
}
//Vue.use(router)
ykh.router = router;



/********************************************************************list转换 树形结构****************************************************************************/


/**
* json格式转标准树状结构
* @param {json} json数据 $.parseJSON()  list数据 [{},{}]
* @param {String} id的字符串 属性名称  根据这个找到主键  一般是 id
* @param {String} 父id的字符串 属性名称  根据这个找到叶子节点   一般是 parentId
* @param {String} children的字符串 属性名称  例如：children
* @param {open} 是否展开  1展开
* @return {Array} 树形数组
*/
ykh.parseTree = function(json, idStr, pidStr, childrenStr,open,point,name){
    /****默认值：结合后端树形表结构 id,parentId,parentIds 同时结合前端iview children   组装为树形结构****/
    if(!idStr){
        idStr = "id"
    }
    if(!pidStr){
        pidStr = "parentId"
    }
    if(!childrenStr){
        childrenStr = "children"
    }
    if(open&&open=='1'){
        open = false
    }else if(open&&open=='0'){
        open = true
    }
    if(!point){
    	point=""
    }

    var r = [], hash = {}, id = idStr, pid = pidStr, children = childrenStr, i = 0, j = 0, len = json.length;
    for(; i < len; i++){
    	json[i][children] = []
        hash[json[i][id]] = json[i];
    }

    for(; j < len; j++){
        var aVal = json[j], hashVP = hash[aVal[pid]];

        if(!name){
        	aVal['title'] = aVal['name'] + point;//name 放入title  iviewTree使用
        }else{

        	aVal['title'] = aVal['name'] + point + aVal[name];//name 放入title  iviewTree使用
    		if(aVal['isLeaf'] && aVal['isLeaf'] == '1'){//最后一级
    			var allTitle ='' //所有称
    			 for(var l=0; l < len; l++){
    				 var aleafVal = json[l]
    				 if(aVal['parentIds'].indexOf(aleafVal['id']) != -1){//包含
    					 allTitle  = allTitle + aleafVal['name'] + point
    				 }
    			 }
    			aVal['allTitle']  = allTitle

    		}
        }
        if(open){
        	 aVal['expand'] = open;//默认全部展开
        }
        if(hashVP){
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        }else{
            r.push(aVal);
        }
    }
    return r;
}

/*********************************************************************list转换 树形结构****************************************************************************/

/**
 * MD5
 */


/**
 * 返回uuid
 */
ykh.uuid = function () {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}



/*****************************************************************相对时间显示************************************************************************** */
ykh.date = function(time){
    let oldDate = new Date(time)
    let newDate = new Date()
    var dayNum = "";
    var getTime = (newDate.getTime() - oldDate.getTime())/1000;
     if(getTime < 60){
        dayNum = "现在"; // just now
    }else if(getTime >= 60*1 && getTime < 60*60){
        dayNum = parseInt(getTime / 60) + s.t('base.date.minutesAgo'); //minutes ago
    }else if(getTime >= 3600 && getTime < 3600*24){
        dayNum = parseInt(getTime / 3600) + s.t('base.date.hoursAgo'); // hours ago
    }else if(getTime >= 3600 * 24 && getTime < 3600 * 24 * 30){
        dayNum = parseInt(getTime / 3600 / 24 ) + s.t('base.date.dayAgo'); // day ago
    }else if(getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12){
        dayNum = parseInt(getTime / 3600 / 24 / 30 ) + s.t('base.date.monthAgo');  // month ago
    }else if(time >= 3600 * 24 * 30 * 12){
        dayNum = parseInt(getTime / 3600 / 24 / 30 / 12 ) + s.t('base.date.yearsAgo');  //years ago
    }
    return dayNum;
}
/***********************************************传入时间戳，转换为yyyy-mm-dd**********************************/
ykh.fmtDate = function(obj){
    var date =  new Date(obj);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

ykh.getNowDate = function getNowDate() {
	 var date = new Date();
	 var sign1 = "-";
	 var sign2 = ":";
	 var year = date.getFullYear() // 年
	 var month = date.getMonth() + 1; // 月
	 var day  = date.getDate(); // 日
	 var hour = date.getHours(); // 时
	 var minutes = date.getMinutes(); // 分
	 var seconds = date.getSeconds() //秒
//	 var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
//	 var week = weekArr[date.getDay()];
	 // 给一位数数据前面加 “0”
	 if (month >= 1 && month <= 9) {
	  month = "0" + month;
	 }
	 if (day >= 0 && day <= 9) {
	  day = "0" + day;
	 }
	 if (hour >= 0 && hour <= 9) {
	  hour = "0" + hour;
	 }
	 if (minutes >= 0 && minutes <= 9) {
	  minutes = "0" + minutes;
	 }
	 if (seconds >= 0 && seconds <= 9) {
	  seconds = "0" + seconds;
	 }
	 var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds ;
	 return currentdate;
}
/***************************************************************** jssdk ************************************************************************* */




/**
 * 定义一个map
 * 如：var map=new s.HashMap();
 * */
ykh.HashMap=function(){
	//定义长度
	var length = 0;
	//创建一个对象
	var obj = new Object();

	/**
	* 判断Map是否为空
	*/
	this.isEmpty = function(){
		return length == 0;
	};

	/**
	* 判断对象中是否包含给定Key
	*/
	this.containsKey=function(key){
		return (key in obj);
	};

	/**
	* 判断对象中是否包含给定的Value
	*/
	this.containsValue=function(value){
		for(var key in obj){
			if(obj[key] == value){
				return true;
			}
		}
		return false;
	};

	/**
	*向map中添加数据
	*/
	this.put=function(key,value){
		if(!this.containsKey(key)){
			length++;
		}
		obj[key] = value;
	};

	/**
	*向map原数据 添加数据
	*/
	this.putAll=function(key,value){
		if(!this.containsKey(key)){
			length++;
		}
		if(this.get(key)){
			obj[key] = this.get(key)+','+value;
		}else{
			obj[key] = value;
		}
	};

	/**
	* 根据给定的Key获得Value
	*/
	this.get=function(key){
		return this.containsKey(key)?obj[key]:null;
	};

	/**
	* 根据给定的Key删除一个值
	*/
	this.remove=function(key){
		if(this.containsKey(key)&&(delete obj[key])){
			length--;
		}
	};

	/**
	* 获得Map中的所有Value
	*/
	this.values=function(){
		var _values= new Array();
		for(var key in obj){
			_values.push(obj[key]);
		}
		return _values;
	};

	/**
	* 获得Map中的所有Key
	*/
	this.keySet=function(){
		var _keys = new Array();
		for(var key in obj){
			_keys.push(key);
		}
		return _keys;
	};

	/**
	* 获得Map的长度
	*/
	this.size = function(){
		return length;
	};

	/**
	* 清空Map
	*/
	this.clear = function(){
		length = 0;
		obj = new Object();
	};
};



export default ykh
