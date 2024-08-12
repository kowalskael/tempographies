let nodes = []; // array to contain created and visible node obj
const links = []; // array to contain all created lines between obj
let descDiv, descText;

const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];

let nodeData;

let stage;
let flag = 'true';

let grpSpace = document.getElementById('game');
let grpSpaceW = grpSpace.offsetWidth;
let grpSpaceH = grpSpace.offsetHeight;

fetch('diagram.json').then(
    (value) => {
        return value.json()
    }
).then(
    (value) => {
        nodeData = value;
    }
)


function preload() {
    transformNodeStringToArray(nodeData);

    // funkcja, która transformuje słowa z nodeArray w description na linki
    for (let i = 0; i < nodeData.length; i++) {
       
        for(let j = 0; j < nodeData[i].networkArray.length; j++) {

            for(let k = 0; k < nodeData[i].networkArray[j].length; k++) {
                console.log(nodeData[i].networkArray[j][k])
                console.log(nodeData[i].description.indexOf(nodeData[i].networkArray[j][k]))
    
                if(nodeData[i].description.indexOf(nodeData[i].networkArray[j][k]) > -1) {
                    
                    let newString = nodeData[i].description.replace(nodeData[i].networkArray[j][k], '<a href="#' + nodeData[i].networkArray[j][k] + '">' + nodeData[i].networkArray[j][k] + '</a>')
                    nodeData[i].description = newString;
                    console.log(nodeData[i].description)
                }
            }

            
        }
        
    }

    let nodeW = 220;
    let nodeH = 135;
    let position = [{x: grpSpaceW/2-nodeW/2, y: nodeH/2}, {x: grpSpaceW/2-nodeW/2 - nodeW/1.5, y: nodeH*1.75}, {x: grpSpaceW/2-nodeW/2 + nodeW/1.5, y: nodeH*1.75}]

    for(let i = 0; i < 3; i++) {
        initialNode = new NodeObject(nodeData[i].name, nodeData[i].description, nodeData[i].symbol, nodeData[i].nodeArray, nodeW, nodeH, position[i].x, position[i].y, colors[i], 'true', 'false');
        nodes.push(initialNode)
        stage = 'init';
    }
}

function setup() {
    let canvas = createCanvas(grpSpaceW, innerHeight - 40);
    canvas.parent('#graph');

    
    function initialClick() {
        if(stage === 'init') {
            grpSpace.addEventListener("click", function() {
                for(let i = 0; i < nodes.length; i++) {
                
                if ((mouseX > nodes[i].x) && (mouseX < nodes[i].x + nodes[i].width) &&
      (mouseY > nodes[i].y) && (mouseY < nodes[i].y + nodes[i].height)) {

        if(flag === 'true') {
           
                nodes[i].click();
                flag = 'false';
            
        nodes = nodes.filter(function(el) { return el.clicked === "true"; })
                stage = 'graph';
                console.log(nodes.length)

                for(let i = 0; i < nodes.length; i++) {
                    descDiv = document.createElement('div');
                    descDiv.setAttribute("id", "descDiv");
                    document.getElementById('graph').appendChild(descDiv);
                    descText = document.createElement("p");
                    descText.innerHTML = nodes[0].description;
                    document.getElementById('descDiv').appendChild(descText);
                                        

                    if(nodes[0].x < grpSpaceW/3 && nodes[0].y < grpSpaceH/2) {
                        
                    }
    
                    if(nodes[0].x > grpSpaceW/3 && nodes[0].x < grpSpaceW/3*2 && nodes[0].y < grpSpaceH/2) {
                        
                    }
    
                    if(nodes[0].x > grpSpaceW/3*2 && nodes[0].y < grpSpaceH/2) {
                        
                    }
    
                    if(nodes[0].x < grpSpaceW/3 && nodes[0].y > grpSpaceH/2) {
                        descDiv.style.left = nodes[0].x + nodes[0].width + 50 + "px";
                    }
    
                    if(nodes[0].x > grpSpaceW/3 && nodes[0].x < grpSpaceW/3*2 && nodes[0].y > grpSpaceH/2) {
                        descDiv.style.left = 200 + "px";
                    }
    
                    if(nodes[0].x > grpSpaceW/3*2 && nodes[0].y > grpSpaceH/2) {
    
                    }


                }
                
            }
        }
      }
                

                // można zrobić tak, że ten jeden aktywny el. jest wpychany w inną zmienną niż nodes, i potem tylko to się renderuje?
             
            })

            
        }

        if(stage != 'init') {

        }
    }
    
    initialClick();

}

function draw() {
    background('#d8d6d2');

    for(let i = 0; i < nodes.length; i++) {
        nodes[i].render();
    }  
    
}



