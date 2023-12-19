<template>
	<page ref="page">
		<el-page-header icon="ArrowLeft" @back="$back()">
			<template #title>返回</template>
			<template #content>
				<view class="page-header-title">{{isEdit?'编辑模块':'新增模块'}}</view>
			</template>
			<view style="padding: 10px;">
				<uni-forms ref="form" :modelValue="dataForm" :rules="rules" label-position="top" label-width="200">
					<el-row :gutter="50">
						<el-col :span="6">
							<uni-forms-item label="模块ID" name="mid" required>
								<uni-easyinput type="text" trim="both" v-model="dataForm.mid" />
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="模块名称" name="name" required>
								<uni-easyinput type="text" trim="both" v-model="dataForm.name" />
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="ID创建规则" name="id_rule" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.id_rule"
										:localdata="datas.id_rule_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="数据缓存" name="cache" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.cache"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
						<!-- <el-col :span="5">
							<uni-forms-item label="日志追溯" name="retrace" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.retrace"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col> -->
						<el-col :span="6">
							<uni-forms-item label="创建时间(add_time)" name="add_time" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.add_time"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="修改时间(update_time)" name="update_time" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.update_time"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="创建人(add_user)" name="add_user" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.add_user"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
						<el-col :span="6">
							<uni-forms-item label="修改人(update_user)" name="update_user" required>
								<view class="box d-flex" style="height: 100%;padding-left: 10px;">
									<uni-data-checkbox v-model="dataForm.update_user"
										:localdata="datas.use_status_json"></uni-data-checkbox>
								</view>
							</uni-forms-item>
						</el-col>
					</el-row>
					<uni-forms-item label="字段管理" name="table_json" required>
						<view class="table">
							<view class="th">
								<view class="td d-flex-center" style="width: 160px;">字段</view>
								<view class="td d-flex-center" style="width: 160px;">类型</view>
								<view class="td d-flex-center" style="width: 160px;">备注</view>
								<view class="td d-flex-center" style="width: 100px;">默认值</view>
								<view class="td d-flex-center" style="width: 160px;">绑定对象</view>
								<view class="td d-flex-center" style="width: 80px;">表格显示</view>
								<view class="td d-flex-center" style="width: 80px;">是否编辑</view>
								<view class="td d-flex-center" style="width: 80px;">是否必填</view>
								<view class="td d-flex-center" style="width: 80px;">操作</view>
							</view>
							<draggable v-model="table_json" group="table" animation="300" item-key="id">
								<template #item="{element, index}">
									<view class="tr move">
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" trim="both" v-model="element.name"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 160px;">
											<el-select v-model="element.type" size="large">
												<el-option v-for="item in datas.field_type_json" :key="item.value"
													:label="item.text" :value="item.value">
													<span style="float: left">{{ item.text }}</span>
													<span style="float: right;">{{ item.notes }}</span>
												</el-option>
											</el-select>
										</view>
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" trim="both" v-model="element.remarks"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 100px;">
											<uni-easyinput type="text" trim="both" v-model="element.default"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" trim="both" v-model="element.key"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<switch @change="switchRadio($event, element.name, 'show')" :checked="element.show"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<switch @change="switchRadio($event, element.name, 'edit')" :checked="element.edit"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<switch @change="switchRadio($event, element.name, 'must')" :checked="element.must"
												style="transform:scale(0.6)" />
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<view style="margin: 0 2px;">
												<uni-icons class="pointer" type="plusempty" size="18" color="#007aff"
													@click="addField(index)"></uni-icons>
											</view>
											<view style="margin: 0 2px;">
												<uni-icons class="pointer" type="settings" size="20" color="#007aff"
													@click="updateField(index)"></uni-icons>
											</view>
											<view style="margin: 0 2px;">
												<uni-icons class="pointer" type="trash" size="20" color="red"
													@click="delField(index)"></uni-icons>
											</view>
										</view>
									</view>
								</template>
							</draggable>
						</view>
						<view style="padding-top: 5px;text-align: right;">
							<uni-tag text="新增字段" @click="addField(-1)"></uni-tag>
						</view>
					</uni-forms-item>
					<uni-forms-item label="按钮管理" name="btn_json" required>
						<view class="table">
							<view class="th">
								<view class="td d-flex-center" style="width: 120px;">按钮位置</view>
								<view class="td d-flex-center" style="width: 160px;">按钮名称</view>
								<view class="td d-flex-center" style="width: 100px;">按钮颜色</view>
								<view class="td d-flex-center" style="width: 160px;">执行方法</view>
								<view class="td d-flex-center flex1">限制角色使用</view>
								<view class="td d-flex-center" style="width: 80px;">操作</view>
							</view>
							<draggable v-model="btn_json" group="btn" animation="300" item-key="id">
								<template #item="{element, index}">
									<view class="tr move">
										<view class="td d-flex-center" style="width: 120px;">
											<el-select v-model="element.position" size="large">
												<el-option v-for="item in datas.btn_position_json" :key="item.value"
													:label="item.text" :value="item.value">
												</el-option>
											</el-select>
										</view>
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" trim="both" v-model="element.name"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 100px;">
											<uni-easyinput type="text" trim="both" v-model="element.color"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" suffixIcon="compose" trim="both"
												v-model="element.func" @iconClick="editFunc(index)"
												:clearable="false" />
										</view>
										<view class="td d-flex-center flex1">
											<uni-data-checkbox multiple v-model="element.roles" :localdata="roles"
												:map="{text: 'name', value: 'code'}"></uni-data-checkbox>
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<uni-icons class="pointer" type="trash" size="20" color="red"
												@click="delBtn(index)"></uni-icons>
										</view>
									</view>
								</template>
							</draggable>
						</view>
						<view style="padding-top: 5px;text-align: right;">
							<uni-tag text="新增按钮" @click="addBtn()"></uni-tag>
						</view>
					</uni-forms-item>
					<uni-forms-item label="接口管理" name="api_json" required>
						<view class="table">
							<view class="th">
								<view class="td d-flex-center" style="width: 160px;">接口名称</view>
								<view class="td d-flex-center" style="width: 300px;">接口地址</view>
								<view class="td d-flex-center flex1">限制角色使用</view>
								<view class="td d-flex-center" style="width: 80px;">操作</view>
							</view>
							<draggable v-model="api_json" group="api" animation="300" item-key="id">
								<template #item="{element, index}">
									<view class="tr move">
										<view class="td d-flex-center" style="width: 160px;">
											<uni-easyinput type="text" trim="both" v-model="element.name"
												:clearable="false" />
										</view>
										<view class="td d-flex-center" style="width: 300px;">
											<uni-easyinput type="text" trim="both" v-model="element.url"
												:clearable="false" />
										</view>
										<view class="td d-flex-center flex1">
											<uni-data-checkbox multiple v-model="element.roles" :localdata="roles"
												:map="{text: 'name', value: 'code'}"></uni-data-checkbox>
										</view>
										<view class="td d-flex-center" style="width: 80px;">
											<uni-icons class="pointer" type="trash" size="20" color="red"
												@click="delApi(index)"></uni-icons>
										</view>
									</view>
								</template>
							</draggable>
						</view>
						<view style="padding-top: 5px;text-align: right;">
							<uni-tag text="新增接口" @click="addApi()"></uni-tag>
						</view>
					</uni-forms-item>
					<uni-forms-item label="导入规则" name="import_rule" required>
						<view class="table">
							<view class="th">
								<view class="td d-flex-center" style="min-width: 160px;">规则名称</view>
								<view class="td d-flex-center flex1">规则内容</view>
							</view>
							<view class="tr">
								<view class="td d-flex-center" style="min-width: 160px;">需导入的字段</view>
								<view class="td d-flex flex-wrap">
									<uni-data-checkbox multiple v-model="dataForm.import_rule.fields"
										:localdata="showFieldList()"></uni-data-checkbox>
								</view>
							</view>
							<view class="tr" v-for="(item, index) in dataForm.import_rule.rules" :key="index">
								<view class="td d-flex-center" style="min-width: 160px;">导入规则{{index+1}}</view>
								<view class="td d-flex flex1">
									<view class="d-flex flex-row">
										<view class="d-flex"
											style="background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
											<view>开始行:</view>
											<input v-model="item.start_row"
												style="text-align: left;padding: 0 5px;width: 80px;" />
										</view>
										<view class="d-flex"
											style="margin-left: 10px;background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
											<view>结束行:</view>
											<input v-model="item.end_row"
												style="text-align: left;padding: 0 5px;width: 80px;" />
										</view>
										<view class="d-flex"
											style="margin-left: 10px;background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
											<view>开始列:</view>
											<input v-model="item.start_col"
												style="text-align: left;padding: 0 5px;width: 80px;" />
										</view>
										<view class="d-flex"
											style="margin-left: 10px;background: #fff;border: 1px solid #ddd;border-radius: 5px;padding: 5px 10px;">
											<view>结束列:</view>
											<input v-model="item.end_col"
												style="text-align: left;padding: 0 5px;width: 80px;" />
										</view>
										<uni-tag v-if="index!=0" text="删除" type="error" @click="delRule(index)"
											style="margin-left: 10px;"></uni-tag>
									</view>
								</view>
							</view>
						</view>
						<view style="padding-top: 5px;text-align: right;">
							<uni-tag text="新增规则" @click="addRule()"></uni-tag>
						</view>
					</uni-forms-item>
					<uni-forms-item label="导出规则" name="export_rule" required>
						<view class="table">
							<view class="th">
								<view class="td d-flex-center" style="min-width: 160px;">规则名称</view>
								<view class="td d-flex-center flex1">规则内容</view>
							</view>
							<view class="tr">
								<view class="td d-flex-center" style="min-width: 160px;">需导出的字段</view>
								<view class="td d-flex flex-wrap">
									<uni-data-checkbox multiple v-model="dataForm.export_rule.fields"
										:localdata="showFieldList()"></uni-data-checkbox>
								</view>
							</view>
						</view>
					</uni-forms-item>
				</uni-forms>
				<view class="d-flex-center">
					<el-button @click="$back()">返回</el-button>
					<el-button type="primary" :loading="loading" @click="submit">提交</el-button>
				</view>
			</view>
		</el-page-header>

		<uni-popup ref="funcPopup" type="dialog" :mask-click="false" i="编辑执行方法">
			<el-card style="width: 750px;">
				<template #header>
					<view class="d-flex between">
						<view>执行方法</view>
						<el-button type="danger" text @click="hideDialog('funcPopup')">关闭</el-button>
					</view>
				</template>
				<elvis-code height="500px" v-model:code="btn_json[currentIndex].func"></elvis-code>
			</el-card>
		</uni-popup>
		<uni-popup ref="tablePopup" type="center" :mask-click="false" i="编辑字段扩展参数">
			<el-card style="width: 750px;">
				<template #header>
					<view class="d-flex between">
						<view>其他参数配置</view>
						<el-button type="danger" text @click="hideDialog('tablePopup')">关闭</el-button>
					</view>
				</template>
				<view class="table">
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">综合查询</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'query')"
								:checked="table_json[currentIndex].query" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">单独查询</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'single_query')"
								:checked="table_json[currentIndex].single_query" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">排序字段</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'sort')"
								:checked="table_json[currentIndex].sort" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">唯一校验</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'unique')"
								:checked="table_json[currentIndex].unique" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">批量修改</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'batch_update')"
								:checked="table_json[currentIndex].batch_update" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">列锁定</view>
						<view class="td">
							<switch @change="switchRadio($event, table_json[currentIndex].name, 'lock')"
								:checked="table_json[currentIndex].lock" style="transform:scale(0.6)" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">行布局</view>
						<view class="td flex1">
							<uni-easyinput type="text" trim="both" v-model="table_json[currentIndex].span"
								:clearable="false" style="width: 100%;" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">执行方法</view>
						<view class="td flex1">
							<uni-easyinput type="text" trim="both" v-model="table_json[currentIndex].func"
								suffixIcon="compose" @iconClick="editFunc2(currentIndex)"
								:clearable="false" style="width: 100%;" />
						</view>
					</view>
					<view class="tr">
						<view class="td d-flex-center fs14" style="width: 120px;">限制角色使用</view>
						<view class="td flex-wrap">
							<uni-data-checkbox multiple v-model="table_json[currentIndex].roles" :localdata="roles"
								:map="{text: 'name', value: 'code'}"></uni-data-checkbox>
						</view>
					</view>
				</view>
			</el-card>
		</uni-popup>
		<uni-popup ref="func2Popup" type="dialog" :mask-click="false" i="编辑执行方法">
			<el-card style="width: 750px;">
				<template #header>
					<view class="d-flex between">
						<view>执行方法</view>
						<el-button type="danger" text @click="hideDialog('func2Popup')">关闭</el-button>
					</view>
				</template>
				<elvis-code height="500px" v-model:code="table_json[currentIndex].func"></elvis-code>
			</el-card>
		</uni-popup>
	</page>
