export default {
    q(elem) {
        return document.querySelector(elem);
    },
    qa(elem) {
        return document.querySelectorAll(elem);
    },
    addClass(elem, className) {
        elem.classList.add(className);
    },
    removeClass(elem, className) {
        elem.classList.remove(className);
    },
    hasClass(elem, className) {
        return elem.classList.contains(className);
    },
    createNode(type, content) {
        const node = document.createElement(type);
        const text = document.createTextNode(content);
        return node.appendChild(text);
    },
    insertTo(parent, template) {
        parent.innerHTML += template;
    },
    clean(elem) {
        elem.innerHTML = '';
    },
    //数值取反
    inverse(num) {
        return ~num + 1;
    }
}