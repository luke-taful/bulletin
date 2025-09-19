import "../style/style.css";
import Landing from "../pages/Landing.js";


export default function Home() {

  return (
    <div className="page" style={{height: "100%", position:"fixed", zIndex: "0.5"}}>
      <Landing/>
    </div>
  );
};