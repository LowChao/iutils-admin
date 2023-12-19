import { defineStore } from 'pinia'
import Http from '@/utils/http'

export const useStore = defineStore('data', {
	state: () => ({
		//主题（默认明亮）
		theme: "light",
		//菜单状态
		isMenuCollapse: false,
		//激活菜单
		activeMenuPath: null,
		activeMenuName: null,
		//顶部高度
		topHeight: 60,
		//菜单宽度
		leftWidth: 200,
		//快捷菜单
		tabs: [],
		//登录状态
		isLogin: false,
		//静态数据
		datas: null,
		//用户信息
		user: null,
		//参数
		params: null,
		//菜单
		menus: [],
		//项目
		projects: [],
		//缓存字典
		dict: {},
		//缓存对象
		object: {},
	}),
	actions: {
		//初始化对象
		async initObject(key){
			if(!this.object[key]){
				if(key == "Role"){
					let res = await Http.postAsync("/role/getList", {header: {"Mid": key}})
					if(res.code == 20000){
						this.object[key] = res.data
					}
				}else{
					let res = await Http.postAsync("/core/getList", {data: {"currentPage": 1}, header: {"Mid": key}})
					if(res.code == 20000){
						this.object[key] = res.data
					}
				}
			}
		},
		//远程获取对象
		async remoteObject(query, key){
			if(key != "Role"){
				let res = await Http.postAsync("/core/getList", {data: {"currentPage": 1, "searchKey": query}, header: {"Mid": key}})
				if(res.code == 20000){
					this.object[key] = res.data
				}
			}
		},
		//获取对象
		getObject(key, type, defaultValue){
			let _list = []
			if(this.object && this.object[key]){
				_list = this.object[key]
			}
			if(defaultValue){
				if(type == 1){
					_list = this.addObjectList(_list, defaultValue)
				}else if(type == 2){
					defaultValue.forEach(item => {
						_list = this.addObjectList(_list, item)
					})
				}
			}
			return _list
		},
		addObjectList(_list, item){
			let _item = _list.find(obj => {
				if(item.code && item.code == obj.code){
					return true
				}else if(item.id && item.id == obj.id){
					return true
				}
			})
			if(!_item){
				_list.push(item)
			}
			return _list
		},
		//初始化字典
		async initDict(key){
			if(!this.dict[key]){
				let res = await Http.postAsync("/dict/getList", {data: {"code": key}, header: {"Mid": "Dict"}})
				if(res.code == 20000){
					this.dict[key] = res.data
				}
			}
		},
		//获取字典
		getDict(key){
			if(this.dict && this.dict[key]){
				return this.dict[key]
			}
			return []
		},
		//显示字典
		showDict(key, value){
			if(value){
				let list = this.dict[key]
				let names = "--"
				if(!list){
					return names
				}
				for(let i=0;i<list.length;i++){
					if(value == list[i].value){
						if(list[i].color){
							names = "<span style='color:"+list[i].color+"'>"+list[i].text+"</span>"
						}else{
							names = list[i].text
						}
						break
					}
				}
				return names
			}else{
				return "--"
			}
		},
		//显示字典
		showDicts(key, values){
			if(values){
				let list = this.dict[key]
				let names = []
				if(!list){
					return names
				}
				for(let i=0;i<list.length;i++){
					if(values.includes(list[i].value)){
						names.push(list[i].text)
					}
				}
				if(names.length > 0){
					return names.join(",")
				}else{
					return "--"
				}
			}else{
				return "--"
			}
		},
	}
})