<template>
	<page ref="page">
		<view class="filter-container d-flex">
			<view class="filter-item d-flex">
				<el-input v-model="listQuery.searchKey" placeholder="综合查询" clearable />
			</view>
			<view class="filter-item">
				<el-button type="primary" @click="search()">查询</el-button>
			</view>
			<view class="filter-item">
				<el-button type="primary" @click="$refs.page.toPage('/pages/module/aore')">新增</el-button>
			</view>
			<view class="filter-item">
				<el-button type="danger" @click="$refs.page.toPage('/pages/module/addM')">新增模块</el-button>
			</view>
		</view>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column fixed prop="mid" label="模块ID" width="180" align="center" />
			<el-table-column prop="name" label="模块名称" width="180" align="center" />
			<el-table-column prop="cache" label="ID创建规则" width="120" align="center">
				<template #default="scope">
					<view v-if="scope.row.id_rule == 1">ObjectId</view>
					<view v-else-if="scope.row.id_rule == 2">自增ID</view>
				</template>
			</el-table-column>
			<el-table-column prop="cache" label="数据缓存" width="120" align="center">
				<template #default="scope">
					<view v-if="scope.row.cache == 1" style="color: green;">使用</view>
					<view v-else>弃用</view>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="cache" label="日志追溯" width="120" align="center">
				<template #default="scope">
					<view v-if="scope.row.retrace == 1" style="color: green;">使用</view>
					<view v-else>弃用</view>
				</template>
			</el-table-column> -->
			<el-table-column label="激活接口" align="center" min-width="450">
				<template #default="scope">
					<view>{{showApis(scope.row.api_json)}}</view>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="180" align="center">
				<template #default="scope">
					<el-button link size="small" type="primary" @click="$refs.page.toPage('/pages/module/aore', scope.row)">编辑</el-button>
					<el-button link size="small" type="danger" @click="deleteItem(scope.row.id)">删除</el-button>
					<el-button link size="small" type="warning" @click="copy(scope.row)">复制模块</el-button>
				</template>
			</el-table-column>
		</el-table>
		<view class="d-flex" style="padding: 10px 0;">
			<uni-pagination show-icon show-page-size
				:pageSizeRange="[10, 50, 100, 500]"
				:page-size="listQuery.pageSize" 
				:current="listQuery.currentPage"
				:total="total"
				@change="handleCurrentChange"
				@pageSizeChange="handleSizeChange" />
		</view>
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
				tableData: [],
				total: 0,
				listLoading: true,
				listQuery: {
					currentPage: 1,
					pageSize: 10,
					searchKey: null
				},
			}
		},
		onReady() {
			this.$nextTick(async () => {
				await this.init()
			})
		},
		methods: {
			//初始化
			async init() {
				await this.$refs.page.init()
				this.getList()
			},
			//查询
			search(){
				this.listQuery.currentPage = 1
				this.getList()
			},
			//获取列表
			getList() {
				this.listLoading = true
				this.$http.post("/module/list", {data: this.listQuery, header: {'Mid': 'Module'}}).then(res => {
					this.listLoading = false
					this.tableData = res.data.results
					this.total = res.data.total
				})
			},
			handleSizeChange(pageSize){
				this.listQuery.pageSize = pageSize
				this.getList()
			},
			handleCurrentChange(e){
				this.listQuery.currentPage = e.current
				this.getList()
			},
			//显示激活接口列表
			showApis(apis){
				let apiList = []
				for(let i=0;i<apis.length;i++){
					apiList.push(apis[i].name)
				}
				if(apiList.length>0){
					return apiList.join("、");
				}else {
					return "--";
				}
			},
			//删除数据
			deleteItem(id){
				uni.showModal({
					title: "提示",
					content: "是否删除该数据？",
					success: (r) => {
						if(r.confirm){
							uni.showLoading({
								title: '正在删除'
							})
							this.$http.post("/module/delete", {data: {"id": id}, header: {'Mid': 'Module'}}).then(res => {
								uni.hideLoading()
								if(res.code == 20000){
									ElMessage.success("删除成功")
									this.getList()
								}else{
									ElMessage.error(res.message)
								}
							})
						}
					}
				})
			},
			//复制模块
			copy(item){
				let code = JSON.parse(JSON.stringify(item))
				//删除多余字段
				delete code["id"]
				//复制代码
				uni.setClipboardData({
					data: JSON.stringify(code)
				});
			},
		}
	}
</script>

<style>

</style>
