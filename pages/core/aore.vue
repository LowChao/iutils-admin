<template>
	<page ref="page">
		<el-page-header icon="ArrowLeft" @back="$back()" v-if="module">
			<template #title>返回</template>
			<template #content>
				<view class="page-header-title">{{(isEdit?'编辑':'新增')+""+module.name}}</view>
			</template>
			<view style="padding: 10px;">
				<uni-forms ref="form" v-if="rules" :modelValue="dataForm" :rules="rules" label-position="top" label-width="180px">
					<el-row :gutter="50">
						<template v-for="(table, tableIndex) in module.table_json" :key="tableIndex">
							<el-col :span="parseInt(table.span)" v-if="table.edit && (table.roles.length==0 || (table.roles.length>0 && $refs.page.checkRole(table.roles)))">
								<template v-if="table.type==1 || table.type==2 || table.type==3" i="字符串/数字">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-easyinput type="text" trim="both" v-model="dataForm[table.name]" @input="evalFunc($event, table.func)" />
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==4" i="列表-字典多选">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<el-select v-model="dataForm[table.name]" multiple collapse-tags clearable
											size="large" style="width: 100%;" placeholder="请选择" @change="(value)=>{evalFunc(value, table.func)}">
											<el-option v-for="item in getDict(table.key)" :key="item.value"
												:label="item.text" :value="item.value">
											</el-option>
										</el-select>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==5" i="字典">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<el-select v-model="dataForm[table.name]" clearable size="large"
											style="width: 100%;" placeholder="请选择" @change="(value)=>{evalFunc(value, table.func)}">
											<el-option v-for="item in getDict(table.key)" :key="item.value"
												:label="item.text" :value="item.value">
											</el-option>
										</el-select>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==6" i="单图片">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-file-picker :imageStyles="imageStyles" :ref="'file-'+table.name" limit="1"
											v-model="dataForm[table.name+'_image']"
											file-mediatype="image"
											@delete="deleteFile($event, table.name)"
											@select="selectFile($event, table.name)"
											:auto-upload="false"></uni-file-picker>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==12" i="多图片">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-file-picker :imageStyles="imageStyles" :ref="'file-'+table.name" title="最多选择9张图片" limit="9"
											v-model="dataForm[table.name+'_image']"
											file-mediatype="image"
											@delete="deleteFiles($event, table.name)"
											@select="selectFiles($event, table.name)"
											:auto-upload="false"></uni-file-picker>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==7" i="多文本">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-easyinput type="textarea" trim="both" autoHeight :maxlength="-1"
											v-model="dataForm[table.name]" />
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==8" i="富文本">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<mosowe-editor v-model:modelValue="dataForm[table.name]"></mosowe-editor>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==9" i="对象选择">
									<uni-forms-item :label="table.remarks" :name="table.name+'_obj'" :required="table.must">
										<el-select v-model="dataForm[table.name+'_obj']" filterable remote remote-show-suffix :remote-method="(query) => {return remoteObject(query, table.key)}" clearable size="large"
											style="width: 100%;" placeholder="请选择" @change="(value)=>{evalFunc(value, table.func)}">
											<el-option v-for="item in getObject(table.key, 1, dataForm[table.name])" :key="item.code?item.code:item.id"
												:label="item.name" :value="item.code?item.code:item.id">
											</el-option>
										</el-select>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==19" i="对象列表-多选">
									<uni-forms-item :label="table.remarks" :name="table.name+'_obj'" :required="table.must">
										<el-select v-model="dataForm[table.name+'_obj']" multiple filterable remote remote-show-suffix :remote-method="(query) => {return remoteObject(query, table.key)}" clearable
											size="large" style="width: 100%;" placeholder="请选择" @change="(value)=>{evalFunc(value, table.func)}">
											<el-option v-for="item in getObject(table.key, 2, dataForm[table.name])" :key="item.code?item.code:item.id"
												:label="item.name" :value="item.code?item.code:item.id">
											</el-option>
										</el-select>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==10" i="树型数据">
									<uni-forms-item :label="table.remarks" :name="table.name+'_code'" :required="table.must">
										<el-tree-select :ref="'tree-'+table.name" v-model="dataForm[table.name+'_code']" check-strictly lazy node-key="code"
											size="large" style="width: 100%;"
											:load="(node, resolve) => {return $refs.page.loadTreeSelect(node, resolve, table.key)}"
											:props="{label: 'name',children: 'children',isLeaf: 'isLeaf'}"
											:cache-data="dataForm[table.name]"
											empty-text="暂无数据">
											<template #default="{ data }">
												{{ data.name }}
											</template>
										</el-tree-select>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==11" i="图标">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-easyinput type="text" suffixIcon="search"
											@iconClick="$refs.page.toUrl('https://element-plus.gitee.io/zh-CN/component/icon.html')"
											trim="both" v-model="dataForm[table.name]" />
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==13" i="单文件">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-file-picker :ref="'file-'+table.name" limit="1"
											v-model="dataForm[table.name+'_file']"
											file-mediatype="all"
											@delete="deleteFile($event, table.name)"
											@select="selectFile($event, table.name)"
											:auto-upload="false"></uni-file-picker>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==14" i="多文件">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-file-picker :ref="'file-'+table.name" title="最多选择9个文件" limit="9"
											v-model="dataForm[table.name+'_file']"
											file-mediatype="all"
											@delete="deleteFiles($event, table.name)"
											@select="selectFiles($event, table.name)"
											:auto-upload="false"></uni-file-picker>
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==15" i="时间戳">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-datetime-picker type="datetime" v-model="dataForm[table.name]"
											return-type="timestamp" />
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==16" i="日期">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<uni-datetime-picker type="date" v-model="dataForm[table.name]"
											return-type="timestamp" />
									</uni-forms-item>
								</template>
								<template v-else-if="table.type==17" i="子表">
									<uni-forms-item :label="table.remarks" :name="table.name" :required="table.must">
										<sub-table v-if="table.subtable" :table_json="table.subtable.table_json" v-model:tableList="dataForm[table.name]"></sub-table>
									</uni-forms-item>
								</template>
							</el-col>
						</template>
					</el-row>
				</uni-forms>
				<view class="d-flex-center">
					<el-button @click="$back()">返回</el-button>
					<el-button type="primary" :loading="loading" @click="submit">提交</el-button>
				</view>
			</view>
		</el-page-header>
		<el-page-header icon="ArrowLeft" @back="$back()" v-else>
			<template #title>返回</template>
			<template #content>
				<span>异常通知</span>
			</template>
			<view style="padding: 10px;">
				该页面不能刷新
			</view>
		</el-page-header>
	</page>
