function animatePopup() {

}

animatePopup();

function closePopup() {
    const body = document.body;
    const popup = document.getElementById("popup")
    const popupBox = document.getElementById("popupBox")
    let popupClicked = sessionStorage.getItem('popup')
    if(!popupClicked) {
            popupBox.style.display = "flex";
            popup.style.display = "flex";
            popup.style.backgroundColor = "rgba(255, 99, 21, 0.95)"
        popupBox.addEventListener("click", (event) => {
            popupBox.style.display = "none";
            popup.style.display = "none";
            popupClicked = 'clicked';
            sessionStorage.setItem('popup', 'clicked')
            console.log(sessionStorage)
        })
    }

}

closePopup();


// function to remake strings in networkString to array, and return it as networkData array property
function transformNodeStringToArray(data) {
    for (let i = 0; i < data.length; i++) {
        let stringToArray =  data[i].networkString;
        let output = stringToArray.match(/\w+\s?\w+\s?\w+/g);
        data[i].networkString = Array.from('stringToArray');
        data[i].networkArray = data[i].networkString;
        delete data[i].networkString;
        data[i].networkArray.length = 0;
        data[i].networkArray.push(output);
    }
}

class NodeObject {
    constructor(name, description, symbol, nodeArray, x, y, width, height, clickable, clicked) {
        this.name = name; // name of the node
        this.description = description; // text which appears in the box
        this.symbol = symbol; // every node has specific symbol shape and color
        this.nodeArray = nodeArray; // what are hyperlinks of the node from .csv file?
        this.x = x; // random position, center and left/right (only applicable to nodeObject number > 3)
        this.y = y;
        this.width = width;
        this.height = height;
        this.clickable = clickable;
        this.clicked = clicked;
    }
}
