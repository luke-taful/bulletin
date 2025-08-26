"use client"
import React, { useState } from 'react';
import "../style/style.css";
import NewUser from './NewUser';

export default function Login(){
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState(false);
    const [register, setRegister] = useState(false);
    
    if (register){
        return(
            <NewUser setRegister={setRegister}/>
        )
    }
    else{

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log("Login request");
        };

        return(
            <div className='formContainer'>
                <form onSubmit={handleSubmit}>
                    <label className="formElement">Username:</label>
                    <input className="formElement" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    <p/>
                    <label className="formElement">Password:</label>
                    <input className="formElement" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button disabled={false}>Login</button>
                    <p/>
                </form>
                <button onClick={() => setRegister(true)}>Register New User</button>
            </div>
        );
    }
}