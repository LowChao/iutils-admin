<template>
	<view>
		<view class="table">
			<view class="th">
				<template v-for="(subTable, subTableIndex) in table_json"
					:key="subTableIndex">
					<view class="td d-flex-center flex1">{{subTable.remarks}}</view>
				</template>
				<view class="td d-flex-center" style="width: 80px;">操作</view>
			</view>
			<draggable v-model="list" group="tablekey" animation="300"
				item-key="id">
				<template #item="{element, index}">
					<view class="tr move">
						<template v-for="(subTable, subTableIndex) in table_json"
							:key="subTableIndex">
							<view class="td d-flex-center flex1"
								v-if="subTable.type==4">
								<el-select v-model="element[subTable.name]" multiple
									collapse-tags clearable size="large"
									style="width: 100%;">
									<el-option
										v-for="item in getDict(subTable.key)"
										:key="item.value" :label="item.text"
										:value="item.value">
									</el-option>
								</el-select>
							</view>
							<view class="td d-flex-center flex1"
								v-if="subTable.type==5">
								<el-select v-model="element[subTable.name]" clearable
									size="large" style="width: 100%;">
									<el-option
										v-for="item in getDict(subTable.key)"
										:key="item.value" :label="item.text"
										:value="item.value">
									</el-option>
								</el-select>
							</view>
							<view class="td d-flex-center flex1" v-else>
								<uni-easyinput type="text" trim="both"
									v-model="element[subTable.name]"
									:clearable="false" />
							</view>
						</template>
						<view class="td d-flex-center" style="width: 80px;">
							<uni-icons class="pointer" type="trash" size="20"
								color="red"
								@click="delSubtable(index)"></uni-icons>
						</view>
					</view>
				</template>
			</draggable>
		</view>
		<view style="padding-top: 5px;text-align: right;">
			<uni-tag text="新增" @click="addSubtable()"></uni-tag>
		</view>
	</view>
</template>

<script>
	import { useStore } from '@/stores/index'
	import { mapActions } from 'pinia'
	import draggable from 'vuedraggable'
	export default {
		components: {
			draggable
		},
		name:"sub-table",
		data() {
			return {
				list: []
			};
		},
		props: {
			table_json: {
			  type: Array,
			  default: () => []
			},
			tableList:  {
			  type: Array,
			  default: () => []
			}
		},
		mounted() {
		  this.list = this.tableList
		},
		watch:{
			list(newValue, oldValue){
				this.$emit('update:tableList', newValue)
			}
		},
		methods: {
			...mapActions(useStore, ['getDict']),
			//新增子表
			addSubtable() {
				let obj = {}
				for (let i = 0; i < this.table_json.length; i++) {
					let item = this.table_json[i]
					obj[item.name] = null
				}
				this.list.push(obj)
			},
			//删除子表
			delSubtable(index) {
				this.list.splice(index, 1)
			},
		}
	}
</script>

<style>

</style>