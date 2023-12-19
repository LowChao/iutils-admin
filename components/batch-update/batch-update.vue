<template>
	<view>
		<el-dialog v-model="dialogVisible" title="批量修改" width="500px">
			<uni-forms ref="form" :modelValue="dataForm" label-position="top" label-width="180px">
				<el-row :gutter="50">
					<template v-for="(table, tableIndex) in table_json" :key="tableIndex">
						<el-col :span="24"
							v-if="table.batch_update && (table.roles.length==0 || (table.roles.length>0 && checkRole(table.roles)))">
							<template v-if="table.type==4" i="列表-字典多选">
								<uni-forms-item :label="table.remarks" :name="table.name">
									<el-select v-model="dataForm[table.name]" multiple collapse-tags clearable
										size="large" style="width: 100%;" placeholder="请选择">
										<el-option v-for="item in getDict(table.key)" :key="item.value"
											:label="item.text" :value="item.value">
										</el-option>
									</el-select>
								</uni-forms-item>
							</template>
							<template v-else-if="table.type==5" i="字典">
								<uni-forms-item :label="table.remarks" :name="table.name">
									<el-select v-model="dataForm[table.name]" clearable size="large"
										style="width: 100%;" placeholder="请选择">
										<el-option v-for="item in getDict(table.key)" :key="item.value"
											:label="item.text" :value="item.value">
										</el-option>
									</el-select>
								</uni-forms-item>
							</template>
							<template v-else-if="table.type==9" i="对象选择">
								<uni-forms-item :label="table.remarks" :name="table.name+'_obj'">
									<el-select v-model="dataForm[table.name+'_obj']" filterable remote
										remote-show-suffix
										:remote-method="(query) => {return remoteObject(query, table.key)}" clearable
										size="large" style="width: 100%;" placeholder="请选择">
										<el-option v-for="item in getObject(table.key, 1, dataForm[table.name])"
											:key="item.code?item.code:item.id" :label="item.name"
											:value="item.code?item.code:item.id">
										</el-option>
									</el-select>
								</uni-forms-item>
							</template>
							<template v-else-if="table.type==19" i="对象列表-多选">
								<uni-forms-item :label="table.remarks" :name="table.name+'_obj'">
									<el-select v-model="dataForm[table.name+'_obj']" multiple filterable remote
										remote-show-suffix
										:remote-method="(query) => {return remoteObject(query, table.key)}" clearable
										size="large" style="width: 100%;" placeholder="请选择">
										<el-option v-for="item in getObject(table.key, 2, dataForm[table.name])"
											:key="item.code?item.code:item.id" :label="item.name"
											:value="item.code?item.code:item.id">
										</el-option>
									</el-select>
								</uni-forms-item>
							</template>
							<template v-else-if="table.type==10" i="树型数据">
								<uni-forms-item :label="table.remarks" :name="table.name+'_code'">
									<el-tree-select :ref="'tree-'+table.name" v-model="dataForm[table.name+'_code']"
										check-strictly lazy node-key="code" size="large" style="width: 100%;"
										:load="(node, resolve) => {return loadTreeSelect(node, resolve, table.key)}"
										:props="{label: 'name',children: 'children',isLeaf: 'isLeaf'}"
										:cache-data="dataForm[table.name]" empty-text="暂无数据">
										<template #default="{ data }">
											{{ data.name }}
										</template>
									</el-tree-select>
								</uni-forms-item>
							</template>
						</el-col>
					</template>
				</el-row>
			</uni-forms>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">关闭</el-button>
					<el-button type="primary" @click="batchUpdate()">修改</el-button>
				</span>
			</template>
		</el-dialog>
	</view>
</template>

<script>
	import {
		useStore
	} from '@/stores/index'
	import {
		mapState,
		mapActions
	} from 'pinia'
	import {
		ElMessage
	} from 'element-plus'
	export default {
		name: "batch-update",
		computed: {
			...mapState(useStore, ['user'])
		},
		data() {
			return {
				dialogVisible: false,
				loading: false,
				ids: [],
				dataForm: {}
			};
		},
		props: {
			mid: {
				type: String,
				default: null
			},
			table_json: {
				type: Array,
				default: () => []
			},
			getList: {
				type: Function,
				default: null
			}
		},
		mounted() {

		},
		methods: {
			...mapActions(useStore, ['getDict', 'getObject', 'remoteObject']),
			//显示批量修改
			showBatchUpdate(ids) {
				this.ids = ids
				this.dialogVisible = true
			},
			//判断是否有权限
			checkRole(roles) {
				if (roles.length == 0) {
					return false
				}
				if (this.user && this.user.roles.includes('super')) {
					return true
				}
				let flag = false
				for (let i = 0; i < roles.length; i++) {
					if (this.user && this.user.roles.includes(roles[i])) {
						flag = true
						break
					}
				}
				return flag
			},
			//加载树型数据
			loadTreeSelect(node, resolve, key) {
				let pid = 0
				if (node.data.id) {
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
			//批量修改
			batchUpdate() {
				//判断对象是否为空
				let flag = false
				let submitData = JSON.parse(JSON.stringify(this.dataForm))
				for (var key in submitData) {
					if (submitData[key] && submitData[key].length > 0) {
						flag = true
					}else{
						//移除
						delete submitData[key]
					}
				}
				if (flag && !this.loading) {
					for (let i = 0; i < this.table_json.length; i++) {
						let item = this.table_json[i]
						if(item.batch_update){
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
					this.loading = true
					uni.showLoading({
						title: '正在修改'
					})
					this.$http.post("/core/batchUpdate", {
						"data": {...submitData, ...{"ids": this.ids}},
						"header": {
							"Mid": this.mid
						}
					}).then(res => {
						this.loading = false
						uni.hideLoading()
						if (res.code == 20000) {
							this.dataForm = {}
							ElMessage.success("修改成功")
							this.dialogVisible = false
							this.getList()
						} else {
							ElMessage.error(res.message)
						}
					})
				}else{
					ElMessage.warning("请选择")
				}
			}
		}
	}
</script>

<style>

</style>