export default {
	appName: 'Iutils低代码平台',//应用名称
	channel: 'web_admin',//应用渠道
	basePath: '/admin',//二级目录
	showWatermark: false,//是否显示水印
	showTab: true,//是否显示快捷菜单
	uploadFileType: 'local',//上传文件方式 uniCloud
	// #ifdef H5
	baseUrl: '/api', //基础接口地址
	// #endif
	// #ifdef APP-PLUS
	baseUrl: 'http://xx/api'
	// #endif
}