function insertTextList(label: string, text: string) {
    let templateDom = document.getElementById("text-li") as HTMLTemplateElement;
    let spanDom = templateDom.content.querySelectorAll("span")[0];
    spanDom.textContent = label;
    let inputDom = templateDom.content.querySelectorAll("input")[0];
    inputDom.value = text;
  
    let containerDom = document.getElementById("panel") as HTMLDivElement | null;
    let ulDom = containerDom?.querySelectorAll("ul")[0];
    let clone = document.importNode(templateDom.content, true);
    ulDom?.appendChild(clone);
  }
  
  function insertCheckboxList(label: string, value: boolean, callback: Function) {
    let templateDom = document.getElementById(
      "checkbox-li"
    ) as HTMLTemplateElement;
    let spanDom = templateDom.content.querySelectorAll("span")[0];
    spanDom.textContent = label;
    let checkboxDom = templateDom.content.querySelectorAll("input")[0];
    checkboxDom.checked = value;
  
    let containerDom = document.getElementById("panel") as HTMLDivElement | null;
    let ulDom = containerDom?.querySelectorAll("ul")[0];
    let clone = document.importNode(templateDom.content, true);
    clone.querySelectorAll("input")[0].onchange = (event) => {
      callback((<HTMLInputElement>event.target).checked);
    };
    ulDom?.appendChild(clone);
  }
  
  function removeListItems() {
    let containerDom = document.getElementById("container") as HTMLDivElement;
    let ulDom = containerDom.querySelectorAll("ul")[0];
    let liDoms = ulDom.querySelectorAll("li");
    for (let lidom of liDoms) ulDom.removeChild(lidom);
  }
  
  export { insertTextList, insertCheckboxList, removeListItems };
  