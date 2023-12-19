<template>
	<view>
		<el-button link size="small" type="primary" @click="dialogVisible = true">查看列表</el-button>
		<el-dialog v-model="dialogVisible" title="查看列表" width="750px" append-to-body>
			<view class="table">
				<view class="th">
					<template v-for="(subTable, subTableIndex) in table_json" :key="subTableIndex">
						<view class="td d-flex-center flex1">{{subTable.remarks}}</view>
					</template>
				</view>
				<template v-for="(element, index) in tableList" :key="index">
					<view class="tr">
						<template v-for="(subTable, subTableIndex) in table_json" :key="subTableIndex">
							<view class="td d-flex-center flex1" v-if="subTable.type==4">
								{{showDicts(subTable.key, element[subTable.name])}}
							</view>
							<view class="td d-flex-center flex1" v-if="subTable.type==5">
								{{showDict(subTable.key, element[subTable.name])}}
							</view>
							<view class="td d-flex-center flex1" v-else>
								{{element[subTable.name]}}
							</view>
						</template>
					</view>
				</template>
			</view>
		</el-dialog>
	</view>
</template>

<script>
	import {
		useStore
	} from '@/stores/index'
	import {
		mapActions
	} from 'pinia'
	export default {
		name: "dialog-table",
		data() {
			return {
				dialogVisible: false
			};
		},
		props: {
			table_json: {
				type: Array,
				default: () => []
			},
			tableList: {
				type: Array,
				default: () => []
			}
		},
		methods: {
			...mapActions(useStore, ['showDict', 'showDicts']),
		}
	}
</script>

<style>

</style>