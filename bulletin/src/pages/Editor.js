import React, {useState} from 'react';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import '../style/style.css';

//Draggable Position Handling
const handleStop = (event, dragElement) => {
  dragElement.xpos = dragElement.x;
  dragElement.ypos = dragElement.y;
};

export function Editor({ blueprint, setBlueprint, setEditing }){
  
  const [idNum, setIdNum] = useState(blueprint.length + 1)
  const [textIn, setTextIn] = useState("");
  const [imgIn, setImgIn] = useState("");


  //Manage adding new Elements
  const addText = () => {
    setBlueprint([ ...blueprint,{
        id:idNum,
       type:"text",
        text: textIn, 
        color:"black",
        font:"Arial, Helvetica, sans-serif",
        textSize:"smaller",
        xpos:100,
        ypos:200
    }]);
    setIdNum(idNum + 1);
  }
  const AddImage = () => {
    setBlueprint([ ...blueprint,{
      id:idNum,
      type:"img",
      src:URL.createObjectURL(imgIn),
      text:"Image Unavailible",
      xpos:100,
      ypos:200
    }]);
    setIdNum(idNum + 1);
  }

  //Preserving blueprint
  function SaveState(){
    const blueprintString = JSON.stringify(blueprint);
    console.log(blueprintString);
    setEditing(false);
  }

  return(
    <div id="board">
      <div>
        {/* Adding buttons for customization options */}
          <button onClick={SaveState}>Save</button>
          {/* popup to add new text */}
          <Popup trigger={<button>Add Text</button>} position="left center"> 
            <h4>Add Text:</h4>
            <input type="text" id="textIn"  onChange={(e) => {setTextIn(e.target.value)}}/><br/>
            <button id="atButton" onClick={addText}>Enter</button>
          </Popup>
          {/* popup to add new image */}
          <Popup trigger={<button>Add File</button>} position="left center"> 
            <input type="file" id="imgIn" name="imgIn" accept="image/png, image/jpeg" onChange={(e) => {setImgIn(e.target.files[0])}}/> 
            <button id="atButton" onClick={AddImage}>Enter</button>
          </Popup>
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
    <div key={items.id} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
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
    <div key={items.id} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
      <img id={items.id} src={items.src} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
    </div>
  </Draggable>
)}