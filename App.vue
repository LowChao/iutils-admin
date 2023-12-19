<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
		},
		onPageNotFound: function(params) {
			//找不到页面
			uni.redirectTo({
				url: '/pages/common/404'
			})
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "@/static/icons/iconfont.css";
	@import url('comm.css');

	/*解决页面不能复制问题 */
	view {
		user-select: text;
	}
	.uni-icons{
		cursor: pointer;
	}

	/*解决弹出框按钮鼠标指针样式*/
	.uni-dialog-button {
		cursor: pointer;
	}
	
	.uni-easyinput__content-input{
		height: 38px !important;
	}
	.el-tabs--card>.el-tabs__header .el-tabs__nav{
		border: 1px solid #f5f5f5 !important;
		border-radius: 0 !important;
		border-top: none !important;
		border-left: none !important;
	}
	.el-tabs--card>.el-tabs__header .el-tabs__item{
		border-left: 1px solid #f5f5f5 !important;
	}
	.el-tabs__nav-prev{
		border-left: 1px solid #f5f5f5 !important;
	}
	.el-tabs--card>.el-tabs__header{
		border-bottom: none !important;
	}
</style>
<style lang="scss">
	.table {
		border: 1px #EBEEF5 solid;
	
		.th {
			display: flex;
			border-bottom: 1px #EBEEF5 solid;
	
			.td {
				padding: 12px 10px;
				font-size: 14px;
				font-weight: bold;
				color: #909399;
				border-right: 1px #EBEEF5 solid;
			}
	
			.td:last-child {
				border-right: none;
			}
		}
	
		.tr {
			display: flex;
			border-bottom: 1px #EBEEF5 solid;
			background-color: #ffffff;
	
			.td {
				padding: 8px 10px;
				font-weight: 400;
				color: #606266;
				border-right: 1px #EBEEF5 solid;
			}
	
			.td:last-child {
				border-right: none;
			}
		}
	
		.tr:last-child {
			border-bottom: none;
		}
	}
</style>