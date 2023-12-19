<template>
	<view>
		<el-watermark :font="{'color': 'rgba(0, 0, 0, .15)'}" :content="showWatermark?(user?user.name:''):''">
			<el-scrollbar v-if="height>0" :height="height-topHeight-1+'px'" style="border-top: 1px solid #f5f5f5;">
				<el-menu :default-active="activeMenuName+','+activeMenuPath" :collapse="isMenuCollapse" @select="selectMenu" :unique-opened="true" :router="false">
					<template v-for="(oneItem, oneIndex) in menus">
						<el-sub-menu v-if="oneItem.children && oneItem.children.length>0" :key="oneIndex" :index="oneItem.text">
							<template #title>
								<el-icon v-if="oneItem.icon && oneItem.icon!='#'"><component :is="oneItem.icon"></component></el-icon>
								<span>{{oneItem.text}}</span>
							</template>
							<template v-for="(twoItem, twoIndex) in oneItem.children" :key="twoIndex">
								<el-sub-menu v-if="twoItem.children && twoItem.children.length>0" :key="twoIndex" :index="twoItem.text">
									<template #title>
										<el-icon v-if="twoItem.icon && twoItem.icon!='#'"><component :is="twoItem.icon"></component></el-icon>
										<span>{{twoItem.text}}</span>
									</template>
									<el-menu-item v-for="(threeItem, threeIndex) in twoItem.children" :key="threeIndex" :index="threeItem.text+','+threeItem.value">
										<template #title>
											<el-icon v-if="threeItem.icon && threeItem.icon!='#'"><component :is="threeItem.icon"></component></el-icon>
											<span>{{threeItem.text}}</span>
										</template>
									</el-menu-item>
								</el-sub-menu>
								<el-menu-item v-else :key="twoIndex+1" :index="twoItem.text+','+twoItem.value">
									<template #title>
										<el-icon v-if="twoItem.icon && twoItem.icon!='#'"><component :is="twoItem.icon"></component></el-icon>
										<span>{{twoItem.text}}</span>
									</template>
								</el-menu-item>
							</template>
						</el-sub-menu>
						<el-menu-item v-else :key="oneIndex+1" :index="oneItem.text+','+oneItem.value">
							<el-icon v-if="oneItem.icon && oneItem.icon!='#'"><component :is="oneItem.icon"></component></el-icon>
							<template #title>{{oneItem.text}}</template>
						</el-menu-item>
					</template>
				</el-menu>
			</el-scrollbar>
		</el-watermark>
	</view>
</template>

<script>
	import config from '@/config.js'
	import { useStore } from '@/stores/index'
	import { mapWritableState } from 'pinia'
	export default {
		computed: {
			...mapWritableState(useStore, ['user', 'menus', 'isMenuCollapse', 'topHeight', 'activeMenuPath', 'activeMenuName'])
		},
		data() {
			return {
				showWatermark: false,//是否显示水印
				height: 0
			}
		},
		mounted() {
			this.showWatermark = config.showWatermark
			const res = uni.getSystemInfoSync()
			this.height = res.windowHeight
		},
		methods: {
			//选择菜单
			selectMenu(index, indexPath){
				if(index.indexOf("http://")==0 || index.indexOf("https://")==0){
					//跳转到外部地址
					window.open(index)
				}else{
					//跳转到内部路由
					let menu = index.split(",")
					this.activeMenuName = menu[0]
					this.activeMenuPath = menu[1]
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
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-menu{
		border-right: none;
	}
</style>