<template>
	<view class="editor—wrapper">
		<link :href="basePath+'/static/css/editorStyle.css'" rel="stylesheet" />
		<Toolbar style="border-bottom: 1px solid #ccc" :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
		<Editor :style="`height: ${height.replace('px', '')}px; overflow-y: hidden;`" v-model="value" :defaultConfig="{
        ...editorConfig,
        MENU_CONF: {
          uploadImage: {
            customBrowseAndUpload: customBrowseAndUploadImage
          },
          uploadVideo: {
            customBrowseAndUpload: customBrowseAndUploadVideo
          }
        }
      }" :mode="mode" @onCreated="onCreated" @onChange="onChange" />
	</view>
</template>
<script>
	import config from '@/config.js'
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
	import { useStore } from '@/stores/index'
	import { mapState } from 'pinia'
	export default {
		components: {
			Editor,
			Toolbar
		},
		computed: {
			...mapState(useStore, ['params'])
		},
		props: {
			modelValue: {
				type: String,
				default: ''
			},
			mode: {
				// 主题
				type: String,
				default: 'default',
				validator: value => {
					return ['default', 'simple'].includes(value)
				}
			},
			toolbarConfig: {
				// 工具栏配置
				type: Object,
				default: () => ({})
			},
			editorConfig: {
				// 编辑器配置
				type: Object,
				default: () => ({})
			},
			height: {
				type: String,
				default: '300'
			}
		},
		model: {
			prop: 'modelValue',
			event: 'update:modelValue'
		},
		data() {
			return {
				basePath: '',
				editor: null,
				toolbar: null,
				value: ''
			};
		},
		created() {
			this.basePath = config.basePath
			this.value = this.modelValue
		},
		beforeDestroy() {
			if (this.editor) {
				this.editor.destroy()
			}
		},
		methods: {
			onCreated(editor) {
				this.editor = Object.seal(editor)
			},
			onChange(editor) {
				const html = editor.getHtml()
				this.$emit('update:modelValue', html)
				this.$emit('change', html)
				this.$emit('input', html)
			},
			// 自定义图片上传
			customBrowseAndUploadImage(insertFn) {
				this.chooseAndUploadFile(insertFn, 'image', 9, ['jpg', 'png', 'jpeg'])
			},
			// 自定义视频上传
			customBrowseAndUploadVideo(insertFn) {
				this.chooseAndUploadFile(insertFn, 'video', 1, ['mp4'])
			},
			// 选择并上传
			chooseAndUploadFile(insertFn, type, count, extension) {
				if(config.uploadFileType === "uniCloud"){
					//上传到uniCloud
					uniCloud.chooseAndUploadFile({
						type,
						count,
						extension,
						onChooseFile: res => {
							uni.showLoading({
								title: '上传中',
								mask: true
							})
							return res
						},
						success: res => {
							uni.showToast({
								title: '上传成功'
							})
							res.tempFiles.forEach(item => {
								insertFn(item.url, item.name, item.url)
							})
						},
						fail(res) {
							uni.showToast({
								title: '上传失败'
							})
						},
						complete() {}
					})
				}else{
					//上传到本地服务器
					if(type === "image"){
						uni.chooseImage({
							count: 1,
							success: (res)=> {
								this.uploadFile(insertFn, res.tempFilePaths[0])
							}
						})
					}else if(type === "video"){
						uni.chooseVideo({
							success: (res)=> {
								this.uploadFile(insertFn, res.tempFilePath)
							}
						})
					}
				}
			},
			//上传文件
			uploadFile(insertFn, tempFilePath){
				uni.showLoading({
					title: "正在上传"
				})
				this.$http.uploadFile('/core/upload', tempFilePath).then(res => {
					uni.hideLoading()
					if (res.code == 20000) {
						uni.showToast({
							title: '上传成功'
						})
						res.data.forEach(item => {
							insertFn(this.params.FileUrl+item.url, item.name, this.params.FileUrl+item.url)
						})
					} else {
						uni.showToast({
							title: '上传失败'
						})
					}
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.popup-content {
		display: flex;

		.btn {
			margin: 0 20rpx;
		}
	}

	.editor—wrapper {
		border: 1px solid #ccc;
		z-index: 100;
		/* 按需定义 */
	}

	.toolbar-container {
		border-bottom: 1px solid #ccc;
	}

	.editor-container {
		height: 500px;
	}

	.w-e-full-screen-container {
		z-index: 999 !important;
	}
</style>