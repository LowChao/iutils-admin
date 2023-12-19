<template>
	<page ref="page">
		<template v-if="module">
			<view class="filter-condition" v-if="$refs.page.showQuery">
				<el-row :gutter="20">
					<template v-for="(table, tableIndex) in module.table_json" :key="tableIndex">
						<template v-if="table.show && table.single_query">
							<el-col :xs="24" :sm="12" :md="8" :lg="6">
								<view class="filter-item d-flex">
									<view class="fs14 filter-label">{{table.remarks}}</view>
									<template v-if="table.type==1" i="字符串">
										<el-input v-model="listQuery[table.name]" placeholder="请输入"
											clearable />
									</template>
									<template v-else-if="table.type==4" i="字典多选">
										<el-select v-model="listQuery[table.name]" multiple collapse-tags clearable
											style="width: 100%;" placeholder="请选择">
											<el-option v-for="item in getDict(table.key)" :key="item.value"
												:label="item.text" :value="item.value">
											</el-option>
										</el-select>
									</template>
									<template v-else-if="table.type==5" i="字典单选">
										<el-select v-model="listQuery[table.name]" clearable style="width: 100%;"
											placeholder="请选择">
											<el-option v-for="item in getDict(table.key)" :key="item.value"
												:label="item.text" :value="item.value">
											</el-option>
										</el-select>
									</template>
									<template v-else-if="table.type==9" i="对象单选">
										<el-select v-model="listQuery[table.name]" clearable filterable remote remote-show-suffix :remote-method="(query) => {return remoteObject(query, table.key)}" 
											style="width: 100%;" placeholder="请选择">
											<el-option v-for="item in getObject(table.key)" :key="item.code?item.code:item.id"
												:label="item.name" :value="item.code?item.code:item.id">
											</el-option>
										</el-select>
									</template>
									<template v-else-if="table.type==19" i="对象多选">
										<el-select v-model="listQuery[table.name]" multiple filterable remote remote-show-suffix :remote-method="(query) => {return remoteObject(query, table.key)}" collapse-tags clearable
											style="width: 100%;" placeholder="请选择)">
											<el-option v-for="item in getObject(table.key)" :key="item.code?item.code:item.id"
												:label="item.name" :value="item.code?item.code:item.id">
											</el-option>
										</el-select>
									</template>
								</view>
							</el-col>
						</template>
					</template>
				</el-row>
			</view>
			<view class="filter-container d-flex">
				<view class="filter-item d-flex">
					<el-input v-model="listQuery.searchKey" placeholder="综合查询" clearable />
				</view>
				<template v-for="(btn, btnIndex) in module.btn_json" :key="'btn-'+btnIndex">
					<view class="filter-item" v-if="btn.position==1">
						<template v-if="btn.color && btn.color.indexOf('#')>-1">
							<el-button :color="btn.color" @click="$refs.page.evalFunc(btn.func)">{{btn.name}}</el-button>
						</template>
						<template v-else>
							<el-button :type="btn.color || 'primary'"
								@click="$refs.page.evalFunc(btn.func)">{{btn.name}}</el-button>
						</template>
					</view>
				</template>
			</view>
			<el-table ref="table" v-loading="listLoading" :data="tableData" border row-key="id" lazy :load="loadTree"
				:tree-props="{children: 'children', hasChildren: 'hasChildren'}" :empty-text="暂无数据"
				style="width: 100%">
				<template v-for="(table, tableIndex) in module.table_json" :key="'table-'+tableIndex">
					<el-table-column :prop="table.name" :label="table.remarks" :fixed="table.lock?true:false"
						min-width="170px" :align="tableIndex==0?'left':'center'" v-if="table.show">
						<template #default="scope">
							<template v-if="table.type==2 || table.type==3" i="整型/浮点型">
								{{scope.row[table.name]}}
							</template>
							<template v-else-if="table.type==4" i="字典列表">
								{{ showDicts(table.key, scope.row[table.name]) }}
							</template>
							<template v-else-if="table.type==5" i="字典">
								<rich-text :nodes="showDict(table.key, scope.row[table.name])"></rich-text>
							</template>
							<template v-else-if="table.type==7 || table.type==8" i="文本/富文本">
								{{$refs.page.ellipsis(scope.row[table.name], 30)}}
							</template>
							<template v-else-if="table.type==9" i="对象">
								{{$refs.page.showObject(scope.row[table.name])}}
							</template>
							<template v-else-if="table.type==19" i="对象列表">
								{{$refs.page.showObjects(scope.row[table.name])}}
							</template>
							<template v-else-if="table.type==11" i="图标">
								<el-icon v-if="scope.row[table.name] && scope.row[table.name]!='#'" :size="20">
									<component :is="scope.row[table.name]"></component>
								</el-icon>
								<text v-else>--</text>
							</template>
							<template v-else-if="table.type==15" i="时间戳" class="d-flex-center">
								{{$refs.page.formatDate(scope.row[table.name], 'yyyy/MM/dd HH:mm:ss')}}
							</template>
							<template v-else-if="table.type==16" i="日期">
								{{$refs.page.formatDate(scope.row[table.name], 'yyyy/MM/dd')}}
							</template>
							<template v-else>{{scope.row[table.name] || "--"}}</template>
						</template>
					</el-table-column>
				</template>

				<el-table-column fixed="right" label="操作" width="180" align="center" v-if="$refs.page.showOperate">
					<template #default="scope">
						<template v-for="(btn, btnIndex) in module.btn_json" :key="'btn-'+btnIndex">
							<template v-if="btn.position==2">
								<el-button link size="small" :type="btn.color || 'primary'"
									@click="$refs.page.evalFunc(btn.func, scope.row)">{{btn.name}}</el-button>
							</template>
						</template>
					</template>
				</el-table-column>
			</el-table>
		</template>
	</page>
