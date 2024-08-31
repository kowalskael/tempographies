let nodes = []; // array to contain created and visible node obj
let links = [];
let addImages = [];

let descDiv, descText;

let nodeData;
let imageData = [];
let addImageData = [];

let stageInit = true;
let firstAfterChange = true;

const grpSpace = document.getElementById('game');
const graph = document.getElementById('graph');
const graphW = graph.offsetWidth;
const graphH = graph.offsetHeight;

const nodeW = 220;
const nodeH = 135;
let angle;

let scale;

let timeoutId;

if (innerWidth > 440) {
    scale = 1;
}

if (innerWidth < 440) {
    scale = 0.5;
}

const indexPrnt = document.getElementById('index-input');

const position = [{x: graphW / 2 - nodeW * scale / 2, y: graphH / 2 - nodeH * scale * 1.25},
    {x: graphW / 2 - nodeW * scale / 2 - nodeW * scale / 1.5, y: graphH / 2 - nodeH * scale * 0.1},
    {x: graphW / 2 - nodeW * scale / 2 + nodeW * scale / 1.5, y: graphH / 2 - nodeH * scale * 0.1}]

fetch('data/diagramv0.2.json').then(
    (value) => {
        return value.json();
    }
).then(
    (value) => {
        nodeData = value;
    }
)

let lastX = 0, lastY = 0;
let currentX = 0, currentY = 0;
let dragged = false;
let animateY = 0;

function moveAt(x, y) {
    currentX = x;
    currentY = y; // aktualna pozycja graphu
    graph.style.transform = `translate(${x}px, ${y}px)`;
}

function onMouseDown(e) {
    dragged = false;
    lastX = e.clientX - currentX;
    lastY = e.clientY - currentY; // zmienne pomocnicze do zmierzenia offsetu
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onTouchMove);
}

function onMouseMove(e) {
    dragged = true;
    moveAt(e.clientX - lastX, e.clientY - lastY);
}

function onTouchMove(e) {
    onMouseMove(e.touches[0]);
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onTouchMove);
}

document.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);
document.addEventListener('touchstart', function (e) {
    onMouseDown(e.touches[0]);
});
window.addEventListener('touchend', onMouseUp);


descDiv = document.createElement('div');
descDiv.setAttribute("id", "descDiv");
document.body.appendChild(descDiv);
descText = document.createElement('div');
descText.setAttribute("id", "descText");
descText.innerHTML = 'no description';
document.getElementById('descDiv').appendChild(descText);
descDiv.style.display = 'none';

function preload() {
    transformWordsToLinks(nodeData);

    for (let i = 0; i < 21; i++) {
        imageData[i] = loadImage('img/shapes/' + [i] + '.png');
        nodeData[i].symbol = imageData[i];
    }

    for (let i = 0; i < 4; i++) {
        addImageData[i] = loadImage('img/add/' + [i] + '.png');
    }

}

function setup() {
    let canvas = createCanvas(graphW, innerHeight * 3);
    canvas.parent('#graph');

    let initialNode;
    for (let i = 0; i < 3; i++) {

        initialNode = new NodeObject(nodeData[i], position[i].x, position[i].y, scale);
        nodes.push(initialNode);

        grpSpace.addEventListener("click", function () {
            if (dragged) {
                return;
            }
            init(nodes[i]);
        });
    }
}

function init(node) {

    if (!stageInit ||
        mouseX <= node.x ||
        mouseX >= node.x + node.width ||
        mouseY <= node.y ||
        mouseY >= node.y + node.height ||
        !node.clickable) {
        return;
    }

    node.click(); // flagowanie - był kliknięty, nie jest już klikalny
    nodes = nodes.filter(function (el) {
        return el.clicked === true;
    })

    if (innerWidth > 480) {
        node.x = 70;
        node.y = 70;
    }
    if (innerWidth <= 480) {
        node.x = 40;
        node.y = 40;
    }


    node.clicked = false;
    node.clickable = true;

    // add description to index-input
    let addIndexPrnt = document.createElement('div');
    indexPrnt.appendChild(addIndexPrnt);
    addIndexPrnt.innerHTML += `<p class="animateIndex indexprnt">${node.indexInput}</p>`;

    stageInit = false;
}


// funkcja dodająca/chowająca opis el. z drugiego etapu (po init)
function game(node) {

    if (stageInit ||
        mouseX <= node.x ||
        mouseX >= node.x + node.width ||
        mouseY <= node.y ||
        mouseY >= node.y + node.height ||
        !node.clickable) {
        return;
    }

    addNode(node);
    let indexP = document.getElementsByClassName("indexprnt")
    for (let j = 0; indexP.length; j++) {
        indexP[j].classList.remove("animateIndex");
    }
}

