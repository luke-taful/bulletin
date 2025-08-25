"use client"
import React, { useState } from 'react';
import "../style/style.css";

export default function Login(){
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    
    
    return(
        <div className='formContainer'>
            <form>
                <label className="formElement">Username:</label>
                <input className="formElement" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <br/>
                <label className="formElement">Password:</label>
                <input className="formElement" type="text"></input>
            </form>
        </div>
    );
}