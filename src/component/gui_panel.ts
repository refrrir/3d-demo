import { Information } from '@models';
import GUI from 'lil-gui';

class GUIPanel {

    guiContainer: HTMLElement | undefined;
    gui: GUI;

    constructor(containerId: string) {
        this.guiContainer = document.getElementById(containerId) || undefined;
        this.gui = new GUI({ container: this.guiContainer });
    }

    init() {
        this.guiContainer && this.dragElement(this.guiContainer);
    }

    populateInfo(isValveOn: boolean, info?: Information[]) {
        this.gui.destroy();
        this.gui = new GUI({ container: this.guiContainer });
        this.guiContainer && this.dragElement(this.guiContainer);

        let obj: any;
        obj = {};

        info?.forEach((i => {
            obj[i.name] = i.value;
        }))

        obj.valveStatus = isValveOn;

        for (const key in obj) {
            this.gui.add(obj, key);
        }
    }

    onValveStatusUpdate(callback: () => void) {

        this.gui.onChange(event => {
            if (event.property == 'valveStatus') {
                callback();
            }
        })

    }

    dragElement(element: HTMLElement) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (element) {
            // if present, the header is where you move the DIV from:
            element.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e: MouseEvent) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e: MouseEvent) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.right = (window.innerWidth - element.offsetLeft - element.offsetWidth + pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export { GUIPanel };