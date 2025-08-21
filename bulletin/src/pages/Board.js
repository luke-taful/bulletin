"use client"
import React, {useEffect, useState} from "react";
import { Editor } from "./Editor"

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
    return <Editor/> ;
    // setEditing={setEditing} blueprint = {blueprint}
  };

  const handleClick = () => {setEditing(true)};

  return(
    <div id="board">
      {CreateElements(blueprint)}
      <button onClick={handleClick}>Edit</button>
    </div>
  )
}


function CreateElements(items){
  const elements = items.map(items => {
    const tempElements = [];

      if(items.type == "text"){
        tempElements.push(
          <div key={items.id}>
            <p style={{
              color: items.color, fontFamily: items.font, fontSize: items.textSize,
              position: 'absolute', top: items.ypos, left: items.xpos
              }}>
                {items.text}</p>
          </div>
      )}
      if(items.type == "img"){
        tempElements.push(
          <div key={items.id}>
            <img src={"/next.svg"} alt={items.text} width={items.size} height={items.size}
            style={{position:'absolute', top: items.ypos, left: items.xpos}}
            ></img>
          </div>
      )}

    return tempElements;
  })
  return(
    <div id="loadContainer">
      {elements}
    </div>
  )
}