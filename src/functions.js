function mobileNav() {
    let flag = true;
    const hamburger = document.getElementById('hamburger');
    const mobileLinks = document.getElementById('mobile-links');
    const mobileMenu = document.getElementById('mobile-menu');
    const indexSpace = document.getElementById("index");
    const mainSpace = document.getElementById("main")

    hamburger.addEventListener("click", (e) => {
        console.log('clicked')
        if (flag) {
            hamburger.classList.add('open');
            grpSpace.style.display = 'none';
            indexSpace.style.display = 'none';
            mobileLinks.style.display = 'flex';
            mainSpace.style.height = '100%';
            mobileMenu.style.height = '100%';
            flag = false;
        } else {
            hamburger.classList.remove('open');
            grpSpace.style.display = 'flex';
            indexSpace.style.display = 'flex';
            mobileLinks.style.display = 'none';
            mobileMenu.style.height = '45px';
            mainSpace.style.height = '70%';
            flag = true;
        }
    })
}

mobileNav();

function animatePopup() {

}

animatePopup();

function closePopup() {

    if (sessionStorage.getItem('popup')) {
        return;
    }

    const popup = document.getElementById("popup")
    const popupBox = document.getElementById("popupBox")
    const loadingImg = document.getElementById("p5_loading")

    loadingImg.style.display = "none";
    popupBox.style.display = "flex";
    popup.style.display = "flex";
    popupBox.addEventListener("click", (event) => {
        popupBox.style.display = "none";
        popup.style.display = "none";
        sessionStorage.setItem('popup', 'clicked')
        console.log(sessionStorage)
        loadingImg.style.display = 'flex';
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
    constructor(node, x, y, scale) {
        this.name = node.name; // name of the node
        this.description = node.description; // text which appears in the box
        this.symbol = node.symbol; // every node has specific symbol shape and color
        this.networkArray = node.networkArray; // what are hyperlinks of the node from .csv file?
        this.indexInput = node.indexInput;
        this.scale = scale;
        this.width = 220 * this.scale;
        this.height = 135 * this.scale;
        this.x = x; // random position, center and left/right (only applicable to nodeObject number > 3)
        this.y = y;
        this.clickable = true;
        this.clicked = false;
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
        image(this.symbol, this.x, this.y, this.width, this.height);
    }
}

class LineObject {
    constructor(x1, y1, x2, y2, x3, y3, width, height, angle, scale) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.width = width;
        this.height = height;
        this.angle = angle;
        this.centerx1 = this.x1 + this.width / 2 ;
        this.centery1 = this.y1 + this.height / 2;
        this.centerx2 = this.x2 + this.width / 2;
        this.centery2 = this.y2 + this.height / 2;
        this.scale = scale;
    }

    render() {
        fill('#ff6315');
        if (this.angle === 25) {
            triangle(this.centerx2 - 13 * this.scale, this.y2 - 9 * this.scale, this.centerx2, this.y2 - 5 * this.scale, this.centerx2 - 2 * this.scale, this.y2 - 18 * this.scale)
        }
        if (this.angle === 85) {
            triangle(this.centerx2 - 3 * this.scale, this.y2 - 17 * this.scale, this.centerx2 + 9 * this.scale, this.y2 - 13 * this.scale, this.centerx2, this.y2 - 5 * this.scale)
        }
        if (this.angle === 155) {
            triangle(this.centerx2 + 2 * this.scale, this.y2 - 19 * this.scale, this.centerx2 + 14 * this.scale, this.y2 - 10 * this.scale, this.centerx2, this.y2 - 5 * this.scale)
        }

        stroke('#ff6315');
        strokeWeight(2.8);
        noFill();
        beginShape();
        for (let t = 0; t <= 1; t += 0.02) {
            let px1, px2, py1, py2;
            if (this.angle === 25) {
                px1 = lerp(this.x1 + this.width + 10 * this.scale, this.x2 + this.width / 8  * this.scale, t);
                py1 = lerp(this.centery1, this.centery1 - 70  * this.scale, t);
                px2 = lerp(this.centerx2, this.centerx2 , t);
                py2 = lerp(this.y2, this.y2 - 5  * this.scale, t);
            }

            if (this.angle === 85) {
                px1 = lerp(this.centerx1 + 20 * this.scale, this.centerx2 + 40  * this.scale, t);
                py1 = lerp(this.y1 + this.height + 10 * this.scale, this.centery1 + 60  * this.scale, t);
                px2 = lerp(this.centerx2, this.centerx2, t);
                py2 = lerp(this.y2, this.y2 - 5 * this.scale, t);
            }

            if (this.angle === 155) {
                px1 = lerp(this.x1 - 10 * this.scale, this.x2 + this.width - 30 * this.scale, t);
                py1 = lerp(this.centery1, this.centery1 - 70 * this.scale, t);
                px2 = lerp(this.centerx2, this.centerx2, t);
                py2 = lerp(this.y2, this.y2 - 5 * this.scale, t);
            }
            let px = lerp(px1, px2, t);
            let py = lerp(py1, py2, t);
            vertex(px, py);
        }
        endShape();
    }
}

class additionalImg {
    constructor(fileName, x, y, width, height) {
        this.fileName = fileName;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    render() {
        image(this.fileName, this.x, this.y, this.width, this.height);
    }
}