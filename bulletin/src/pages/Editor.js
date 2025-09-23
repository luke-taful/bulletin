import React, {useState, useRef} from 'react';
import Draggable from 'react-draggable';
import Popup from 'reactjs-popup';
import '../style/style.css';
import { HexColorPicker } from 'react-colorful';

export function Editor({ boardInfo, setBoardInfo, setEditing, username}){
  // const [blueprint, setBlueprint] = useState(persistentBP);
  const [blueprint, setBlueprint] = useState(boardInfo.blueprint);
  const [idNum, setIdNum] = useState(boardInfo.lastid + 1);
  const [textIn, setTextIn] = useState("");
  const [imgIn, setImgIn] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [imgDeleteList, stageDelete] = useState([]);
  const [imgAddList, stageAdd] = useState([]);

  const [background, setBackground] = useState(boardInfo.background);
  const [selectedPrimary, setSelectedPrimary] = useState(background.colorPrimary);
  const [selectedSecondary, setSelectedSecondary] = useState(background.colorSecondary);

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
    //Stage image to be saved to backend
    const tempArray = imgAddList;
    tempArray.push([imgName, imgIn]);
    stageAdd(tempArray);

    //Update blueprint with new url
    setBlueprint([ ...blueprint,{
      id:idNum,
      type:"img",
      src:URL.createObjectURL(imgIn),
      name:imgName,
      text:"Image Unavailable",
      xpos:500,
      ypos:0
    }]);
    setIdNum(idNum + 1);
  }

  const SaveState = async () => {
    //Update image sources to point to server endpoint
    for(var i = 0; i < blueprint.length; i++){
      if(blueprint[i].type == "img"){
        blueprint[i].src = "http://localhost:5000/uploads/" + blueprint[i].name;
      }
    }
    //Update board info
    var tempBoard = boardInfo;
    tempBoard.blueprint = blueprint;
    setBoardInfo(tempBoard);
    //Send board update request to server
    const result = await apiUpdate();
    if(result.success){
      //Delete requested images
      if(imgDeleteList.length != 0){
        const imgResult = await imgDelete();
        if (!imgResult.success){alert(imgResult.message)};
      }
      //Save requested images
      for(var i = 0; i < imgAddList.length; i++){
        await ImagePost(imgAddList[i][0], imgAddList[i][1]);
      }
      setEditing(false);
    }
    else{alert(result.message)};
  };

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

  const ImagePost = async (imgName, image) => {
    try{
      response = await fetch('/images/', {
        method: 'POST',
        headers: {'Content-type' : 'image/jpeg', 'imgname': imgName},
        body: image
      })
      .then((response) => response.json())
      .then((result) => {
        return(result);
      });
    }catch(error){return {success: false, message: "Image upload error"}};
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

  //Delete specific element by button press
  const handleDelete = (event) => {
    const target = blueprint.filter(item => item.id === Number(event.target.id))[0];
    //Stage Images to be deleted once the board is saved
    if(target.type == "img"){
      var inAddList = false;
      for(var i = 0; i < imgAddList.length; i++){
        if (imgAddList[i][0] == target.name){
          inAddList = true;
        }
      }
      if(!inAddList){
        const tempArray = imgDeleteList;
        tempArray.push(target.name);
        stageDelete(tempArray);
      }
    }
    //Remove from working blueprint
    setBlueprint(blueprint.filter(item => item.id !== Number(event.target.id)));
  }


  //Element Loading ---------------------------------------------------------------
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


  //Update Handling ------------------------------------------------------
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

  //Toggle delete alt page
  const handleDeleteClick = () => {setDeleting(!deleting)};

  //Background customization
  const backgroundUpdate = (event) => {
    background.colorPrimary = selectedPrimary;
    background.colorSecondary = selectedSecondary;    
    background.pattern = event.target.value;
    if(background.pattern == "none"){
      background.colorSecondary = background.colorPrimary;
      background.pattern = "left";
    }
    setIdNum(idNum+1);
    console.log(background);
  };

  const handleColorChange = () => {
    background.colorPrimary = selectedPrimary;
    background.colorSecondary = selectedSecondary;
    setIdNum(idNum+1);
  };

  const backgroundCSS={background: `linear-gradient(to ${background.pattern}, ${background.colorPrimary} , ${background.colorSecondary} )`}


  //Return Options ------------------------------------------------
  if(deleting){
    return(
      <div id="board" style={backgroundCSS} key={idNum}>
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
    <div id="board" style={backgroundCSS} key={idNum}>
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


          {/* Background options */}
          <Popup trigger={<button>Background</button>} position="left top"> 
            <h4>Customize Background:</h4> <br/>
            <HexColorPicker color={background.colorPrimary} onChange={setSelectedPrimary}/>
            <HexColorPicker color={background.colorSecondary} onChange={setSelectedSecondary}/>
            <button className='colorConfirm' onClick={handleColorChange}>OK</button>

            <br/> <label>Gradient:</label> <br/>
            <input type='radio'id='none' value="none" name='backgroundType' onChange={backgroundUpdate}/><label htmlFor="none">Solid Colour</label>
            <br/>
            <input type='radio'id='up' value="top" name='backgroundType' onChange={backgroundUpdate}/><label htmlFor="up">Up</label>
            <input type='radio'id='down' value="bottom" name='backgroundType' onChange={backgroundUpdate}/><label htmlFor="down">Down</label>
            <input type='radio'id='left' value="left" name='backgroundType' onChange={backgroundUpdate}/><label htmlFor="left">Left</label>
            <input type='radio'id='right' value="right" name='backgroundType' onChange={backgroundUpdate}/><label htmlFor="right">Right</label>

          </Popup>
          <button onClick={handleDeleteClick}>Delete</button>
      </div>
      {/* Creating the custom elements */}
      {CreateElements(blueprint)}
    </div>
  );
}