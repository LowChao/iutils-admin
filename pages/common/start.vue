<template>
	<view>
		<uni-load-more iconType="circle" status="loading" />
	</view>
</template>

<script>
	import { useStore } from '@/stores/index'
	import { mapWritableState } from 'pinia'
	import { ElMessage } from 'element-plus'
	import { getActiveMenu } from '@/utils/util'
	export default {
		computed: {
			...mapWritableState(useStore, ['isLogin', 'user', 'menus', 'activeMenuPath', 'activeMenuName'])
		},
		onReady() {
			//校验是否已登录
			this.$nextTick(()=>{
				//检查一下是否已登录
				this.$http.get("/user/getInfo", {verify: false, "header": {"Mid": "User"}}).then(res => {
					if(res.code == 20000 && res.data){
						this.isLogin = true
						this.user = res.data
						if(!this.activeMenuPath){
							this.$http.get("/menu/getList", {verify: false, "header": {"Mid": "Menu"}}).then(res => {
								if(res.code == 20000){
									this.menus = res.data
									//跳转到首页 "/pages/index/index"
									let menu = getActiveMenu(this.menus)
									this.activeMenuPath = menu.activeMenu
									this.activeMenuName = menu.activeName
									uni.reLaunch({
										url: this.activeMenuPath,
										fail: (e)=>{
											ElMessage.error("找不到页面")
										}
									})
								}else{
									ElMessage.error("菜单加载失败")
								}
							})
						}else{
							//跳转到首页 "/pages/index/index"
							uni.reLaunch({
								url: this.activeMenuPath,
								fail: (e)=>{
									ElMessage.error("找不到页面")
								}
							})
						}
					}else{
						//跳转到登录
						uni.reLaunch({
							url: "/pages/common/login"
						})
					}
				})
			})
		}
	}
</script>

<style>

</style>
