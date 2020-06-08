/**
 * 全局静态属性配置文件
 */
const config = {
    langCode:'lang',                                            //默认语言接口参数名
    lang: 'zh_CN',                                              //语言值
    apiPath : "http://127.0.0.1:10090",                          //测试服务器网关地址
    Authorization:"Authorization",
    noLoginUrl:"/api/open/",
	jwtUrl:"/api/jwt/",
    loginUrl:"/api/open/user/login",
	whiteUrl:"/login,",
  imgUrl:"../../../static/images/"
}
export default config;

