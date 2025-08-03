import Image from "next/image";
import styles from "./page.module.css";
import layout from "./layout.js";

export default function Home() {
  return (
    <div className={styles.page}>
      <layout>
        <p>Hello World!</p>
      </layout>
    </div>
  );
}
