"use client"
import localBP from "../../public/blueprint.json"
import React, {useEffect, useState} from "react";
import { Editor } from "./Editor"
import Draggable from 'react-draggable';


export default function Board(){

  const [blueprint, setBlueprint] = useState();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {

   fetch('/api/')
      .then((response) => response.json())
      .then((data) => {
        setBlueprint(data);
        setLoading(false);
      });
  }, []);

  if (loading){return <p>Loading...</p>};
  if(editing){
    return(    
      <div>
        <Editor blueprint={blueprint} setBlueprint={setBlueprint} setEditing={setEditing} /> ;
      </div>
    );
  };

  const handleClick = () => {setEditing(true)};

  return(
    <div id="board">
      {CreateElements(blueprint)}
      <button onClick={handleClick}>Edit</button>
    </div>
  )
}


// function CreateElements(items){
//   const elements = items.map(items => {
//     const tempElements = [];

//       if(items.type == "text"){
//         tempElements.push(
//           <div key={items.id}>
//             <p style={{
//               color: items.color, fontFamily: items.font, fontSize: items.textSize,
//               position: 'absolute', top: items.ypos, left: items.xpos
//               }}>
//                 {items.text}</p>
//           </div>
//       )}
//       if(items.type == "img"){
//         tempElements.push(
//           <div key={items.id}>
//             <img src={items.src} alt={items.text} width={items.size} height={items.size}
//             style={{position:'absolute', top: items.ypos, left: items.xpos}}
//             ></img>
//           </div>
//       )}

//     return tempElements;
//   })
//   return(
//     <div id="loadContainer">
//       {elements}
//     </div>
//   )
// }




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
    disabled={true}
    defaultPosition={{ x: items.xpos, y: items.ypos }}>
    <div key={items.id} style={{width:"fit-content", height:"fit-content"}}>
      <p id={items.id} style={{color: items.color, fontFamily: items.font, fontSize: items.textSize}}> {items.text} </p>
    </div>
  </Draggable>
  )}

function MakeImg(items){    //Handles creating a new element with an image
  return(
  <Draggable
    disabled={true}
    defaultPosition={{ x: items.xpos, y: items.ypos }}>
    <div key={items.id} style={{width:"fit-content", height:"fit-content"}}>
      <img id={items.id} src={items.src} alt={items.text} width={items.size} height={items.size} draggable="false"></img>
    </div>
  </Draggable>
)}