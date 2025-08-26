"use client"
import React, { useState } from 'react';
import "../style/style.css";

export default function NewUser({setRegister}){
    const [password, setPassword] = useState("");
    const [passValid, setPassValid] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setPending(true);
        if(username != "" && password != "" && password == passValid){
            newUserRequest();
        }
        setPending(false);
        setRegister(false);
    };

    async function newUserRequest(){
        let success = false;
        await fetch('/register/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({"username" : username, "password" : password})
        })
        .then((response) => response)
        .then((result) => {
        success = result.ok;
        console.log(result);
        });
    }

    return(
        <div className='formContainer'>
            <form onSubmit={handleSubmit}>
                <label className="formElement">Username:</label>
                <input className="formElement" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <br/>
                <label className="formElement">Password:</label>
                <input className="formElement" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <label className="formElement">Confirm Password:</label>
                <input className="formElement" value={passValid} onChange={(e) => setPassValid(e.target.value)}></input>
                <button  disabled={pending}>Register User</button>
                {/* style={buttonDisabled ? formButtonDisabled : formButton} */}
                <p/>
            </form>
            <button onClick={() => setRegister(false)}>Back to Login</button>
        </div>
    );
}