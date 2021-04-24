import React, { useState, useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import firebaseConfig  from '../config/firebaseConfig';
import * as firebaseui from "firebaseui";
import firebase from "firebase";
import 'firebaseui/dist/firebaseui.css';

const RegisterLoginComponent = () => {
    var history = useHistory();

    useEffect(() => {
        const uiConfig = {
        signInOptions: [{
                provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                defaultCountry: 'RU',
            }, 
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        tosUrl: "/",
        signInSuccessUrl: "/",
        };
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start("#firebaseui-auth-container", uiConfig);
    });
    return (
        <div style={{textAlign: 'center'}}>
            <h1>ВОЙДИТЕ</h1>
            <div id="firebaseui-auth-container"></div>
        </div>
    )
}

export default RegisterLoginComponent;