</template>

<script>
	import Page from '@/pages/common/page.vue'
	import { ElMessage } from 'element-plus'
	import { useStore } from '@/stores/index'
	import { mapState, mapActions } from 'pinia'
	export default {
		components: {
			Page
		},
		computed: {
			...mapState(useStore, ['user'])
		},
		data() {
			return {
				mid: null, //模块ID
				module: null, //模块
				tree: new Map(),
				tableData: [],
				listLoading: true,
				listQuery: {
					pid: 0,
					searchKey: null
				}
			}
		},
		onLoad(options) {
			this.mid = options.mid
		},
		onReady() {
			this.$nextTick(async () => {
				//初始化
				await this.init()
			})
		},
		methods: {
			...mapActions(useStore, ['getDict', 'getObject', 'showDict', 'showDicts', 'remoteObject']),
			//初始化
			async init() {
				//获取模块信息
				await this.$refs.page.getModule(this.mid)
				this.module = this.$refs.page.module
				//获取列表
				this.getList()
			},
			//查询
			search() {
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
				this.$http.post("/core/getList", {
					data: this.listQuery,
					header: {
						'Mid': this.mid
					}
				}).then(res => {
					this.listLoading = false
					this.tableData = res.data.map((item) => {
						return {
							...item,
							hasChildren: true
						}
					})
				})
			},
			//加载树
			loadTree(row, treeNode, resolve) {
				if (treeNode) {
					this.$http.post("/core/getList", {
						data: {
							pid: row.id
						},
						header: {
							'Mid': this.mid
						}
					}).then(res => {
						resolve(res.data.map((item) => {
							return {
								...item,
								hasChildren: true
							}
						}))
						this.tree.set(row.id, {
							row,
							treeNode,
							resolve
						})
					})
				}
			},
			//刷新树数据
			refreshLoadTree(pid) {
				if (pid == 0) {
					this.getList()
				} else {
					const {
						row,
						treeNode,
						resolve
					} = this.tree.get(pid)
					this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pid, [])
					if (row) {
						this.loadTree(row, treeNode, resolve)
					}
				}
			},
			//复制
			copy(text) {
				if (text) {
					uni.setClipboardData({
						data: text
					})
				} else {
					ElMessage.error("内容为空")
				}
			},
			//删除数据
			deleteItem(item) {
				uni.showModal({
					title: "提示",
					content: "是否删除该数据",
					success: (r) => {
						if (r.confirm) {
							uni.showLoading({
								title: "正在删除"
							})
							this.$http.post("/core/recursionDelete", {
								'data': {
									"id": item.id
								},
								'header': {
									'Mid': this.mid
								}
							}).then(res => {
								uni.hideLoading()
								if (res.code == 20000) {
									ElMessage.success("删除成功")
									this.refreshLoadTree(item.pid)
								} else {
									ElMessage.error(res.message)
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style>

</style>