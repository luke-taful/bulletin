import React, {useState, useRef} from 'react';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import '../style/style.css';

export function Editor({ boardInfo, setBoardInfo, setEditing, username}){
  // const [blueprint, setBlueprint] = useState(persistentBP);
  const [blueprint, setBlueprint] = useState(boardInfo.blueprint)
  const [idNum, setIdNum] = useState(boardInfo.lastid + 1);
  const [textIn, setTextIn] = useState("");
  const [imgIn, setImgIn] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [imgDeleteList, stageImg] = useState ([]);

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
      name:imgName,
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
    var tempBoard = boardInfo;
    tempBoard.blueprint = blueprint;
    setBoardInfo(tempBoard);

    const result = await apiUpdate();
    if(result.success){
      if(imgDeleteList.length != 0){
        const imgResult = await imgDelete();
        if (!imgResult.success){alert(imgResult.message)};
      }
      setEditing(false);
    }
    else{alert(result.message)};
  };

  //Sending list of images that should be deleted from server storage
  async function imgDelete(){
    try{
      return await fetch('/deleteImage/', {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify({imgList: imgDeleteList})
      })
      .then((response) => response.json())
      .then((result) => {
        return(result);
      });
    }catch(error){return {success:false, message:"Server Error"}};
  }

  //Preserving blueprint
  async function apiUpdate(){
    try{
      return await fetch('/blueprint/', {
        method: 'POST',
        headers: {'Content-type' : 'application/json', 'username': username, 'lastid': idNum-1},
        body: JSON.stringify({blueprint})
      })
      .then((response) => response.json())
      .then((result) => {
        return(result);
      });
    }catch(error){return {success: false, message: "Server Error"}};
  };

  //Delete specific element by button press
  const handleDelete = (event) => {
    const target = blueprint.filter(item => item.id === Number(event.target.id))[0];
    //Stage Images to be deleted once the board is saved
    if(target.type == "img"){
      const tempArray = imgDeleteList;
      tempArray.push(target.name);
      stageImg(tempArray);
    }
    //Remove from working blueprint
    setBlueprint(blueprint.filter(item => item.id !== Number(event.target.id)));
  }

  //Draggable Position Handling
  const handleStop = (event, dragElement) => {
    dragElement.xpos = dragElement.x;
    dragElement.ypos = dragElement.y;
    //Updating BP on the fly
    var updateBP = blueprint;
    const targetElement = updateBP.find(item => item.id === Number(event.target.id));
    targetElement.xpos = dragElement.xpos;
    targetElement.ypos = dragElement.ypos;
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
      disabled={deleting}
      nodeRef={nodeRef}
      grid={[25, 25]}
      scale={1}
      onStop={handleStop}
      defaultPosition={{ x: items.xpos, y: items.ypos }}>
      <div id={items.id} ref={nodeRef} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
        <p id={items.id} className="userElement" style={{color: items.color, fontFamily: items.font, fontSize: items.textSize}}> {items.text} </p>
        
        {/* If delete is toggled, render the delete button */}
        {deleting && (
        <button id={items.id} className="deleteButton" onClick={handleDelete}>X</button>
        )}
      </div>
    </Draggable>
  )}

  function MakeImg({items}){    //Handles creating a new element with an image
    const nodeRef = useRef(null);
    return(
    <Draggable
      handle=".userElement"
      disabled={deleting}
      nodeRef={nodeRef}
      grid={[25, 25]}
      scale={1}
      onStop={handleStop}
      defaultPosition={{ x: items.xpos, y: items.ypos }}>
      <div ref={nodeRef} style={{width:"fit-content", height:"fit-content", cursor:"crosshair"}}>
        <img id={items.id} className="userElement" src={items.src} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
        
        {/* If delete is toggled, render delete button */}
        {deleting && (
        <button id={items.id} className="deleteButton" onClick={handleDelete}>X</button>
        )}
      </div>
    </Draggable>
  )}

  const handleDeleteClick = () => {setDeleting(!deleting)};

  if(deleting){
    return(
      <div id="board">
        <div>
          <button onClick={handleDeleteClick}>Done</button>
        </div>
        {/* Creating the custom elements */}
        {CreateElements(blueprint)}
      </div>
    );
  };

  //Actual Board Return
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
          <button onClick={handleDeleteClick}>Delete</button>
      </div>
      {/* Creating the custom elements */}
      {CreateElements(blueprint)}
    </div>
  );
}