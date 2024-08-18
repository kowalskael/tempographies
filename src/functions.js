function animatePopup() {

}

animatePopup();

function closePopup() {

    if (sessionStorage.getItem('popup')) {
        return;
    }

    const popup = document.getElementById("popup")
    const popupBox = document.getElementById("popupBox")

    popupBox.style.display = "flex";
    popup.style.display = "flex";
    popup.style.backgroundColor = "rgba(255, 99, 21, 0.95)"
    popupBox.addEventListener("click", (event) => {
        popupBox.style.display = "none";
        popup.style.display = "none";
        sessionStorage.setItem('popup', 'clicked')
        console.log(sessionStorage)
    })
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

function toRadians(degrees) {
    return degrees * Math.PI / 180;
};

function distance(x1, x2, y1, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];

class NodeObject {
    constructor(node, x, y) {
        this.name = node.name; // name of the node
        this.description = node.description; // text which appears in the box
        this.symbol = node.symbol; // every node has specific symbol shape and color
        this.networkArray = node.networkArray; // what are hyperlinks of the node from .csv file?
        this.indexInput = node.indexInput;
        this.width = 220;
        this.height = 135;
        this.x = x; // random position, center and left/right (only applicable to nodeObject number > 3)
        this.y = y;
        const randomColor = Math.floor(Math.random() * colors.length);
        this.color = colors[randomColor];
        this.clickable = true;
        this.clicked = false;
    }


    click() {
        if (mouseX >= this.x ||
            mouseX <= this.x + this.width ||
            mouseY >= this.y ||
            mouseY <= this.y + this.height) {
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
