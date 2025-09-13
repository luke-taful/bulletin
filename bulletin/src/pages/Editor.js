import React, {useState, useRef} from 'react';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import '../style/style.css';

export function Editor({ blueprint, setBlueprint, setEditing, username}){
  // const [blueprint, setBlueprint] = useState(persistentBP);
  const [idNum, setIdNum] = useState(blueprint.length);
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
        xpos:500,
        ypos:0
    }]);
    setIdNum(idNum + 1);
  }

  const AddImage = async () => {
    const imgName = username + "$" + Date.now() + ".jpeg";
    //Send image to backend
    await ImagePost(imgName);
    //Update blueprint with new url
    setBlueprint([ ...blueprint,{
      id:idNum,
      type:"img",
      src:"http://localhost:5000/uploads/" + imgName,
      text:"Image Unavailable",
      xpos:500,
      ypos:0
    }]);
    setIdNum(idNum + 1);
  }

  const ImagePost = async (imgName) => {
    try{
      response = await fetch('/images/', {
        method: 'POST',
        headers: {'Content-type' : 'image/jpeg', 'imgname': imgName},
        body: imgIn
      })
      .then((response) => response.json())
      .then((result) => {
        return(result);
      });
    }catch(error){return {success: false, message: "Image upload error"}};
  };

  const SaveState = async () => {
    const result = await apiUpdate();
    if(result.success){setEditing(false);}
    else{alert(result.message);}
  };

  //Preserving blueprint
  async function apiUpdate(){
    try{
      return await fetch('/blueprint/', {
        method: 'POST',
        headers: {'Content-type' : 'application/json', 'username': username},
        body: JSON.stringify({blueprint})
      })
      .then((response) => response.json())
      .then((result) => {
        return(result);
      });
    }catch(error){return {success: false, message: "Server Error"}};
  };

  const deleteElement = (event) => {
    console.log(event);
  }

  //Draggable Position Handling
  const handleStop = (event, dragElement) => {
    dragElement.xpos = dragElement.x;
    dragElement.ypos = dragElement.y;
    var updateBP = blueprint;
    updateBP[(event.target.id)].xpos = dragElement.xpos;
    updateBP[(event.target.id)].ypos = dragElement.ypos;
    setBlueprint(updateBP);
  };

  function CreateElements(items){
    //Create each custom element from the json blueprint and store in a list.
    const elements = items.map((item) => {
      if(item.type == "text"){
        return <MakeText items={item} key={item.id}/>}
      if(item.type == "img"){
        return <MakeImg items={item} key={item.id}/>}
    })
    return(
      <div id="loadContainer">
        {elements}
      </div>
    );
  }

  function MakeText({items}){   //Handles creating a new element with text 
    const nodeRef = useRef(null);
    return(
    <Draggable
      handle=".userElement"
      nodeRef={nodeRef}
      grid={[25, 25]}
      scale={1}
      onStop={handleStop}
      defaultPosition={{ x: items.xpos, y: items.ypos }}>
      <div ref={nodeRef} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
        <p id={items.id} className="userElement" style={{color: items.color, fontFamily: items.font, fontSize: items.textSize}}> {items.text} </p>
        <button className="deleteButton" onClick={deleteElement}>X</button>
      </div>
    </Draggable>
  )}

  function MakeImg({items}){    //Handles creating a new element with an image
    const nodeRef = useRef(null);
    return(
    <Draggable
      handle=".userElement"
      nodeRef={nodeRef}
      grid={[25, 25]}
      scale={1}
      onStop={handleStop}
      defaultPosition={{ x: items.xpos, y: items.ypos }}>
      <div ref={nodeRef} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
        <img id={items.id} className="userElement" src={items.src} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
        <button className="deleteButton" onClick={deleteElement}>X</button>
      </div>
    </Draggable>
  )}

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