function addNode(node) {

    descDiv.style.display = 'flex';
    descText.innerHTML = `<p class="descTextNode">from ${node.name}</p>${node.description}`;

    if (node.x + nodeW + 300 >= graphW && innerWidth > 480) {
        descDiv.style.top = 100 + "px";
        descDiv.style.left = node.x - 300 + "px";
    }

    if (node.x + nodeW + 300 <= graphW && innerWidth > 480) {
        descDiv.style.top = 100 + "px";
        descDiv.style.left = node.x + nodeW + 110 + "px";
    }

    for (let j = 0; j < node.networkArray.length; j++) {
        createNewNode(node.networkArray[j]);
    }

    node.click();

    if (nodes.length > 10) {
        descDiv.style.display = 'flex';
        descText.innerHTML = `Thank you for taking time to explore some of the temporal and spatial aspects of the Epicnutrients project. If you want to find out more about the research, we encourage you to take another round. Click the button below to restart the website.`;
        descDiv.style.top = 100 + "px";
        let button = document.createElement("button");
        button.innerHTML = 'play again'
        document.getElementById('descDiv').appendChild(button);

        button.addEventListener("click", function () {
            window.open('index.html', "_self")
        }, false)
    }
}

function createNewNode(node) {
    const newLink = document.getElementById(node);
    newLink.addEventListener("click", function () {
        if (dragged) {
            return;
        }

        for (let l = 0; l < nodeData.length; l++) {
            if (node !== nodeData[l].name) {
                continue;
            }

            //pozycja poprzedniego node'a
            const prevNodeX = nodes[nodes.length - 1].x;
            const prevNodeY = nodes[nodes.length - 1].y;
            // dystans na podstawie poprzedniej pozycji
            const nodeDist = Math.hypot(nodeW, nodeH);

            if (prevNodeX + nodeW * scale + nodeDist * scale >= graphW) {
                if (firstAfterChange) {
                    angle = 85;
                }
                if (!firstAfterChange) {
                    angle = 155;
                }
            }

            if (prevNodeX <= nodeW * scale) {
                angle = 25;
                firstAfterChange = true;
            }

            let updateNodeX = Math.cos(toRadians(angle)) * nodeDist * scale + prevNodeX;
            let updateNodeY = Math.sin(toRadians(angle)) * nodeDist * scale + prevNodeY;

            if (angle === 85) {
                firstAfterChange = false;
            }

            const newLine = new LineObject(prevNodeX, prevNodeY, updateNodeX, updateNodeY, prevNodeX + nodeW * scale * 2, prevNodeY + nodeH * scale, nodeW * scale, nodeH * scale, angle, scale);
            links.push(newLine);

            const newNode = new NodeObject(nodeData[l], updateNodeX, updateNodeY, scale);
            nodes.push(newNode);

            let addImgPositionX = 0;

            if (updateNodeX < graphW / 2) {
                addImgPositionX = graphW - 459 * scale;
            }

            if (updateNodeX > graphW / 2) {
                addImgPositionX = 0;
            }

            if (newNode.name === 'laboratory') {
                const newAddImg = new additionalImg(addImageData[2], addImgPositionX, updateNodeY + nodeH * scale / 2 - 140, 459 * scale, 283 * scale);
                addImages.push(newAddImg);
            }

            if (newNode.name === 'cold plasma') {
                const newAddImg = new additionalImg(addImageData[0], addImgPositionX, updateNodeY + nodeH * scale / 2 - 140, 459 * scale, 283 * scale);
                addImages.push(newAddImg);
            }

            if (newNode.name === 'ryegrass') {
                const newAddImg = new additionalImg(addImageData[3], addImgPositionX, updateNodeY + nodeH / 2 - 140, 459, 283);
                addImages.push(newAddImg);
            }

            if (nodeData[l].name === 'biochar') {
                const newAddImg = new additionalImg(addImageData[1], updateNodeX - 100, updateNodeY + nodeH * scale / 2 - 140, 459 * scale, 283 * scale);
                addImages.push(newAddImg);
            }

            descDiv.style.display = 'none';
            // add description to index-input

            let addIndexPrnt = document.createElement('div');
            indexPrnt.appendChild(addIndexPrnt);
            addIndexPrnt.innerHTML += `<p class="animateIndex indexprnt">${nodeData[l].indexInput}</p>`;
            indexPrnt.insertBefore(addIndexPrnt, indexPrnt.children[0])

            if (nodes.length > 2) {
                animateY = -updateNodeY + nodeH * scale + 100;
                graph.style.transform = `translate(${0}px, ${animateY}px)`;
                graph.classList.add('animate');

                timeoutId = setTimeout(function () {
                    clearTimeout(timeoutId);
                    currentX = 0;
                    currentY = animateY;
                    graph.classList.remove('animate');
                }, 350);
            }
        }
    })
}


function draw() {
    background('#d8d6d2');
    cursor(MOVE);

    for (let i = 0; i < addImages.length; i++) {
        addImages[i].render();
    }

    for (let i = 0; i < links.length; i++) {
        links[i].render();
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].render();
    }

    if (!stageInit) {
        for (let i = 0; i < nodes.length; i++) {
            grpSpace.addEventListener("click", function () {
                if (dragged) {
                    return;
                }
                game(nodes[i]);
            });
        }
    }
}



