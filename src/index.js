let nodes = []; // array to contain created and visible node obj
let descDiv, descText;

// dane z kolorami, 8 pozycji
const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];
let randomColor;

let nodeData;
let stage = 0;
let flag = 'true';

let grpSpace = document.getElementById('game');
let graph = document.getElementById('graph');
let grpSpaceW = grpSpace.offsetWidth;
let grpSpaceH = grpSpace.offsetHeight;

let nodeW = 220;
let nodeH = 135;

let positionNodeX = 0;
let positionNodeY = 0;
let distanceNode;

let position = [{ x: grpSpaceW / 2 - nodeW / 2, y: nodeH / 2 }, { x: grpSpaceW / 2 - nodeW / 2 - nodeW / 1.5, y: nodeH * 1.75 }, { x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 1.75 }]

fetch('diagram.json').then(
    (value) => {
        return value.json()
    }
).then(
    (value) => {
        nodeData = value;
    }
)

function distance(x1, x2, y1, y2) {
    let dx = x2 - x1;
    dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy)
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
    transformNodeStringToArray(nodeData);
    transformWordsToLinks(nodeData);

    for (let i = 0; i < 3; i++) {
        initialNode = new NodeObject(nodeData[i].name, nodeData[i].description, nodeData[i].symbol, nodeData[i].networkArray, nodeW, nodeH, position[i].x, position[i].y, colors[i], 'true', 'false');
        nodes.push(initialNode);
    }
}

function setup() {
    let canvas = createCanvas(grpSpaceW, innerHeight);
    canvas.parent('#graph');

    grpSpace.addEventListener("dblclick", function () {
        if (stage === 0) {
            init();
            stage = 1;
        }

        addDesc();
        addNode();

        // można zrobić tak, że ten jeden aktywny el. jest wpychany w inną zmienną niż nodes, i potem tylko to się renderuje
    })
}

function init() {
    for (let i = 0; i < nodes.length; i++) {
        if ((mouseX > nodes[i].x) && (mouseX < nodes[i].x + nodes[i].width) &&
            (mouseY > nodes[i].y) && (mouseY < nodes[i].y + nodes[i].height)) {
            // jeśli el. jest klikalny, wykonaj usunięcie nieklikniętych el. i pokaż div z tekstem el.
            if (nodes[i].clickable === 'true') {
                nodes[i].click(); // flagowanie - był kliknięty, nie jest już klikalny
                nodes = nodes.filter(function (el) { return el.clicked === "true"; })

                // przesuń element w konkretne miejsce
                nodes[0].x = 70;
                nodes[0].y = 70;

                descDiv.style.display = 'block';
                descText.innerHTML = nodes[0].description;
                descDiv.style.left = 350 + "px";
                descDiv.style.top = 50 + "px";
                console.log('clicked initial ' + nodes[0].name)
            }
        }
    }
}

// funkcja dodająca/chowająca opis el. z drugiego etapu (po init)
function addDesc() {
    for (let i = 0; i < nodes.length; i++) {
        if ((mouseX > nodes[i].x) && (mouseX < nodes[i].x + nodes[i].width) &&
            (mouseY > nodes[i].y) && (mouseY < nodes[i].y + nodes[i].height)) {
            if (nodes[i].clickable === 'true') {
                descDiv.style.display = 'block';
                descText.innerHTML = nodes[i].description;
                descDiv.style.left = 200 + "px"; // pozycjonowanie do zmiany
            }
        }
    }
}

// funkcja dodająca kolejne el. w drugim etapie (po init)
function addNode() {

    for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].nodeArray.length; j++) {
            for (let k = 0; k < nodes[i].nodeArray[j].length; k++) {

                let newLink = document.getElementById(nodes[i].nodeArray[j][k]);
                console.log(newLink);

                newLink.addEventListener("click", function () {
                    for (let l = 0; l < nodeData.length; l++) {
                        if (nodes[i].nodeArray[j][k] === nodeData[l].name) {
                            console.log(nodes[i].nodeArray[j][k])

                            distanceNode = distance(nodes[nodes.length - 1].x, nodes[nodes.length - 1].x + nodeW, nodes[nodes.length - 1].y, nodes[nodes.length - 1].y + nodeH);
                            console.log(distanceNode)
                            positionNodeX = Math.cos(2 * Math.PI) * distanceNode;
                            positionNodeY = Math.sin(Math.PI / 4) * distanceNode;

                            randomColor = Math.floor(Math.random() * colors.length);


                            newNode = new NodeObject(nodeData[l].name, nodeData[l].description, nodeData[l].symbol, nodeData[l].networkArray, nodeW, nodeH, positionNodeX, positionNodeY, colors[randomColor], 'true', 'false');
                            nodes.push(newNode);
                            descDiv.style.display = 'none';
                            console.log(nodes)
                        }
                    }
                })
            }
        }
    }

}



function draw() {
    background('#d8d6d2');

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].render();
    }

}



