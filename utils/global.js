import { ElMessage } from 'element-plus'

class Global {
	
	//显示加载中
	showLoading(message){
		uni.showLoading({
			title: message
		})
	}
	
	//隐藏加载中
	hideLoading(){
		uni.hideLoading()
	}
	
	//显示提示
	showToast(type, message){
		ElMessage({
			message: message,
			type: type
		})
	}
	
	//复制
	copy(data){
		uni.setClipboardData({
			data: data
		})
	}
	
	//弹出框
	showModal(title, content, callback){
		uni.showModal({
		    title: title,
		    content: content,
		    success: (res) => {
		        callback && callback(res)
		    }
		})
	}
	
	//选择文件
	chooseFile(count, extension, callback){
		uni.chooseFile({
			count: count,
			extension: extension,
			success: (res) => {
				callback && callback(res)
			}
		})
	}
	
}

export default new Global()