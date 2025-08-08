import Image from "next/image";
import styles from "./page.module.css";
import layout from "./layout.js";
import Board from "../pages/Board";

async function getBP(){
  const url = "http://localhost:5000";
  const data = {
    method: 'GET',
    headers: {
      'content-type': 'application/json', 
    }};
  const response = await fetch(url);
  const out = (await response.json());
  return out;
}


export default function Home() {

  var blueprint = JSON.stringify({state:"empty"});
  const recieveBP = async() => {blueprint = await getBP(); console.log(blueprint);}
  recieveBP()
  console.log(blueprint);

  return (
    <div className={styles.page}>
      <layout>
        <Board/>
      </layout>
    </div>
  );
}