</template>

<script>
	import Page from '@/pages/common/page.vue'
	import MosoweEditor from "@/components/mosowe-editor/mosowe-editor.vue"
	import SubTable from '@/components/sub-table/sub-table.vue'
	import { ElMessage } from 'element-plus'
	import { useStore } from '@/stores/index'
	import { mapState, mapActions } from 'pinia'
	export default {
		components: {
			Page,
			MosoweEditor,
			SubTable
		},
		data() {
			return {
				isEdit: false, //是否编辑
				eventChannel: null,
				module: null,
				loading: false,
				dataForm: {},
				rules: null,
				imageStyles: {
					width: '105px',
					height: '105px'
				}
			}
		},
		onLoad() {
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res) => {
				this.module = res.module
				if (res.data) {
					this.dataForm = res.data
					if (this.dataForm["id"]) {
						this.isEdit = true
					}
				}
				//初始化校验
				this.initRules()
				//监听语言变化
				uni.onLocaleChange((e) => {
					//初始化校验
					this.initRules()
				})
				//初始化数据
				this.$nextTick(() => {
					this.initData()
				})
			})
		},
		methods: {
			...mapActions(useStore, ['getDict', 'getObject', 'remoteObject']),
			//动态执行方法
			evalFunc(value, func) {
				if (func) {
					eval(func)
				}
			},
			//初始化校验
			initRules() {
				this.rules = null
				this.$nextTick(()=>{
					let rules = {}
					for (let i = 0; i < this.module.table_json.length; i++) {
						let table = this.module.table_json[i]
						//是否必填验证
						if (table.must) {
							if (table.type == 4 || table.type == 5) {
								rules[table.name] = {
									rules: [{
										required: true,
										errorMessage: "请选择"
									}]
								}
							}else if(table.type == 9 || table.type == 19){
								rules[table.name+"_obj"] = {
									rules: [{
										required: true,
										errorMessage: "请选择"
									}]
								}
							}else if(table.type == 10){
								rules[table.name+"_code"] = {
									rules: [{
										required: true,
										errorMessage: "请选择"
									}]
								}
							} else if (table.type == 6 || table.type == 12) {
								rules[table.name] = {
									rules: [{
										required: true,
										errorMessage: "请上传"
									}]
								}
							} else {
								rules[table.name] = {
									rules: [{
										required: true,
										errorMessage: "请输入"
									}]
								}
							}
						}
					}
					this.rules = rules
				})
			},
			//初始化数据
			async initData() {
				//循环字段组
				for (let i = 0; i < this.module.table_json.length; i++) {
					let table = this.module.table_json[i]
					//使用默认值
					if (!this.isEdit && table.default) {
						//判断是否有值
						if (table.name in this.dataForm) {} else {
							if(table.type == 2){
								this.dataForm[table.name] = parseInt(table.default)
							}else if(table.type == 3){
								this.dataForm[table.name] = parseFloat(table.default)
							}else{
								this.dataForm[table.name] = table.default
							}
						}
					}
					if(table.type == 6){
						//单图片
						if(this.dataForm[table.name]){
							this.dataForm[table.name+"_image"] = this.$refs.page.formatFile(this.dataForm[table.name])
						}
					}else if(table.type == 12){
						//多图片
						if(this.dataForm[table.name]){
							this.dataForm[table.name+"_image"] = this.$refs.page.formatFiles(this.dataForm[table.name])
						}
					}else if(table.type == 9){
						//获取对象
						if(this.dataForm[table.name]){
							if(this.dataForm[table.name]["code"]){
								this.dataForm[table.name+"_obj"] = this.dataForm[table.name]["code"]
							}else{
								this.dataForm[table.name+"_obj"] = this.dataForm[table.name]["id"]
							}
						}
					}else if(table.type == 19) {
						//获取对象列表
						if(this.dataForm[table.name]){
							this.dataForm[table.name+"_obj"] = this.dataForm[table.name].map(item => {
								if(item.code){
									return item.code
								}else{
									return item.id
								}
							})
						}
					}else if(table.type == 10){
						//树
						if(this.dataForm[table.name]){
							let codes = this.dataForm[table.name].map(item => item.code)
							this.dataForm[table.name+"_code"] = codes[codes.length-1]
						}
					}else if(table.type == 13){
						//单文件
						if(this.dataForm[table.name]){
							this.dataForm[table.name+"_file"] = this.$refs.page.formatFile(this.dataForm[table.name])
						}
					}else if(table.type == 14){
						//多文件
						if(this.dataForm[table.name]){
							this.dataForm[table.name+"_file"] = this.$refs.page.formatFiles(this.dataForm[table.name])
						}
					}else if (table.type == 17){
						//子表
						if (!this.isEdit) {
							//默认值
							this.dataForm[table.name] = []
						}
					}
				}
			},
			//提交
			submit() {
				let submitData = JSON.parse(JSON.stringify(this.dataForm))
				for (let i = 0; i < this.module.table_json.length; i++) {
					let item = this.module.table_json[i]
					if(item.edit){
						if(item.type == 10){
							//树型数据
							let treeNode = this.$refs["tree-" + item.name][0].getCurrentNode()
							if(treeNode){
								submitData[item.name] = [{"code": treeNode.code, "name": treeNode.name}]
								delete submitData[item.name+"_code"]
							}
						}else if(item.type == 9 || item.type == 19){
							//对象|对象列表
							if(submitData[item.name+"_obj"]){
								submitData[item.name] = submitData[item.name+"_obj"]
								delete submitData[item.name+"_obj"]
							}
						}
					}
				}
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: "正在提交"
						})
						this.$http.post(this.isEdit ? "/core/update" : "/core/add", {
							data: submitData,
							header: {
								'Mid': this.module.mid
							}
						}).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								ElMessage.success("提交成功")
								this.$nextTick(() => {
									this.$back()
									this.eventChannel.emit("updateData", submitData)
								})
							} else {
								ElMessage.error(res.message)
							}
						})
					}
				})
			},
			//选择文件后触发
			selectFile(e, name) {
				uni.showLoading({
					title: "正在上传"
				})
				this.$http.uploadFile('/core/upload', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					if (res.code == 20000) {
						ElMessage.success("上传成功")
						this.$set(this.dataForm, name, res.data[0].url)
					} else {
						this.$refs['file-' + name][0].clearFiles()
						ElMessage.error(res.message)
					}
				})
			},
			//删除文件
			deleteFile(e, name) {
				this.dataForm[name] = null
			},
			//选择文件后触发
			selectFiles(e, name) {
				uni.showLoading({
					title: "正在上传"
				})
				this.$http.uploadFile('/core/upload', e.tempFilePaths[0]).then(res => {
					uni.hideLoading()
					if (res.code == 20000) {
						ElMessage.success("上传成功")
						if (!this.dataForm[name]) {
							this.$set(this.dataForm, name, [res.data[0].url])
						} else {
							this.dataForm[name].push(res.data[0].url)
						}
					} else {
						ElMessage.error(res.message)
					}
				})
			},
			//删除文件
			deleteFiles(e, name) {
				for (let i = 0; i < this.dataForm[name].length; i++) {
					if (e.tempFilePath.indexOf(this.dataForm[name][i]) > -1) {
						this.dataForm[name].splice(i, 1)
						break;
					}
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-header-title{
		font-size: 16px;
	}
</style>