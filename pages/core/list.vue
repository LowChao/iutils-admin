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
											style="width: 100%;" placeholder="请选择">
											<el-option v-for="item in getObject(table.key)" :key="item.code?item.code:item.id"
												:label="item.name" :value="item.code?item.code:item.id">
											</el-option>
										</el-select>
									</template>
									<template v-else-if="table.type==10" i="树型数据">
										<el-tree-select v-model="listQuery[table.name]" check-strictly lazy node-key="code"
											style="width: 100%;" clearable
											:load="(node, resolve) => {return $refs.page.loadTreeSelect(node, resolve, table.key)}"
											:props="{label: 'name',children: 'children',isLeaf: 'isLeaf'}"
											empty-text="暂无数据"
											placeholder="请选择">
											<template #default="{ data }">
												{{ data.name }}
											</template>
										</el-tree-select>
									</template>
									<template v-else-if="table.type==15 || table.type==16" i="日期">
										<el-date-picker
											v-model="listQuery[table.name]"
											type="daterange"
											range-separator="-"
											start-placeholder="开始日期"
											end-placeholder="结束日期"
											value-format="YYYY-MM-DD"></el-date-picker>
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
					<view class="filter-item" v-if="btn.position==1 && $refs.page.checkRole(btn.roles)">
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
			<el-table ref="table" v-loading="listLoading" :data="tableData" border
				@selection-change="handleSelectionChange" @sort-change="handleSortChange" empty-text="暂无数据"
				style="width: 100%">
				<el-table-column v-if="$refs.page.showSelection" type="selection" width="55" />
				<template v-for="(table, tableIndex) in module.table_json" :key="'table-'+tableIndex">
					<el-table-column :prop="table.name" :label="table.remarks" :fixed="table.lock?true:false"
						min-width="170px" align="center" :sortable="table.sort?'custom':false" v-if="table.show">
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
							<template v-else-if="table.type==6" i="单图片">
								<image v-if="scope.row[table.name]" @click="$refs.page.showImage([params.FileUrl+scope.row[table.name]], 0)" :src="params.FileUrl+scope.row[table.name]" mode="aspectFit" class="table-image pointer"></image>
								<text v-else>--</text>
							</template>
							<template v-else-if="table.type==12" i="图片列表">
								<view v-if="scope.row[table.name]">
									<image v-for="(pic, picIndex) in scope.row[table.name]" :key="picIndex" @click="$refs.page.showImage(scope.row[table.name].map(picUrl => params.FileUrl+picUrl), picIndex)" :src="params.FileUrl+pic" mode="aspectFit" class="table-image pointer"></image>
								</view>
								<text v-else>--</text>
							</template>
							<template v-else-if="table.type==7" i="文本">
								<text :title="scope.row[table.name]">{{$refs.page.ellipsis(scope.row[table.name], 30)}}</text>
							</template>
							<template v-else-if="table.type==8" i="富文本">
								<dialog-html :html="scope.row[table.name]"></dialog-html>
							</template>
							<template v-else-if="table.type==9" i="对象">
								{{$refs.page.showObject(scope.row[table.name])}}
							</template>
							<template v-else-if="table.type==19" i="对象列表">
								{{$refs.page.showObjects(scope.row[table.name])}}
							</template>
							<template v-else-if="table.type==10" i="树型数据">
								{{$refs.page.showTree(scope.row[table.name])}}
							</template>
							<template v-else-if="table.type==11" i="图标">
								<el-icon v-if="scope.row[table.name]" :size="24">
									<component :is="scope.row[table.name]"></component>
								</el-icon>
								<text v-else>--</text>
							</template>
							<template v-else-if="table.type==13" i="单文件">
								<uni-link :href="params.FileUrl+scope.row[table.name]" :text="scope.row[table.name]"></uni-link>
							</template>
							<template v-else-if="table.type==14" i="文件列表">
								<view v-if="scope.row[table.name]">
									<view v-for="(file, fileIndex) in scope.row[table.name]" :key="fileIndex">
										{{fileIndex+1}}、<uni-link :href="params.FileUrl+file" :text="file"></uni-link>
									</view>
								</view>
								<text v-else>--</text>
							</template>
							<template v-else-if="table.type==15" i="时间戳" class="d-flex-center">
								{{$refs.page.formatDate(scope.row[table.name], 'yyyy/MM/dd HH:mm:ss')}}
							</template>
							<template v-else-if="table.type==16" i="日期">
								{{$refs.page.formatDate(scope.row[table.name], 'yyyy/MM/dd')}}
							</template>
							<template v-else-if="table.type==17" i="子表">
								<dialog-table :table_json="table.subtable.table_json" :table-list="scope.row[table.name]"></dialog-table>
							</template>
							<template v-else>{{scope.row[table.name] || "--"}}</template>
						</template>
					</el-table-column>
				</template>

				<el-table-column fixed="right" label="操作" width="180" align="center" v-if="$refs.page.showOperate">
					<template #default="scope">
						<template v-for="(btn, btnIndex) in module.btn_json" :key="'btn-'+btnIndex">
							<template v-if="btn.position==2 && $refs.page.checkRole(btn.roles)">
								<el-button link size="small" :type="btn.color || 'primary'"
									@click="$refs.page.evalFunc(btn.func, scope.row)">{{btn.name}}</el-button>
							</template>
						</template>
					</template>
				</el-table-column>
			</el-table>
			<view class="d-flex" style="padding: 10px 0;">
				<uni-pagination show-icon show-page-size :page-size="listQuery.pageSize"
					:pageSizeRange="[10, 50, 100, 500]"
					:current="listQuery.currentPage" :total="total" @change="handleCurrentChange"
					@pageSizeChange="handleSizeChange" />
			</view>
			
			<!-- 批量修改弹出 -->
			<batch-update ref="batchUpdate" :mid="module.mid" :table_json="module.table_json" :get-list="getList"></batch-update>
		</template>
	</page>
