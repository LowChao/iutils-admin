const TokenKey = 'token'
const ThemeKey = 'theme'


//登录令牌
export function getToken() {
	return uni.getStorageSync(TokenKey)
}
export function setToken(token) {
	return uni.setStorageSync(TokenKey, token)
}
export function removeToken() {
	return uni.removeStorageSync(TokenKey)
}

//主题模式
export function getTheme() {
	return uni.getStorageSync(ThemeKey)
}
export function setTheme(theme) {
	return uni.setStorageSync(ThemeKey, theme)
}