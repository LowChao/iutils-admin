import Request from '@/utils/requset.js'
let request = new Request().http
let asyncRequest = new Request().asyncHttp

class Http {
	/**
	 * Get同步请求
	 * @param data 带参数
	 */
	async getAsync(url, {data = {}, header = {}, verify = true}={}) {
		return await asyncRequest({
			url: url,
			method: "GET",
			data: data,
			header: header,
			verify: verify
		})
	}

	/**
	 * Get请求
	 * @param data 带参数
	 */
	get(url, {data = {}, header = {}, verify = true}={}) {
		return request({
			url: url,
			method: "GET",
			data: data,
			header: header,
			verify: verify
		})
	}

	/**
	 * Post同步请求
	 * @param data 带参数
	 */
	async postAsync(url, {data = {}, header = {}, verify = true}={}) {
		return await asyncRequest({
			url: url,
			method: "POST",
			data: data,
			header: header,
			verify: verify
		})
	}

	/**
	 * Post请求
	 * @param data 带参数
	 */
	post(url, {data = {}, header = {}, verify = true}={}) {
		return request({
			url: url,
			method: "POST",
			data: data,
			header: header,
			verify: verify
		})
	}

	/**
	 * 上传文件
	 * @param filePath 文件地址
	 */
	uploadFile(url, filePath, {data = {}, header = {}, verify = true}={}) {
		return request({
			url: url,
			filePath: filePath,
			data: data,
			header: header,
			verify: verify
		})
	}

}

export default new Http()