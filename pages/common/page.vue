<template>
	<view>
		<el-watermark :font="{'color': 'rgba(0, 0, 0, .15)'}" :content="showWatermark?(user?user.name:''):''">
			<view v-if="showTab" class="page-tabs" :style="{'width': width-leftWidth+'px'}">
				<el-tabs v-model="activeMenuPath" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
					<el-tab-pane v-for="tab in tabs" :key="tab.path" :label="tab.name" :name="tab.path">
						<template #label>{{tab.name}}</template>
					</el-tab-pane>
				</el-tabs>
			</view>
			<el-scrollbar v-if="height>0" class="page" :height="height-topHeight-tabHeight+'px'">
				<view :style="{'width': width-leftWidth+'px', 'height': height-topHeight-tabHeight+'px'}">
					<view class="content">
						<view class="content-box">
							<slot></slot>
						</view>
					</view>
				</view>
			</el-scrollbar>
		</el-watermark>
	</view>
</template>

<script>
	import config from '@/config.js'
	import { useStore } from '@/stores/index'
	import { mapWritableState, mapActions } from 'pinia'
	import { formatDateUtc, getActiveMenu } from '@/utils/util'
	import { setToken, getTheme } from '@/utils/auth'
	import { ElMessage } from 'element-plus'
	export default {
		computed: {
			...mapWritableState(useStore, ['theme', 'datas', 'tabs', 'isLogin', 'user', 'params', 'topHeight', 'leftWidth', 'menus', 'activeMenuPath', 'activeMenuName'])
		},
		data() {
			return {
				appName: null,//应用名称
				showWatermark: false,//是否显示水印
				mid: null, //模块ID
				module: null, //模块
				width: 0,
				height: 0,
				showTab: false,
				tabHeight: 0,
				showSelection: false, //是否显示多选
				showOperate: false, //是否显示操作
				showQuery: false, //是否显示查询
			}
		},
		mounted() {
			this.appName = config.appName
			this.showWatermark = config.showWatermark
			const res = uni.getSystemInfoSync()
			this.width = res.windowWidth
			this.height = res.windowHeight
			if(config.showTab){
				this.showTab = true
				this.tabHeight = 42
			}
			//监听页面大小
			uni.onWindowResize((res) => {
				this.width = res.size.windowWidth
				this.height = res.size.windowHeight
			})
		},
		methods: {
			...mapActions(useStore, ['initObject', 'initDict']),
			async init(){
				//初始化数据
				await this.initData()
				//设置标题
				this.$nextTick(()=>{
					if(this.activeMenuName){
						uni.setNavigationBarTitle({
							title: this.appName + " - " + this.activeMenuName
						})
						if(config.showTab){
							this.addTab(this.activeMenuName, this.activeMenuPath)
						}
					}
				})
			},
			async initData() {
				//初始化主题
				if (!this.theme && getTheme()) {
					this.theme = getTheme()
				}
				//初始化参数
				if(!this.params){
					const resParam = await this.$http.getAsync("/param/getList", {
						verify: false,
						header: {
							"Mid": "Param"
						}
					})
					if (resParam.code == 20000) {
						this.params = resParam.data
					}
				}
				if(!this.user){
					//初始化用户
					const resUser = await this.$http.getAsync("/user/getInfo", {
						verify: false,
						header: {
							"Mid": "User"
						}
					})
					if (resUser.code == 20000 && resUser.data) {
						this.isLogin = true
						this.user = resUser.data
						//刷新登录令牌
						this.$http.get("/user/refreshToken", {
							header: {
								"Mid": "User"
							}
						}).then(res => {
							if (res.code == 20000) {
								setToken(res.data.token)
							}
						})
						//获取菜单
						const resMenu = await this.$http.getAsync("/menu/getList", {
							verify: false,
							header: {
								"Mid": "Menu"
							}
						})
						if (resMenu.code == 20000) {
							let path = this.$route.fullPath
							let menu = getActiveMenu(resMenu.data, path)
							if(menu.activeMenu){
								this.menus = resMenu.data
								this.activeMenuPath = menu.activeMenu
								this.activeMenuName = menu.activeName
							}else{
								this.menus = resMenu.data
							}
						}
					}
				}
			},
			//动态执行方法
			evalFunc(func, item) {
				if (func) {
					eval(func)
				}
			},
			//添加到路由
			addTab(name, path){
				this.$nextTick(()=>{
					//判断是否存在
					var flag = this.tabs.some(item=>item.path===path)
					if(!flag){
						this.tabs.push({"name": name, "path": path})
					}
				})
			},
			//删除标签
			removeTab(path){
				this.$nextTick(()=>{
					if(this.tabs.length == 1){
						return
					}
					if(this.activeMenuPath === path){
						for(let i=0;i<this.tabs.length;i++){
							if (this.tabs[i].path === path) {
								const nextTab = this.tabs[i + 1] || this.tabs[i - 1]
								this.clickTab({"props": {"label": nextTab.name, "name": nextTab.path}})
								this.tabs.splice(i, 1)
								break
							}
						}
					}else{
						for(let i=0;i<this.tabs.length;i++){
							if (this.tabs[i].path === path) {
								this.tabs.splice(i, 1)
								break
							}
						}
					}
				})
			},
			//点击标签
			clickTab(pane){
				this.activeMenuName = pane.props.label
				this.activeMenuPath = pane.props.name
				//跳转页面
				uni.redirectTo({
					url: this.activeMenuPath,
					fail: (e)=>{
						//跳转到404
						uni.redirectTo({
							url: '/pages/common/404'
						})
					}
				})
			},
			//跳转连接
			toUrl(url){
				window.open(url)
			},
			//跳转页面
			toPage(path, item){
				uni.navigateTo({
					url: path,
					events: {
						//更新数据
						updateData: (res)=>{
							if(res){
								if(res.pid){
									//更新树数据
									this.$parent.refreshLoadTree(res.pid)
								}else{
									//更新列表数据
									this.$parent.getList()
								}
							}
						}
					},
					success: (res)=>{
						if (item) {
							res.eventChannel.emit('initData', {
								"module": this.module,
								data: JSON.parse(JSON.stringify(item))
							})
						} else {
							res.eventChannel.emit('initData', {
								"module": this.module
							})
						}
					}
				})
			},
			//预览图片
			showImage(imgs, index){
				uni.previewImage({"current": index, "urls": imgs})
			},
			//格式化日期
			formatDate(time, fmt){
				if (!time) return '--'
				if(fmt){
					return formatDateUtc(time, fmt)
				}
				return formatDateUtc(time)
			},
			//限制长度
			ellipsis(value, num=10) {
			  if (!value) return '--'
			  if (value.length > num) {
			    return value.slice(0, num) + '...'
			  }
			  return value
			},
			//判断是否有权限
			checkRole(roles){
				if(roles.length == 0){
					return false
				}
				if(this.user && this.user.roles.includes('super')){
					return true
				}
				let flag = false
				for(let i=0;i<roles.length;i++){
					if(this.user && this.user.roles.includes(roles[i])){
						flag = true
						break
					}
				}
				return flag
			},
			//获取模块信息
			async getModule(mid) {
				this.mid = mid
				//初始化
				await this.init()
				//获取模块信息
				let res = await this.$http.postAsync("/module/getModule", {data: {"mid": mid}, header: {'Mid': 'Module'}})
				if (res.code == 20000) {
					this.module = res.data
					//循环按钮组
					for (let i = 0; i < this.module.btn_json.length; i++) {
						let btn = this.module.btn_json[i]
						if (btn.position == 1) {
							//搜索区
							if (btn.name.indexOf("批量") > -1) {
								this.showSelection = true
							}
						} else {
							//表格区
							this.showOperate = true
						}
					}
					//循环字段组
					for (let i = 0; i < this.module.table_json.length; i++) {
						let item = this.module.table_json[i]
						if(item.type == 4 || item.type == 5){
							//初始化字典
							if (item.key) {
								await this.initDict(item.key)
							}
						}else if (item.type == 9 || item.type == 19){
							//初始化对象
							if (item.key) {
								await this.initObject(item.key)
							}
						}else if (item.type == 17){
							//获取子表模块信息
							if (item.key) {
								let resSub = await this.$http.postAsync("/module/getModule", {
									data: {
										"mid": item.key
									},
									header: {
										'Mid': 'Module'
									}
								})
								if (resSub.code == 20000) {
									this.module.table_json[i]["subtable"] = resSub.data
									for (let j = 0; j < resSub.data.table_json.length; j++) {
										let itemTemp = resSub.data.table_json[j]
										if (itemTemp.type == 4 || itemTemp.type == 5) {
											//获取字典
											if (itemTemp.key) {
												await this.initDict(itemTemp.key)
											}
										}
									}
								}
							}
						}
						//判断是否显示综合查询
						if (item.single_query && item.show && !this.showQuery) {
							this.showQuery = true
						}
					}
				}
			},
			//显示对象
			showObject(value){
				if(value){
					return value["name"]
				}else{
					return "--"
				}
			},
			//显示对象列表
			showObjects(values){
				if(values && values.length>0){
					let names = values.map(item => item.name)
					if(names.length>0){
						return names.join(",")
					}
				}else{
					return "--"
				}
			},
			//显示树
			showTree(trees){
				if(trees && trees.length>0){
					let names = trees.map(item => item.name)
					if(names.length>0){
						return names[names.length-1]
					}
				}
				return "--"
			},
			//加载树型数据
			loadTreeSelect(node, resolve, key){
				let pid = 0
				if(node.data.id){
					pid = node.data.id
				}
				this.$http.post("/core/getList", {
					data: {
						pid: pid
					},
					header: {
						'Mid': key
					}
				}).then(res => {
					resolve(res.data)
				})
			},
			//格式化单文件
			formatFile(file){
				let results = []
				if(file){
					let name = file.substr(file.lastIndexOf('/')+1)
					results.push({"name": name, "url": this.params.FileUrl+file})
				}
				return results
			},
			//格式化多文件
			formatFiles(files){
				let results = []
				if(files){
					for(let i=0;i<files.length;i++){
						let name = files[i].substr(files[i].lastIndexOf('/')+1)
						results.push({"name": name, "url": this.params.FileUrl+files[i]})
					}
				}
				return results
			},
		}
	}
</script>

<style lang="scss">
	.page-tabs{
		height: 40px;
		border-top: 1px solid #f5f5f5;
		border-bottom: 1px solid #f5f5f5;
	}
	
	.page {
		background-color: #f5f5f5;
		
		.content{
			padding: 15px;
			
			.content-box{
				background-color: #ffffff;
				padding: 10px;
				border-radius: 7px;
			}
		}
	}
</style>