"use client"
import React, { useState } from 'react';
import "../style/style.css";

export default function NewUser({setRegister}){
    const [password, setPassword] = useState("");
    const [passValid, setPassValid] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState("");
    const [errorList, setErrorList] = useState([]);

    async function newUserRequest(){
        const userData = {"username" : username, "password" : btoa(password)};
        return await fetch('/register/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({userData})
        })
        .then((response) => response.json())
        .then((result) => {
            return(result.success);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const tempFlags = [];
        
        if(username == "" || password == ""){
            tempFlags.push("Please enter a valid username and password");
        }
        if(password != passValid){
            tempFlags.push("Passwords do not match");
        }

        if(tempFlags.length == 0){handleNewUser()}

        else{setErrorList(tempFlags.map((flag, index) => (<li key={index}>{flag}</li>)));}
    }

    const handleNewUser = async () => {
        setErrorList("");
        setPending(true);
        var success = false;
        
        success = await newUserRequest();
        setPending(false);
        if(success){
            alert("User Created Successfully");
            setRegister(false);
        }
        else{setErrorList(["User already exists"]);}
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
                <label className="errorLabel">{errorList}</label>
                <button className='formButton' disabled={pending}>Register User</button>
                {/* style={buttonDisabled ? formButtonDisabled : formButton} */}
                <p/>
            </form>
            <button className='formButton' onClick={() => setRegister(false)}>Back to Login</button>
        </div>
    );
}