</template>

<script>
	import Page from '@/pages/common/page.vue'
	import ElvisCode from "@/components/elvis-code/elvis-code.vue"
	import { ElMessage } from 'element-plus'
	import draggable from 'vuedraggable'
	import datas from '@/utils/datas'
	export default {
		components: {
			Page,
			draggable,
			ElvisCode
		},
		data() {
			return {
				isEdit: false, //是否编辑
				datas: null,//数据
				eventChannel: null,
				loading: false,
				dataForm: {
					mid: null,
					name: null,
					id_rule: 1,
					cache: 0,
					retrace: 0,
					add_time: 0,
					update_time: 0,
					add_user: 0,
					update_user: 0,
					table_json: [],
					btn_json: [],
					api_json: [],
					import_rule: {
						fields: [],
						rules: [{
							"start_row": 2,
							"end_row": 0,
							"start_col": 1,
							"end_col": 0
						}]
					},
					export_rule: {
						fields: []
					}
				},
				rules: {
					mid: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					},
					name: {
						rules: [{
							required: true,
							errorMessage: "请输入"
						}]
					}
				},
				roles: [], //角色列表
				table_json: [], //字段列表
				btn_json: [{
						"position": 1,
						"name": "查询",
						"func": "this.$parent.search()",
						"roles": ["admin"],
						"color": "primary"
					},
					{
						"position": 1,
						"name": "新增",
						"func": "this.toPage('/pages/core/aore')",
						"roles": ["admin"],
						"color": "primary"
					},
					{
						"position": 1,
						"name": "批量删除",
						"color": "danger",
						"func": "this.$parent.batchDelete()",
						"roles": ["admin"]
					},
					{
						"position": 2,
						"name": "编辑",
						"func": "this.toPage('/pages/core/aore', item)",
						"roles": ["admin"],
						"color": "primary"
					},
					{
						"position": 2,
						"name": "删除",
						"func": "this.$parent.deleteItem(item.id)",
						"roles": ["admin"],
						"color": "danger"
					}
				], //按钮列表
				api_json: [{
						"name": "分页查询",
						"url": "/core/list",
						"roles": ["admin"]
					},
					{
						"name": "新增",
						"url": "/core/add",
						"roles": ["admin"]
					},
					{
						"name": "编辑",
						"url": "/core/update",
						"roles": ["admin"]
					},
					{
						"name": "删除",
						"url": "/core/delete",
						"roles": ["admin"]
					},
					{
						"name": "批量删除",
						"url": "/core/batchDelete",
						"roles": ["admin"]
					}
				], //接口列表
				currentIndex: 0, //当前操作下标
			}
		},
		onLoad() {
			this.datas = datas
			this.eventChannel = this.getOpenerEventChannel()
			//初始化数据
			this.eventChannel.on('initData', (res) => {
				if (res.data) {
					this.isEdit = true
					this.dataForm = res.data
					this.table_json = JSON.parse(JSON.stringify(this.dataForm.table_json))
					this.btn_json = JSON.parse(JSON.stringify(this.dataForm.btn_json))
					this.api_json = JSON.parse(JSON.stringify(this.dataForm.api_json))
				}
			})
			//获取角色列表
			this.getRoleList()
		},
		onReady() {
			this.$nextTick(async () => {
				await this.$refs.page.init()
			})
		},
		methods: {
			//显示弹出框
			showDialog(id) {
				this.$refs[id].open()
			},
			//关闭弹出框
			hideDialog(id) {
				this.$refs[id].close()
			},
			//弹出修改扩展字段
			updateField(index) {
				this.currentIndex = index
				this.showDialog("tablePopup")
			},
			//弹出修改执行方法
			editFunc(index) {
				this.currentIndex = index
				this.showDialog("funcPopup")
			},
			editFunc2(){
				this.showDialog("func2Popup")
			},
			//显示字段列表
			showFieldList() {
				return this.table_json.map(item => {
					return {
						"text": item.remarks,
						"value": item.name
					}
				})
			},
			//角色列表
			getRoleList() {
				this.$http.post("/role/getList", {
					header: {
						"Mid": "Role"
					}
				}).then(res => {
					if (res.code == 20000) {
						this.roles = res.data
					}
				})
			},
			//新增规则
			addRule() {
				this.dataForm.import_rule.rules.push({
					"start_row": 2,
					"end_row": 0,
					"start_col": 1,
					"end_col": 0
				})
			},
			//删除规则
			delRule(index) {
				this.dataForm.import_rule.rules.splice(index, 1)
			},
			//新增字段
			addField(index) {
				let item = {
					"name": null, //字段名称
					"type": 1, //字段类型
					"remarks": null, //字段备注
					"default": null, //默认值
					"key": null, //绑定对象/字典
					"show": true, //表格显示
					"query": false, //综合查询
					"single_query": false, //单独查询
					"sort": false, //排序字段
					"unique": false, //唯一校验
					"edit": true, //是否编辑
					"must": true, //是否必填
					"batch_update": false,//批量修改
					"lock": false,//列锁定
					"span": 24,//行布局
					"func": null,
					"roles": [] //角色限制
				}
				if(index>-1){
					this.table_json.splice(index+1, 0, item)
				}else{
					this.table_json.push(item)
				}
			},
			//删除字段
			delField(index) {
				this.table_json.splice(index, 1)
			},
			//新增按钮
			addBtn() {
				let item = {
					"position": null,
					"name": null,
					"color": null,
					"func": null,
					"roles": []
				}
				this.btn_json.push(item)
			},
			//删除按钮
			delBtn(index) {
				this.btn_json.splice(index, 1)
			},
			//新增接口
			addApi() {
				let item = {
					"name": null,
					"url": null,
					"roles": []
				}
				this.api_json.push(item)
			},
			//删除接口
			delApi(index) {
				this.api_json.splice(index, 1)
			},
			//是否选中
			switchRadio(e, name, key) {
				for (let i = 0; i < this.table_json.length; i++) {
					if (name == this.table_json[i].name) {
						this.$set(this.table_json[i], key, e.detail.value)
						break
					}
				}
			},
			//提交
			submit() {
				this.$refs.form.validate().then(res => {
					if (!this.loading) {
						this.loading = true
						uni.showLoading({
							title: '正在提交'
						})
						this.dataForm.table_json = this.table_json
						this.dataForm.btn_json = this.btn_json
						this.dataForm.api_json = this.api_json
						this.$http.post(this.isEdit ? "/module/update" : "/module/add", {
							data: this.dataForm,
							header: {
								'Mid': 'Module'
							}
						}).then(res => {
							this.loading = false
							uni.hideLoading()
							if (res.code == 20000) {
								ElMessage.success("提交成功")
								//删除缓存
								sessionStorage.removeItem("MID-" + this.dataForm.mid)
								this.$nextTick(() => {
									this.$back()
									this.eventChannel.emit("updateData", {})
								})
							} else {
								ElMessage.error(res.message)
							}
						})
					}
				}).catch(err => {
					ElMessage.error("还有必填的数据")
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-header-title{
		font-size: 16px;
	}
	.box {
		border: 1px solid #ddd;
		border-radius: 5px;
		padding: 5px 0px;

		.item {
			padding: 5px 0;
			border-top: 1px solid #ddd;
		}
	}
</style>