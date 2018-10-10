
　　function copy(str) {
    var save = function (e) {
        e.clipboardData.setData('text/plain', str);//下面会说到clipboardData对象
        e.preventDefault();//阻止默认行为
    }
    document.addEventListener('copy', save);
    document.execCommand("copy");//使文档处于可编辑状态，否则无效
    document.removeEventListener('copy', save)
　　}
let i = 0
　　document.getElementById('root').addEventListener('click', function (ev) {
    copy(i++)
　　})
