import React, {useState} from 'react';
import blueprint from '../../public/blueprint.json';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import Image from 'next/image';
import '../style/style.css';



const handleStop = (event, dragElement) => {
  dragElement.xpos = dragElement.x;
  dragElement.ypos = dragElement.y;
};

export default function EditorBoard(){

//Handlers for adding elements
  const[value, setValue] = useState("");
  //I have no idea why, but unless I handle the onclick like this, it adds a new element onChange
  function handle() {
    AddText(value);
  }

  return(
    
    <div id="board">
      <div>
        {/* Adding buttons for customization options */}
          <button onClick={SaveState}>Save</button>
          {/* popup to add new text */}
          <Popup trigger={<button> Add Text</button>} position="left center"> 
            <h4>Add Text:</h4>
            <input type="text" id="textIn"  onChange={(e) => {setValue(e.target.value)}}/><br/>
            <button id="atButton" onClick={handle}>Enter</button>
          </Popup>
          {/* popup to add new image */}
          <button onClick={AddImage}>Add Image</button>
      </div>

      {/* Creating the custom elements */}
      {CreateElements(blueprint)}
    </div>
  );
}

function CreateElements(items){
  //Create each custom element from the json blueprint and store in a list.
  const elements = items.map((item) => {
    const tempElements = [];
    if(item.type == "text"){
        tempElements.push(
          MakeText(item)
      )}
      if(item.type == "img"){
        tempElements.push(
          MakeImg(item)
      )}
    return tempElements;
  })
  //Wrap in another div, as react can only return 1 element per function.
  return(
    <div id="loadContainer">
      {elements}
    </div>
  );
}


function MakeText(items){   //Handles creating a new element with text 
  return(
  <Draggable
    grid={[25, 25]}
    scale={1}
    onStop={handleStop}
    defaultPosition={{ x: items.xpos, y: items.ypos }}>
    <div key={items.id} style={{width:"fit-content", height:"fit-content"}}>
      <p id={items.id} style={{color: items.color, fontFamily: items.font, fontSize: items.textSize}}> {items.text} </p>
    </div>
  </Draggable>
  )}

function MakeImg(items){    //Handles creating a new element with an image
  return(
  <Draggable
    grid={[25, 25]}
    scale={1}
    onStop={handleStop}
    defaultPosition={{ x: items.xpos, y: items.ypos }}>
    <div key={items.id} style={{width:"fit-content", height:"fit-content"}}>
      <img id={items.id} src={"next.svg"} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
    </div>
  </Draggable>
)}



function AddText(textIn){
    blueprint.push({
        id:4,
       type:"text",
        text: textIn, 
        color:"white",
        font:"Arial, Helvetica, sans-serif",
        textSize:"smaller",
        xpos:100,
        ypos:200
    });
    console.log(blueprint);
}

function AddImage(){
     //Open local file explorer
     //There should be some file type checking here
}

function SaveState(blueprint){
  const blueprintString = JSON.stringify(blueprint);
}