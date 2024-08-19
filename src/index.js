let nodes = []; // array to contain created and visible node obj
const links = [];

let descDiv, descText;

let nodeData;
let imageData = [];
let stageInit = true;

const grpSpace = document.getElementById('game');
const graph = document.getElementById('graph');
const grpSpaceW = grpSpace.offsetWidth;

const nodeW = 220;
const nodeH = 135;

const indexPrnt = document.getElementById('index-input');

const position = [{x: grpSpaceW / 2 - nodeW / 2, y: nodeH / 2},
    {x: grpSpaceW / 2 - nodeW / 2 - nodeW / 1.5, y: nodeH * 1.75},
    {x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 1.75}]

fetch('diagramv0.2.json').then(
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
document.getElementById('graph').appendChild(descDiv);
descText = document.createElement('div');
descText.setAttribute("id", "descText");
descText.innerHTML = 'no description';
document.getElementById('descDiv').appendChild(descText);
descDiv.style.display = 'none';

function preload() {
    transformWordsToLinks(nodeData);

    for (let i = 0; i < 11; i++) {
        imageData[i] = loadImage('img/shapes/' + [i] + '.png');
    }
}

function setup() {
    let canvas = createCanvas(grpSpaceW, innerHeight);
    canvas.parent('#graph');

    let initialNode;
    for (let i = 0; i < 3; i++) {
        const randomImg = Math.floor(Math.random() * imageData.length);
        initialNode = new NodeObject(nodeData[i], position[i].x, position[i].y, imageData[randomImg]);
        nodes.push(initialNode);
        console.log(nodes);
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
    indexPrnt.innerHTML += `<p>${node.indexInput}</p>`;

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
}


function addNode(node) {

    descDiv.style.display = 'block';
    descText.innerHTML = node.description;
    descDiv.style.left = node.x + "px";
    descDiv.style.top = node.y + "px";
    console.log('clicked initial ' + node.name);

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

            console.log(prevNodeX, prevNodeY);

            // dystans na podstawie poprzedniej pozycji
            const nodeDist = Math.hypot(nodeW, nodeH);

            console.log(nodeDist);

            // update X i Y o dystans
            const updateNodeX = Math.cos(toRadians(0)) * nodeDist + prevNodeX;
            const updateNodeY = Math.sin(toRadians(45)) * nodeDist + prevNodeY;

            console.log(updateNodeX, updateNodeY)

            const randomImg = Math.floor(Math.random() * imageData.length);
            const newNode = new NodeObject(nodeData[l], updateNodeX, updateNodeY, imageData[randomImg]);
            nodes.push(newNode);

            const newLine = new LineObject(prevNodeX, prevNodeY, updateNodeX, updateNodeY, nodeW, nodeH);
            links.push(newLine);

            console.log(links)
            descDiv.style.display = 'none';
            // add description to index-input
            indexPrnt.innerHTML += `<p>${nodeData[l].indexInput}</p>`;

            // po dodaniu obiektu przesuń #graph do góry i w lewo
            // graph.style.transform = `translate(${ }px, ${ }px)`;

            console.log(nodes);
        }
    })
}


function draw() {
    background('#d8d6d2');
    cursor(MOVE);

    descDiv.addEventListener("mouseover", (e) => {
        cursor(HAND)
    });

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
            })
        }
    }
}



