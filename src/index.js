let nodes = []; // array to contain created and visible node obj
let descDiv, descText;

// dane z kolorami, 8 pozycji
const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];
let randomColor;

let nodeData;
let stageInit = true;
let newLink;

const grpSpace = document.getElementById('game');
const graph = document.getElementById('graph');
let grpSpaceW = grpSpace.offsetWidth;

const nodeW = 220;
const nodeH = 135;

let nxtNodeX = 0, nxtNodeY = 0, nxtNodeDist = 0;
let updatedX = 0, updatedY = 0;

const position = [{x: grpSpaceW / 2 - nodeW / 2, y: nodeH / 2}, {
    x: grpSpaceW / 2 - nodeW / 2 - nodeW / 1.5,
    y: nodeH * 1.75
}, {x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 1.75}]

fetch('diagramv0.2.json').then(
    (value) => {
        return value.json();
    }
).then(
    (value) => {
        nodeData = value;
    }
)

function distance(x1, x2, y1, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

let lastX = 0, lastY = 0;
let currentX = 0, currentY = 0;

function moveAt(x, y) {
    currentX = x;
    currentY = y; // aktualna pozycja graphu
    graph.style.transform = `translate(${x}px, ${y}px)`;
}

function onMouseDown(e) {
    lastX = e.clientX - currentX;
    lastY = e.clientY - currentY; // zmienne pomocnicze do zmierzenia offsetu
    document.addEventListener('mousemove', onMouseMove);
}

function onMouseMove(e) {
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
descText = document.createElement("id");
descText.innerHTML = 'no description';
document.getElementById('descDiv').appendChild(descText);
descDiv.style.display = 'none';

function preload() {
    transformWordsToLinks(nodeData);

    let initialNode;
    for (let i = 0; i < 3; i++) {
        initialNode = new NodeObject(nodeData[i], position[i].x, position[i].y, colors[i]);
        nodes.push(initialNode);
        console.log(nodes)
    }
}

function setup() {
    let canvas = createCanvas(grpSpaceW, innerHeight);
    canvas.parent('#graph');

    for (let i = 0; i < nodes.length; i++) {

        grpSpace.addEventListener("dblclick", function () {
            init(nodes[i])
        });

        grpSpace.addEventListener("dblclick", function () {
            addNxtNodes(nodes[i])
        })
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
    console.log(nodes)
    nodes[0].x = 70;
    nodes[0].y = 70;

    node.clicked = false;
    node.clickable = true;

    stageInit = false;
}


// funkcja dodająca/chowająca opis el. z drugiego etapu (po init)
function addNxtNodes(node) {
    console.log(node)
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
    descDiv.style.left = 350 + "px";
    descDiv.style.top = 50 + "px";
    console.log('clicked initial ' + node.name)

    for (let j = 0; j < node.networkArray.length; j++) {
        createNewNode(node.networkArray[j]);
    }
    node.click();
}

function createNewNode(node) {
    newLink = document.getElementById(node);
    newLink.addEventListener("dblclick", function () {
        let newNode;

        for (let l = 0; l < nodeData.length; l++) {
            if (node === nodeData[l].name) {
                console.log(node)

                nxtNodeDist = distance(nodes[nodes.length - 1].x, nodes[nodes.length - 1].x + nodeW, nodes[nodes.length - 1].y, nodes[nodes.length - 1].y + nodeH);
                nxtNodeX = Math.cos(2 * Math.PI) * nxtNodeDist;
                nxtNodeY = Math.sin(Math.PI / 4) * nxtNodeDist;

                console.log(nxtNodeX)
                console.log(nxtNodeY)

                randomColor = Math.floor(Math.random() * colors.length);

                newNode = new NodeObject(nodeData[l], nxtNodeX, nxtNodeY, colors[randomColor]);
                nodes.push(newNode);
                descDiv.style.display = 'none';

                updatedX = nxtNodeX;
                updatedY = nxtNodeY;
            }
        }
    })
}


function draw() {
    background('#d8d6d2');

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].render();
    }

}



