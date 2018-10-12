import Clipboard from 'Clipboard'

export let opacityZero = document.createElement('div')
opacityZero.setAttribute('class', "opacity-zero")
opacityZero.innerHTML = "按钮"
opacityZero.dataset["clipboardTarget"] = '#foo'
document.body.appendChild(opacityZero)

let input = document.createElement('input')
input.id = 'foo'

export default function clipSomeString(elem, string) {
    input.value = string
    var clipboard = new Clipboard(elem);
    document.body.appendChild(input)

    clipboard.on('success', function (e) {
        elem.remove()
        input.remove()
        e.clearSelection();
    });
    clipboard.on('error', function (e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
}
