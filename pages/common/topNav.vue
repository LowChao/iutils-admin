<template>
	<view class="overflow-hidden width-max">
		<el-watermark :font="{'color': 'rgba(0, 0, 0, .15)'}" :content="showWatermark?(user?user.name:''):''">
			<view class="top-box d-flex">
				<view class="d-flex">
					<view class="title nowrap fs18 fw" v-if="!isMenuCollapse">{{appName}}</view>
					<el-icon class="menu pointer" :size="22" @click="isMenuCollapse=!isMenuCollapse">
						<Expand v-if="isMenuCollapse" /><Fold v-else />
					</el-icon>
				</view>
				<view class="flex1"></view>
				<view class="d-flex">
					<view class="item theme d-flex" style="display: none;">
						<el-dropdown trigger="click">
							<uni-icons v-if="theme=='light'" class="menu-icon pointer" custom-prefix="iconfont" type="icon-sunny" size="20"></uni-icons>
							<uni-icons v-else-if="theme=='dark'" class="menu-icon pointer" custom-prefix="iconfont" type="icon-dark" size="20"></uni-icons>
							<template #dropdown>
								<el-dropdown-menu>
									 <el-dropdown-item @click="changeTheme('light')">明亮模式</el-dropdown-item>
									 <el-dropdown-item @click="changeTheme('dark')">暗黑模式</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</view>
					<view v-if="user" class="item username d-flex">
						<el-dropdown trigger="click">
							<view class="d-flex pointer">
								<view style="padding-right: 5px;">{{user.name}}</view>
								<el-icon>
								  <arrow-down />
								</el-icon>
							</view>
							<template #dropdown>
								<el-dropdown-menu>
									 <el-dropdown-item @click="showDialog('updatePasswordDialog')">修改密码</el-dropdown-item>
									 <el-dropdown-item @click="showDialog('logoutDialog')">退出登录</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</view>
				</view>
			</view>
		</el-watermark>
		
		<!-- 修改密码弹框 -->
		<uni-popup ref="updatePasswordDialog" type="center" :mask-click="false" :animation="false">
			<uni-card title="修改密码" style="width: 260px;">
				<uni-forms ref="form" v-if="rules" :modelValue="form" :rules="rules">
					<uni-forms-item name="oldPassword">
						<uni-easyinput type="password" trim="both" v-model="form.oldPassword" placeholder="原密码" />
					</uni-forms-item>
					<uni-forms-item name="newPassword">
						<uni-easyinput type="password" trim="both" v-model="form.newPassword" placeholder="新密码" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center">
					<el-button type="default" @click="hideDialog('updatePasswordDialog')" style="width: 100%;">取消</el-button>
					<el-button type="primary" :loading="loading" @click="updatePassword" style="width: 100%;">修改</el-button>
				</view>
			</uni-card>
		</uni-popup>
		
		<!-- 确认退出框 -->
		<uni-popup ref="logoutDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="提示" content="是否退出登录" @confirm="logout"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import config from '@/config.js'
	import { ElMessage } from 'element-plus'
	import { setTheme, removeToken } from '@/utils/auth'
	import { useStore } from '@/stores/index'
	import { mapWritableState } from 'pinia'
	export default {
		computed: {
			...mapWritableState(useStore, ['theme', 'isMenuCollapse', 'leftWidth', 'user', 'params'])
		},
		watch: {
			isMenuCollapse: function(oldValue, newValue){
				if(newValue){
					//打开菜单
					this.$nextTick(() => {
						this.leftWidth = 200
						uni.setLeftWindowStyle({
							width: '200px'
						})
					})
				}else{
					//隐藏菜单
					this.$nextTick(() => {
						this.leftWidth = 64
						uni.setLeftWindowStyle({
							width: '64px'
						})
					})
				}
			}
		},
		mounted() {
			this.appName = config.appName
			this.showWatermark = config.showWatermark
			//初始化校验
			this.initRules()
			//监听语言变化
			uni.onLocaleChange((e)=>{
				//初始化校验
				this.initRules()
			})
		},
		data() {
			return {
				appName: null,//应用名称
				showWatermark: false,//是否显示水印
				loading: false,
				form: {
					type: 1,
					oldPassword: '',
					newPassword: ''
				},
				rules: null
			}
		},
		methods: {
			//切换主题
			changeTheme(theme){
				if(this.theme != theme){
					this.theme = theme
					setTheme(theme)
				}
			},
			//初始化校验
			initRules(){
				this.rules = null
				this.$nextTick(()=>{
					//重置校验规则
					this.rules = {
						oldPassword: {
							rules: [{
								required: true,
								errorMessage: "请输入"
							}]
						},
						newPassword: {
							rules: [{
								required: true,
								errorMessage: "请输入"
							}]
						}
					}
				})
			},
			//显示弹出框
			showDialog(id){
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id){
				this.$refs[id].close()
			},
			//退出登录
			logout(){
				this.$http.get("/user/logout", {verify: false, header: {"Mid": "User"}}).then(res => {
					ElMessage.success("已退出")
					removeToken()
					uni.reLaunch({
						url: '/pages/common/login'
					})
				})
			},
			//修改密码
			updatePassword(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						this.$http.post("/user/changePassword", {verify: false, data: this.passwordForm, header: {"Mid": "User"}}).then(res => {
							this.loading = false
							if (res.code == 20000) {
								this.hideDialog("updatePasswordDialog")
								ElMessage.success("修改成功")
								setTimeout(()=>{
									uni.reLaunch({
										url: '/pages/common/login'
									});
								}, 500)
							}else{
								ElMessage.error(res.message)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top-box{
		height: 60px;
		padding: 0 20px;
		
		.title{
			width: 180px;
		}
		
		.item{
			margin-right: 15px;
		}
		.item:last-child{
			margin-right: 0px;
		}
	}
</style>