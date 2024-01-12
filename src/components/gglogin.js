import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import env from "react-dotenv";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton({handleLogin}) {
    const navigate = useNavigate();

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId:
                    "196742119836-eu1vlot0fiadvp5201kvijoh5ku8b07l.apps.googleusercontent.com",
                scope: "email",
            });
        }

        gapi.load("client:auth2", start);
    }, []);

    const onSuccess = (response) => {
        console.log("SUCCESS", response);
        // Extract email from the response
        const userEmail = response.profileObj.email;
        const serverURL = 'http://127.0.0.1:5000/api/create/account';

        // Dummy account data

        var accountData = {
            'username': userEmail
        }

        // Make an AJAX request using fetch
        fetch(serverURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(accountData),
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("username", userEmail)
                localStorage.setItem("password", 1)
                handleLogin()

            })
           


    };

    const onFailure = (response) => {
        console.log("FAILED", response);
    };

    const onLogoutSuccess = () => {
        console.log("SUCCESS LOG OUT");
    };

    return (
        <div>
            <GoogleLogin
                clientId={
                    "196742119836-eu1vlot0fiadvp5201kvijoh5ku8b07l.apps.googleusercontent.com"
                }
                onSuccess={onSuccess}
                onFailure={onFailure}
            />
        </div>
    );
}



export default GoogleLoginButton;