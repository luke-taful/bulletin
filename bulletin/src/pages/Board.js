import blueprint from '../../public/blueprint.json';
import Image from 'next/image';


export default function Board(){
    return(
      <div id="board">
        {CreateElements(blueprint)}
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