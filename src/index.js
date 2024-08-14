let nodes = []; // array to contain created and visible node obj
let links = []; // array to contain all created lines between obj
let descDiv, descText;

// dane z kolorami, 8 pozycji
const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];

let nodeData;
let stage = 0;
let flag = 'true';

let grpSpace = document.getElementById('game');
let grpSpaceW = grpSpace.offsetWidth;
let grpSpaceH = grpSpace.offsetHeight;

let nodeW = 220;
let nodeH = 135;
// powiększyć/zmienić bazę pozycji
let position = [{ x: grpSpaceW / 2 - nodeW / 2, y: nodeH / 2 }, { x: grpSpaceW / 2 - nodeW / 2 - nodeW / 1.5, y: nodeH * 1.75 }, { x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 1.75 }, { x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 3 }, { x: grpSpaceW / 2 - nodeW / 2 - nodeW / 1.5, y: nodeH * 1.75 }, { x: grpSpaceW / 2 - nodeW / 2 + nodeW / 1.5, y: nodeH * 1.75 }]

fetch('diagram.json').then(
    (value) => {
        return value.json()
    }
).then(
    (value) => {
        nodeData = value;
    }
)

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
    let canvas = createCanvas(grpSpaceW, innerHeight - 40);
    canvas.parent('#graph');

    grpSpace.addEventListener("click", function () {
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

                descDiv.style.display = 'block';
                descText.innerHTML = nodes[0].description;
                descDiv.style.left = 200 + "px";
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

                let newLink = document.getElementById(nodes[i].nodeArray[j][k])
                console.log(newLink)
                newLink.addEventListener("click", function () {
                    console.log('clicked')

                    console.log(nodes[i].nodeArray[j][k])
                    for (let l = 0; l < nodeData.length; l++) {
                        if (nodes[i].nodeArray[j][k] === nodeData[l].name) {
                            newNode = new NodeObject(nodeData[l].name, nodeData[l].description, nodeData[l].symbol, nodeData[l].networkArray, nodeW, nodeH, 100 + 2 * l, 100 + 2 * l, colors[l], 'true', 'false');
                            nodes.push(newNode);
                            descDiv.style.display = 'none';

                            console.log(stage)
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



