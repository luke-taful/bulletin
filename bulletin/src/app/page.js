import Image from "next/image";
import "../style/style.css";
import layout from "./layout.js";
import Board from "../pages/Board";
import Login from "../pages/Login";


export default function Home() {

  return (
    <div className="page">
      <layout>
        <Login/>
      </layout>
    </div>
  );
}
