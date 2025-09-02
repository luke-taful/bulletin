"use client"
import Board from "../pages/Board";
import Login from "../pages/Login";
import "../style/style.css";
import React, {useState} from "react";

//Handle global states, and spawn relevent child objects; board, login, ect

export default function Landing(){
    const [userInfo, setUserInfo] = useState();

    if(userInfo){return <Board userInfo={userInfo}/>}
    return <Login setUserInfo={setUserInfo}/>
}