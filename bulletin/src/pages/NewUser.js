"use client"
import React, { useState } from 'react';
import "../style/style.css";

export default function NewUser({setRegister}){
    const [password, setPassword] = useState("");
    const [passValid, setPassValid] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState("");

    async function newUserRequest(){
        const userData = {"username" : username, "password" : btoa(password)};
        return await fetch('/register/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({userData})
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            return(result.success);
        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setPending(true);
        var success = false;
        if(username != "" && password != "" && password == passValid){
            success = await newUserRequest();
        }
        setPending(false);
        console.log(success);
        if(success){
            alert("User Created Successfully");
            setRegister(false);
        }
        else{alert("User already exists");}
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
                <button  disabled={pending}>Register User</button>
                {/* style={buttonDisabled ? formButtonDisabled : formButton} */}
                <p/>
            </form>
            <button onClick={() => setRegister(false)}>Back to Login</button>
        </div>
    );
}