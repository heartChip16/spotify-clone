import { ACCESS_TOKEN, EXPIRES_IN,TOKEN_TYPE } from "../common";
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read";  
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const APP_URL = import.meta.env.VITE_APP_URL;

const authorizeUser = ()=>{
    const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;

    // var url = 'https://accounts.spotify.com/authorize';
    // url += '?response_type=token';
    // url += '&client_id=' + CLIENT_ID;
    // url += '&scope=' + scopes;
    // url += '&redirect_uri=' + REDIRECT_URI;
    // url += '&show_dialog=true';

    const handle = window.open(url,"login", "width=800, height=600");
    console.log('handle:', handle);
}

document.addEventListener("DOMContentLoaded", ()=>{

    const loginButton = document.getElementById("login-to-spotify");

    loginButton.addEventListener("click",authorizeUser);
    console.log("inside login.js, after authorize user");
    
    
})

window.setItemsInLocalStorage = ({accessToken, tokenType, expiresIn})=>{
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(TOKEN_TYPE, tokenType);
    localStorage.setItem(EXPIRES_IN, expiresIn);

}

window.addEventListener("load",()=>{
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    console.log("accessToken1: ", accessToken);
    if(accessToken){
        window.location.href = `${APP_URL}/dashboard/dashboard.html`;
    }
    console.log("window.location: ", window.location);

    if(window.opener !==null && !window.opener.closed) {

        window.focus();
        if(window.location.href.includes("error")){
            window.close();
        }
        console.log(window.location.hash);

        const {hash} = window.location;
        console.log(hash);
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        const tokenType = searchParams.get("token_type");
        const expiresIn =  searchParams.get("expires_in");
        console.log("accessToken2: ", accessToken);
        if(accessToken){
            window.close();
            window.opener.setItemsInLocalStorage({accessToken, tokenType, expiresIn});
            window.opener.location.href = `${APP_URL}/dashboard/dashboard.html`;
            // window.location.href = `${APP_URL}/dashboard/dashboard.html`;
            // window.opener.location.href = `${APP_URL}`;
        } else {
            window.close();
        }
    }
})