import "../style/style.css";
import layout from "./layout.js";
import Landing from "../pages/landing.js"


export default function Home() {

  return (
    <div className="page">
      <layout>
        <Landing/>
      </layout>
    </div>
  );
}
