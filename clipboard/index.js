import clipSomeString, { opacityZero } from './clipboard'

window.clipboard = function clipboard(str = '复制一段话') {
    clipSomeString(opacityZero, str)
}


// let root = document.querySelector('#root')
// root.innerHTML = `<h2>标题</h2>` + '文章'.repeat(2000)
export default {}