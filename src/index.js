let nodes = []; // array to contain created and visible node obj
let links = []; // array to contain all created lines between obj
let descDiv, descText;

const colors = ['#ffa21a', '#ff6e83', '#ff6315', '#ffd2d4', '#ffd2d4', '#8ab662', '#7daa90', '#009245'];

let nodeData;

let stage;
let flag = 'true';

let grpSpace = document.getElementById('game');
let grpSpaceW = grpSpace.offsetWidth;
let grpSpaceH = grpSpace.offsetHeight;

let nodeW = 220;
let nodeH = 135;
let position = [{x: grpSpaceW/2-nodeW/2, y: nodeH/2}, {x: grpSpaceW/2-nodeW/2 - nodeW/1.5, y: nodeH*1.75}, {x: grpSpaceW/2-nodeW/2 + nodeW/1.5, y: nodeH*1.75}, {x: grpSpaceW/2-nodeW/2 + nodeW/1.5, y: nodeH*3}]

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
descText.innerHTML = 'p';
document.getElementById('descDiv').appendChild(descText);
descDiv.style.display = 'none';

function preload() {
    transformNodeStringToArray(nodeData);

    // funkcja, która transformuje słowa z nodeArray w description na linki
    for (let i = 0; i < nodeData.length; i++) {
        for(let j = 0; j < nodeData[i].networkArray.length; j++) {
            for(let k = 0; k < nodeData[i].networkArray[j].length; k++) {
                if(nodeData[i].description.indexOf(nodeData[i].networkArray[j][k]) > -1) {
                    let newString = nodeData[i].description.replace(nodeData[i].networkArray[j][k], '<a style="color:blue; margin: 0px; padding: 0px; " id="' + nodeData[i].networkArray[j][k] + '">' + nodeData[i].networkArray[j][k] + '</a>')
                    nodeData[i].description = newString;
                }
            }
        }  
    }

    for(let i = 0; i < 3; i++) {
        initialNode = new NodeObject(nodeData[i].name, nodeData[i].description, nodeData[i].symbol, nodeData[i].networkArray, nodeW, nodeH, position[i].x, position[i].y, colors[i], 'true', 'false');
        nodes.push(initialNode)
    }
}

function setup() {
    let canvas = createCanvas(grpSpaceW, innerHeight - 40);
    canvas.parent('#graph');

    function initialClick() {
        grpSpace.addEventListener("click", function() {
            for(let i = 0; i < nodes.length; i++) {
                
                    if ((mouseX > nodes[i].x) && (mouseX < nodes[i].x + nodes[i].width) &&
                    (mouseY > nodes[i].y) && (mouseY < nodes[i].y + nodes[i].height)) {

                        
                        if(nodes[i].clickable === 'true') {
            
                            nodes[i].click();

                            stage = 1;

                            if(stage === 1) {
                
                            nodes = nodes.filter(function(el) { return el.clicked === "true"; })
                            console.log(nodes)
                                

                                console.log(nodes[0].name)
                                console.log(nodes[0].description)

                            for(let h = 0; h < nodes.length; h++) {

                                descDiv.style.display = 'block';
                                descText.innerHTML = nodes[h].description;                  

                                if(nodes[h].x < grpSpaceW/3 && nodes[h].y < grpSpaceH/2) {
                        
                                }
        
                                if(nodes[h].x > grpSpaceW/3 && nodes[h].x < grpSpaceW/3*2 && nodes[h].y < grpSpaceH/2) {
                            
                                }
        
                                if(nodes[h].x > grpSpaceW/3*2 && nodes[h].y < grpSpaceH/2) {
                            
                                }
        
                                if(nodes[h].x < grpSpaceW/3 && nodes[h].y > grpSpaceH/2) {
                                    descDiv.style.left = nodes[h].x + nodes[h].width + 50 + "px";
                                }
        
                                if(nodes[h].x > grpSpaceW/3 && nodes[h].x < grpSpaceW/3*2 && nodes[h].y > grpSpaceH/2) {
                                    descDiv.style.left = 200 + "px";
                                }

                                if(nodes[h].x > grpSpaceW/3*2 && nodes[h].y > grpSpaceH/2) {
        
                                }

                                for(let j = 0; j < nodes[h].nodeArray.length; j++) {
                                    for(let k = 0; k < nodes[h].nodeArray[j].length; k++) {
                                                                        
                                        let newLink = document.getElementById(nodes[h].nodeArray[j][k])
                                                                        
                                        newLink.addEventListener("click", function () {
                                            console.log('clicked')
                                            //create new ellipse with a data z newLink jako name, wyszukaj to name i dane z nodeData
                                            //add data to nodes
                                            //hide the div with text (and clear data ? )
                                            // newLink równa się któremu nodeData[i].name ? 
                                            // wybierz ten [i] i dodaj obiekt do nodes
                                            console.log(nodes[h].nodeArray[j][k])
                                            for(let l = 0; l < nodeData.length; l++) {
                                                if(nodes[h].nodeArray[j][k] === nodeData[l].name) {
                                                    newNode = new NodeObject(nodeData[l].name, nodeData[l].description, nodeData[l].symbol, nodeData[l].networkArray, nodeW, nodeH, position[l].x, position[l].y, colors[l], 'true', 'false');
                                                    nodes.push(newNode);
                                                    descDiv.style.display = 'none';   
                                                    
                                                    console.log(stage)
                                                    console.log(nodes)
                                                }
                                            }
                                            
                                            //nodes.push();
                                        })     
                                
                                    } 
                                } stage = 0;
                                 console.log(stage)        
                            }    
                        } else {
        
            

                        }
                    }
                }
            }
                // można zrobić tak, że ten jeden aktywny el. jest wpychany w inną zmienną niż nodes, i potem tylko to się rende
            })  
            
        
        

        
    }
    
    initialClick();
}

function draw() {
    background('#d8d6d2');

    for(let i = 0; i < nodes.length; i++) {
        nodes[i].render();
    }  
    
}



