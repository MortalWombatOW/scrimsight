import activateButtons from "./button";

export default function hydrate(cls: string, el: Element) {
    Array.from(document.getElementsByClassName(cls)).map(match => {
        el.setAttribute('class', match.getAttribute('class'));
        match.parentElement.replaceChild(el, match);
        console.log('lol');
    });

    activateButtons();
}