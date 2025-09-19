"use client"
import "../style/style.css";
import {Editor} from "./Editor"
import React, {useState, useRef} from "react";
import Draggable from 'react-draggable';

export default function Board({userInfo}){
  const [boardInfo, setBoardInfo] = useState(userInfo.boardinfo);
  const [editing, setEditing] = useState(false);

  const handleClick = () => {setEditing(true)};

  if(editing){
    return <Editor boardInfo={boardInfo} setBoardInfo={setBoardInfo} setEditing={setEditing} username={userInfo.user.username}/>};

  //Applying custom background style
  const background = boardInfo.background;
  const backgroundCSS = {    
    zIndex: "1",
    background: `linear-gradient(to ${background.direction}, ${background.colorPrimary} , ${background.colorSecondary} )`
  };

  return(
    <div id="board" style={backgroundCSS}>
      <button onClick={handleClick}>Edit</button>
      {CreateElements(boardInfo.blueprint)}
    </div>
  )
}

function CreateElements(items){
  //Create each custom element from the json blueprint and store in a list.
  const elements = items.map((item) => {
    if(item.type == "text"){
      return <MakeText items={item} key={item.id}/>}
    if(item.type == "img"){
      return <MakeImg items={item} key={item.id}/>}
    return null;
  })
  //Wrap in another div, as react can only return 1 element per function.
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
      nodeRef={nodeRef}
        disabled={true}
        defaultPosition={{ x: items.xpos, y: items.ypos }}>
        <div ref={nodeRef} style={{width:"fit-content", height:"fit-content"}}>
          <p id={items.id} style={{color: items.color, fontFamily: items.font, fontSize: items.textSize}}> {items.text} </p>
        </div>
      </Draggable>
  )};

function MakeImg({items}){    //Handles creating a new element with an image
  const nodeRef = useRef(null);
  return(
      <Draggable
        nodeRef={nodeRef}
        disabled={true}
        defaultPosition={{ x: items.xpos, y: items.ypos }}>
        <div ref={nodeRef} style={{width:"fit-content", height:"fit-content"}}>
          <img id={items.id} src={items.src} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
        </div>
      </Draggable>
)}