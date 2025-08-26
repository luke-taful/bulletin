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
        console.log("New User");
        setRegister(false);
    };

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
                <button  disabled={false}>Register User</button>
                {/* style={buttonDisabled ? formButtonDisabled : formButton} */}
                <p/>
            </form>
            <button onClick={() => setRegister(false)}>Back to Login</button>
        </div>
    );
}