<template>
	<page ref="page">
		<el-page-header icon="ArrowLeft" @back="$back()">
			<template #title>返回</template>
		    <template #content>
		      <view class="page-header-title">新增模块</view>
		    </template>
			<view style="padding: 10px;">
				<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top">
					<uni-forms-item label="模块代码" name="code" required>
						<uni-easyinput type="textarea" trim="both" :autoHeight="true" :maxlength="-1" v-model="dataForm.code" />
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center">
					<el-button @click="$back()">返回</el-button>
					<el-button type="primary" :loading="loading" @click="submit">提交</el-button>
				</view>
			</view>
		  </el-page-header>
	</page>
</template>

<script>
	import Page from '@/pages/common/page.vue'
	import { ElMessage } from 'element-plus'
	export default {
		components: {
			Page
		},
		data() {
			return {
				eventChannel: null,
				loading: false,
				dataForm: {
					code: null
				},
				rules: {
					code: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						},{
							validateFunction:function(rule,value,data,callback){
								//检查代码格式
								try{
									let code = JSON.parse(value)
									let num = 0
									for (let key in code){
										if(['mid', 'name', 'cache', 'api_json', 'table_json'].includes(key)){
											num += 1
										}
									}
									if(num > 5){
										callback('代码格式错误')
									}
								}catch(e){
									callback('代码格式错误')
								}
							}
						}]
					}
				},
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
		},
		onReady() {
			this.$nextTick(async () => {
				await this.$refs.page.init()
			})
		},
		methods: {
			//提交
			submit(){
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.$http.post("/module/add", {data: JSON.parse(this.dataForm.code), header: {'Mid': 'Module'}}).then(res => {
							this.loading = false
							uni.hideLoading()
							if(res.code == 20000){
								ElMessage.success("提交成功")
								this.$nextTick(()=>{
									this.$back()
									this.eventChannel.emit("updateData", {})
								})
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

<style scoped lang="scss">
	.page-header-title{
		font-size: 16px;
	}
</style>
