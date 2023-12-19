<template>
	<view>
		<el-button link size="small" type="primary" @click="dialogVisible = true">预览</el-button>
		<el-dialog v-model="dialogVisible" title="预览" width="500px" append-to-body>
			<rich-text :nodes="html"></rich-text>
		</el-dialog>
	</view>
</template>

<script>
	export default {
		name: "dialog-html",
		data() {
			return {
				dialogVisible: false
			};
		},
		props: {
			html: {
				type: String,
				default: ''
			},
		},
		methods: {

		}
	}
</script>

<style>

</style>