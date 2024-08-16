
function animatePopup() {

}

animatePopup();

function closePopup() {
    const popup = document.getElementById("popup")
    const popupBox = document.getElementById("popupBox")
    let popupClicked = sessionStorage.getItem('popup')
    if (!popupClicked) {
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

// funkcja, która transformuje słowa z nodeArray w description na linki
function transformWordsToLinks(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].networkArray.length; j++) {
            if (data[i].description.indexOf(data[i].networkArray[j]) > -1) {
                data[i].description = data[i].description.replace(data[i].networkArray[j], `<a class="link" id="${data[i].networkArray[j]}">${data[i].networkArray[j]}</a>`);
            }
        }
    }
}

class NodeObject {
    constructor(name, description, symbol, nodeArray, width, height, x, y, color, clickable, clicked) {
        this.name = name; // name of the node
        this.description = description; // text which appears in the box
        this.symbol = symbol; // every node has specific symbol shape and color
        this.nodeArray = nodeArray; // what are hyperlinks of the node from .csv file?
        this.width = width;
        this.height = height;
        this.x = x; // random position, center and left/right (only applicable to nodeObject number > 3)
        this.y = y;
        this.color = color;
        this.clickable = clickable;
        this.clicked = clicked;
    }

    click() {
        if ((mouseX > this.x) && (mouseX < this.x + this.width) &&
            (mouseY > this.y) && (mouseY < this.y + this.height)) {
            this.clicked = true;
            this.clickable = false;
        }
    }

    collide() {

    }

    render() {
        ellipseMode(CORNER);
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.width, this.height)
    }
}