</template>

<script>
	import Page from '@/pages/common/page.vue'
	import BatchUpdate from '@/components/batch-update/batch-update.vue'
	import DialogTable from '@/components/dialog-table/dialog-table.vue'
	import DialogHtml from '@/components/dialog-html/dialog-html.vue'
	import { ElMessage } from 'element-plus'
	import { useStore } from '@/stores/index'
	import { mapState, mapActions } from 'pinia'
	export default {
		components: {
			Page,
			BatchUpdate,
			DialogTable,
			DialogHtml
		},
		computed: {
			...mapState(useStore, ['user', 'params'])
		},
		data() {
			return {
				mid: null, //模块ID
				module: null,
				labelWidth: null,
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 10,
					sortField: "_id",
					sortOrder: "descending",
					searchKey: null
				},
				selectionItems: [], //多选选中项
			}
		},
		onLoad(options) {
			this.mid = options.mid
			if(options.labelWidth){
				this.labelWidth = options.labelWidth
			}
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
				this.listQuery.currentPage = 1
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
				this.$http.post("/core/list", {
					data: this.listQuery,
					header: {
						'Mid': this.mid
					}
				}).then(res => {
					this.listLoading = false
					this.tableData = res.data.results
					this.total = res.data.total
				})
			},
			handleSizeChange(pageSize) {
				this.listQuery.pageSize = pageSize
				this.getList()
			},
			handleCurrentChange(e) {
				this.listQuery.currentPage = e.current
				this.getList()
			},
			//多选
			handleSelectionChange(items) {
				this.selectionItems = items
			},
			//排序
			handleSortChange(column) {
				if (column.order) {
					this.listQuery.sortField = column.prop
					this.listQuery.sortOrder = column.order
					this.search()
				}
			},
			//删除数据
			deleteItem(id) {
				uni.showModal({
					title: "提示",
					content: "是否删除该数据",
					success: (r) => {
						if (r.confirm) {
							uni.showLoading({
								title: "正在删除"
							})
							this.$http.post("/core/delete", {
								'data': {
									"id": id
								},
								'header': {
									'Mid': this.mid
								}
							}).then(res => {
								uni.hideLoading()
								if (res.code == 20000) {
									ElMessage.success("删除成功")
									this.getList()
								} else {
									ElMessage.error(res.message)
								}
							})
						}
					}
				})
			},
			//批量删除
			batchDelete() {
				if (this.selectionItems.length > 0) {
					uni.showModal({
						title: "提示",
						content: "是否批量删除数据",
						success: (r) => {
							if (r.confirm) {
								let ids = this.selectionItems.map(item => item.id)
								uni.showLoading({
									title: "正在删除"
								})
								this.$http.post("/core/batchDelete", {
									'data': {
										"ids": ids
									},
									'header': {
										'Mid': this.mid
									}
								}).then(res => {
									uni.hideLoading()
									if (res.code == 20000) {
										ElMessage.success("删除成功")
										this.getList()
									} else {
										ElMessage.error(res.message)
									}
								})
							}
						}
					})
				} else {
					ElMessage.info("请勾选数据")
				}
			},
			//批量修改
			batchUpdate(){
				if (this.selectionItems.length > 0) {
					let ids = this.selectionItems.map(item => item.id)
					this.$refs.batchUpdate.showBatchUpdate(ids)
				} else {
					ElMessage.info("请勾选数据")
				}
			}
		}
	}
</script>

<style lang="scss">
	.table-image{
		width: 60px;
		height: 60px;
		border-radius: 5px;
		margin-right: 5px;
	}
</style>