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

class NodeObject {
    constructor(node, x, y, imageName, font) {
        this.name = node.name; // name of the node
        this.description = node.description; // text which appears in the box
        this.symbol = node.symbol; // every node has specific symbol shape and color
        this.networkArray = node.networkArray; // what are hyperlinks of the node from .csv file?
        this.indexInput = node.indexInput;
        this.width = 220;
        this.height = 135;
        this.x = x; // random position, center and left/right (only applicable to nodeObject number > 3)
        this.y = y;
        this.imageName = imageName;
        this.clickable = true;
        this.clicked = false;
        this.font = font;
    }

    click() {
        this.clicked = true;
        this.clickable = false;
    }

    cursor() {
        if (mouseX <= this.x ||
            mouseX >= this.x + this.width ||
            mouseY <= this.y ||
            mouseY >= this.y + this.height) {
            return;
        }
        cursor(HAND);
    }

    render() {
        this.cursor();
        image(this.imageName, this.x, this.y, this.width, this.height);
        text(this.name, this.x + this.width/2, this.y + this.height/2+5);
        textFont(this.font);
        textSize(16);
        textAlign(CENTER);
    }
}

class LineObject {
    constructor(x1, y1, x2, y2, width, height) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.width = width;
        this.height = height;
        this.centerx1 = this.x1 + this.width / 2;
        this.centery1 = this.y1 + this.height / 2;
        this.centerx2 = this.x2 + this.width / 2;
        this.centery2 = this.y2 + this.height / 2;
    }

    render() {
        stroke(26);
        strokeWeight(2);
        line(this.centerx1, this.centery1, this.centerx2, this.centery2);
    }
}
