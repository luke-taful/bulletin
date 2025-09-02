import "../style/style.css";
import Layout from "./layout.js";
import Landing from "../pages/landing.js"


export default function Home() {

  return (
    <div className="page">
      <Layout>
        <Landing/>
      </Layout>
    </div>
  );
}
