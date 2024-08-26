let nodes = []; // array to contain created and visible node obj
let links = [];
const addImages = [];

let descDiv, descText;

let nodeData;
let imageData = [];
let bgImg;

let stageInit = true;
let firstAfterChange = true;

const grpSpace = document.getElementById('game');
const graph = document.getElementById('graph');
const graphW = graph.offsetWidth;

const nodeW = 220;
const nodeH = 135;
let angle;

const indexPrnt = document.getElementById('index-input');

const position = [{x: graphW / 2 - nodeW / 2, y: innerHeight / 2 - nodeH * 1.25},
    {x: graphW / 2 - nodeW / 2 - nodeW / 1.5, y: innerHeight / 2 - nodeH * 0.1},
    {x: graphW / 2 - nodeW / 2 + nodeW / 1.5, y: innerHeight / 2 - nodeH * 0.1}]

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
}

function onMouseMove(e) {
    dragged = true;
    moveAt(e.clientX - lastX, e.clientY - lastY);
}

function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
}

document.addEventListener('mousedown', onMouseDown);
window.addEventListener('mouseup', onMouseUp);

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

    bgImg = loadImage('img/bg01.png');
}

function setup() {
    let canvas = createCanvas(graphW, innerHeight * 3);
    canvas.parent('#graph');

    let initialNode;
    for (let i = 0; i < 3; i++) {
        initialNode = new NodeObject(nodeData[i], position[i].x, position[i].y);
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

    node.x = 70;
    node.y = 70;

    node.clicked = false;
    node.clickable = true;

    // add description to index-input
    indexPrnt.innerHTML += `<p class="animateIndex indexprnt">${node.indexInput}</p>`;

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
        indexP[j].classList.remove("animateIndex")
    }

}


function addNode(node) {

    descDiv.style.display = 'block';
    descText.innerHTML = `<p class="descTextNode">from ${node.name}</p>${node.description}`;
    descDiv.style.top = 100 + "px";

    if (node.x + nodeW + 300 >= graphW) {
        descDiv.style.left = node.x - 300 + "px";
    }

    if (node.x + nodeW + 300 <= graphW) {
        descDiv.style.left = node.x + nodeW + 110 + "px";
    }

    for (let j = 0; j < node.networkArray.length; j++) {
        createNewNode(node.networkArray[j]);
    }

    node.click();
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

            if (prevNodeX + nodeW + nodeDist >= graphW) {
                if (firstAfterChange) {
                    angle = 85;
                }
                if (!firstAfterChange) {
                    angle = 155;
                }
            }

            if (prevNodeX <= nodeW) {
                angle = 25;
                firstAfterChange = true;
            }

            let updateNodeX = Math.cos(toRadians(angle)) * nodeDist + prevNodeX;
            let updateNodeY = Math.sin(toRadians(angle)) * nodeDist + prevNodeY;

            if (angle === 85) {
                firstAfterChange = false;
            }

            const newLine = new LineObject(prevNodeX, prevNodeY, updateNodeX, updateNodeY, prevNodeX + nodeW * 2, prevNodeY + nodeH, nodeW, nodeH, angle);
            links.push(newLine);

            const newNode = new NodeObject(nodeData[l], updateNodeX, updateNodeY);
            nodes.push(newNode);

            if (newNode.name === 'biochar') {
                const newBgImg = new additionalImg(bgImg, 0, -innerHeight + updateNodeY + nodeW / 2 - width / 2);
                addImages.push(newBgImg);
            }

            descDiv.style.display = 'none';
            // add description to index-input
            indexPrnt.innerHTML += `<p class="animateIndex indexprnt">${nodeData[l].indexInput}</p>`;

            // po dodaniu obiektu przesuń #graph do góry i w lewo
            // graph.style.transform = `translate(${ }px, ${ }px)`
        }
    })
}

function end(node) {
    node.clicked = false;
    node.clickable = true;

    if (stageInit ||
        mouseX <= node.x ||
        mouseX >= node.x + node.width ||
        mouseY <= node.y ||
        mouseY >= node.y + node.height ||
        !node.clickable) {
        return;
    }

    if (nodes.length > 8) {
        descDiv.style.display = 'block';
        descText.innerHTML = `this is the end`;
        descDiv.style.top = 100 + "px";

        descDiv.addEventListener("click", function () {
            window.location = 'index.html';
        }, false)
    }
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
                end(nodes[i])
            });
        }
    }
}



