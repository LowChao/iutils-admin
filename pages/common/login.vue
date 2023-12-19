<template>
	<view class="overflow-hidden width-max height-max">
		<view class="lang-box">
			<el-dropdown trigger="click">
				<uni-icons class="menu-icon pointer" custom-prefix="iconfont" type="icon-yuyan" size="26"></uni-icons>
				<template #dropdown>
					<el-dropdown-menu>
						 <el-dropdown-item @click="changeLang('zh-Hans')">简体中文</el-dropdown-item>
						 <el-dropdown-item @click="changeLang('zh-Hant')">繁体中文</el-dropdown-item>
						 <el-dropdown-item @click="changeLang('en')">English</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</view>
		<view class="login-box">
			<view class="d-flex-center login-title">用户登录</view>
			<uni-forms ref="form" v-if="rules" :modelValue="form" :rules="rules">
				<uni-forms-item name="username">
					<uni-easyinput type="text" prefixIcon="person" trim="both" v-model="form.username" placeholder="账号" />
				</uni-forms-item>
				<uni-forms-item name="password">
					<uni-easyinput type="password" prefixIcon="locked" trim="both" v-model="form.password" @confirm="handleLogin" placeholder="密码" />
				</uni-forms-item>
			</uni-forms>
			<el-button type="primary" :loading="loading" @click="handleLogin" style="width: 100%;">登录</el-button>
		</view>
	</view>
</template>

<script>
	import config from '@/config.js'
	import md5 from "js-md5"
	import { setToken } from '@/utils/auth'
	import { ElMessage } from 'element-plus'
	export default {
		data() {
			return {
				appName: null,//应用名称
				loading: false,
				form: {
					username: '',
					password: ''
				},
				rules: null,
				path: null,//默认跳转页面
			}
		},
		onReady() {
			this.appName = config.appName
			//设置标题
			uni.setNavigationBarTitle({
				title: this.appName + " - " + "用户登录"
			})
			//初始化校验
			this.initRules()
			//监听语言变化
			uni.onLocaleChange((e)=>{
				//初始化校验
				this.initRules()
			})
		},
		methods: {
			//初始化校验
			initRules(){
				this.rules = null
				this.$nextTick(()=>{
					//重置校验规则
					this.rules = {
						username: {
							rules: [{
								required: true,
								errorMessage: "请输入"
							}]
						},
						password: {
							rules: [{
								required: true,
								errorMessage: "请输入"
							}]
						}
					}
				})
			},
			//切换语言
			changeLang(locale){
				if(locale != uni.getLocale()){
					uni.setLocale(locale)
					// #ifdef H5
					this.$i18n.locale = locale
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.restart()
					// #endif
				}
			},
			//登录
			handleLogin() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						//密码进行md5加密
						this.form.password = md5(this.form.password)
						this.$http.post("/user/login", {"data": this.form, "header": {"Mid": "User"}}).then(res => {
							this.loading = false
							if (res.code == 20000) {
								//令牌token
								setToken(res.data.token)
								ElMessage.success("登录成功")
								//跳转到首页
								setTimeout(()=>{
									uni.reLaunch({
										url: "/"
									})
								}, 500)
							} else {
								ElMessage.error(res.message)
							}
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.lang-box{
		position: absolute;
		top: 10px;
		right: 10px;
	}
	.login-box {
		position: relative;
		top: 100px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 0 20px #efefef;
		margin: 0 auto;
		padding: 30px 40px 80px 40px;
	}
	.login-title{
		font-weight: bold;
		font-size: 22px;
		padding-bottom: 30px;
	}
</style>
