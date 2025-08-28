"use client"
import React, { useState } from 'react';
import "../style/style.css";
import NewUser from './NewUser';

export default function Login(){
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [pending, setPending] = useState(false);
    const [register, setRegister] = useState(false);
    const [errorList, setErrorList] = useState([])
    const [user, setUser] = useState({});
    
    async function getUserData(){
        const userData = {"username" : username, "password" : btoa(password)};
        return await fetch('/login/', {
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({userData})
        })
        .then((response) => response.json())
        .then((result) => {
            return(result);
        });
    }

    const loginRequest = async () => {
        const response = await getUserData();
        setPending(false);
        if(response.success){
            setUser(response.user);
            console.log(response);
        }
        else{setErrorList(["User not found"])}
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPending(true);
        const tempFlags = [];
        if(username == "" || password == ""){
            tempFlags.push("Please enter a valid username and password");
        }
        if(tempFlags.length == 0){loginRequest()}
        else{setErrorList(tempFlags.map((flag, index) => (<li key={index}>{flag}</li>)));}
        console.log(user);
        setPending(false);
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
                    <label className="errorLabel">{errorList}</label>
                    <button className="formButton" disabled={pending}>Login</button>
                    <p/>
                </form>
                <button className="formButton" onClick={() => setRegister(true)}>Register New User</button>
            </div>
        );
    }
}