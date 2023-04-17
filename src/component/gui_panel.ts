import { Information } from '@models';
import GUI from 'lil-gui';

class GUIPanel {

    guiContainer: HTMLElement;
    gui: GUI;

    constructor(containerId: string) {
        this.guiContainer = document.getElementById(containerId) as HTMLElement;
        this.gui = new GUI({ container: this.guiContainer });
        this.boundDrag(this.guiContainer);
    }

    populateInfo(info: Information[] = [] , isValveOn?: boolean) {
        this.gui.destroy();
        this.gui = new GUI({ container: this.guiContainer });

        let obj: { [k: string]: string | boolean } = {};

        info.forEach((i => {
            obj[i.name] = i.value;
        }))

        isValveOn != undefined && (obj.valveStatus = isValveOn);

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

    boundDrag(element: HTMLElement) {
        let relativeX: number;
        let relativeY: number;

        element.ondragstart = (event) => {
          relativeX = event.offsetX;
          relativeY = event.offsetY;
          element.style.opacity = "0";
        };
      
        element.ondrag = (event) => {
          let left = event.pageX - relativeX;
          let width = element.getBoundingClientRect().width;
          let windowWidth = document.documentElement.clientWidth;
          element.style.top = event.pageY - relativeY + "px";
          element.style.right = windowWidth - left - width + "px";
          element.style.opacity = "1";
        };
      
        element.ondragend = (event) => {
          let left = event.pageX - relativeX;
          let width = element.getBoundingClientRect().width;
          let windowWidth = document.documentElement.clientWidth;
          element.style.top = event.pageY - relativeY + "px";
          element.style.right = windowWidth - left - width + "px";
          element.style.removeProperty("opacity")
        };
    }
}

export { GUIPanel };
