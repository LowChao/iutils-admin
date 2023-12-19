export default {
	//用户状态
	user_status_json: [{'value': "1", 'text': '正常'}, {'value': "0", 'text': '禁用'}],
	//是否状态
	if_status_json: [{'value': 1, 'text': '是'}, {'value': 0, 'text': '否'}],
	//使用状态
	use_status_json: [{'value': 1, 'text': '使用'}, {'value': 0, 'text': '弃用'}],
	//按钮位置
	btn_position_json: [{'value': 1, 'text': '搜索区'}, {'value': 2, 'text': '表格区'}],
	//ID生成规则
	id_rule_json: [{'value': 1, 'text': 'ObjectId'}, {'value': 2, 'text': '自增ID'}],
	//字段类型
	field_type_json: [
		{'value': 1, 'text': 'String', 'notes': '字符串'},
		{'value': 2, 'text': 'Int', 'notes': '整型'},
		{'value': 3, 'text': 'Float', 'notes': '浮点型'},
		{'value': 5, 'text': 'Dict', 'notes': '字典'},
		{'value': 4, 'text': 'List<Dict>', 'notes': '字典列表'},
		{'value': 6, 'text': 'Image', 'notes': '图片'},
		{'value': 12, 'text': 'List<Image>', 'notes': '图片列表'},
		{'value': 11, 'text': 'Icon', 'notes': '图标'},
		{'value': 13, 'text': 'File', 'notes': '文件'},
		{'value': 14, 'text': 'List<File>', 'notes': '文件列表'},
		{'value': 7, 'text': 'Text', 'notes': '文本'},
		{'value': 8, 'text': 'Html', 'notes': '富文本'},
		{'value': 9, 'text': 'Object', 'notes': '对象'},
		{'value': 19, 'text': 'List<Object>', 'notes': '对象列表'},
		{'value': 10, 'text': 'Tree', 'notes': '树形数据'},
		{'value': 15, 'text': 'Timestamp', 'notes': '时间戳'},
		{'value': 16, 'text': 'Date', 'notes': '日期'},
		{'value': 17, 'text': 'Subtable', 'notes': '子表'}
	],
	//布局组件
	layout_json: [
		{
			"type": "Layout",
			"name": "布局组件",
			"gutter": 0,
			"span": 24,
			"offset": 0,
			"push": 0,
			"pull": 0,
			"xs": 0,
			"sm": 0,
			"sm": 0,
			"lg": 0,
			"xl": 0,
			"children": []
		}
	],
	//基础显示组件
	base_show_json: [
		{
			"type": "Table",
			"name": "表格组件"
		},
		{
			"type": "Form",
			"name": "表单组件"
		},
		{
			"type": "Card",
			"name": "卡片组件"
		},
		{
			"type": "Button",
			"name": "按钮组件",
			"value": "按钮",
			"bType": "primary",
			"plain": 0,
			"disabled": 0,
			"size": "default",
			"code": ""
		},
		{
			"type": "Text",
			"name": "文本组件",
			"value": "文本内容",
			"direction": "left",
			"width": "100%",
			"fontSize": "16px",
			"color": "#000000",
			"fontWeight": "normal"
		},
		{
			"type": "RichText",
			"name": "富文本组件",
			"html": "富文本内容",
			"model": ""
		}
	],
	//基础表单组件
	base_form_json: [
		{
			"type": "Input",
			"name": "增强输入框"
		},
		{
			"type": "Checkbox",
			"name": "数据选择器"
		},
		{
			"type": "Slider",
			"name": "滑动选择器"
		},
		{
			"type": "Switch",
			"name": "开关选择器"
		}
	],
	//方向
	direction_json: [
		{'value': "left", 'text': '居左'},
		{'value': "center", 'text': '居中'},
		{'value': "right", 'text': '居右'}
	],
	//粗细
	font_weight_json: [
		{'value': "normal", 'text': '正常'},
		{'value': "bold", 'text': '加粗'}
	],
	//按钮类型
	button_type_json: [
		{'value': "primary", 'text': '主要'},
		{'value': "default", 'text': '默认'},
		{'value': "warn", 'text': '警告'}
	],
	//按钮大小
	button_size_json: [
		{'value': "default", 'text': '默认'},
		{'value': "mini", 'text': '微小'}
	]
}