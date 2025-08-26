"use client"
import React, { useState } from 'react';
import "../style/style.css";
import NewUser from './NewUser';

export default function Login(){
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState(false);
    const [register, setRegister] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setPending(true);
        if(username != "" && password != ""){
            getUserData();
        }
        setPending(false);
    };

    async function getUserData(){
        let success = false;
        await fetch('/login/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({"username" : username, "password" : btoa(password)})
        })
        .then((response) => response)
        .then((result) => {
        success = result.ok;
        console.log(result);
        });
    }


    if (register){
        return(
            <NewUser setRegister={setRegister}/>
        )
    }
    else{
        return(
            <div className='formContainer'>
                <form onSubmit={handleSubmit}>
                    <label className="formElement">Username:</label>
                    <input className="formElement" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    <p/>
                    <label className="formElement">Password:</label>
                    <input className="formElement" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <button disabled={pending}>Login</button>
                    <p/>
                </form>
                <button onClick={() => setRegister(true)}>Register New User</button>
            </div>
        );
    }
}