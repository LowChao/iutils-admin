<template>
  <div ref="main" :style="{height, width}"></div>
</template>

<script>
import { toRaw } from 'vue'
import * as monaco from "monaco-editor/esm/vs/editor/editor.api"

// javascript引入
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution"

export default {
  data() {
    return {
		defaultOptions: {
			// 默认主题 vs,vs-dark,hc-black
			theme: "vs-dark", 
			value: this.code, 
			// 编辑器语言'javascript', 'yaml', 'json', 'xml'
			language: "javascript",
			// 是否折叠
			folding: true, 
			// 折叠等高线
			foldingHighlight: true, 
			// 折叠方式  auto | indentation
			foldingStrategy: "indentation",
			// 是否一直显示折叠 always | mouseover
			showFoldingControls: "always",
			// 等宽优化
			disableLayerHinting: true, 
			// 空选择剪切板
			emptySelectionClipboard: false, 
			// 选择剪切板
			selectionClipboard: false, 
			// 自动布局
			automaticLayout: true, 
			// 代码镜头
			codeLens: false, 
			// 滚动完最后一行后再滚动一屏幕
			scrollBeyondLastLine: false,
			// 颜色装饰器
			colorDecorators: true, 
			// 辅助功能支持  "auto" | "off" | "on"
			accessibilitySupport: "off",
			// 行号 取值： "on" | "off" | "relative" | "interval" | function
			lineNumbers: "on", 
			// 行号最小字符   number
			lineNumbersMinChars: 5,
			enableSplitViewResizing: false,
			//是否只读  取值 true | false
			readOnly: false, 
		},
		monacoEditor: null,
    }
  },
  props: {
	options: {
		type: Object,
		default: () => {}
	},
	height: {
		type: String,
		default: '300px'
	},
	width: {
		type: String,
		default: '100%'
	},
	code: {
      type: String,
      default: ''
    }
  },
  computed: {
    _constructionOptions() {
      return Object.assign(this.defaultOptions, this.options)
    }
  },
  mounted() {
    this._initMonacoEditor()
  },
  methods: {
	// 初始化MonacoEditor插件
	_initMonacoEditor() {
	    this.monacoEditor = monaco.editor.create(this.$el, this._constructionOptions)   
		this.monacoEditor.onDidChangeModelContent(event => {
			let code = toRaw(this.monacoEditor).getValue()
			this.$emit('update:code', code)
		})
	}
  }
}
</script>