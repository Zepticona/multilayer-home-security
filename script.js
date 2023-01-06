document.querySelector('.password-field').style.display='none';
document.querySelector('.succes-message').style.display='none';
document.querySelector('.fail-message').style.display='none';
document.querySelector('.no-tries-remianing').style.display = 'none';
let triesRemaining = 1;

fetch('https://api.thingspeak.com/channels/1996273/feeds.json?api_key=0JYUOL5Q31LMBMFK&results=2')
.then(res => res.json())
.then(data => {
    waitingPassword = data.feeds[1].field6;
    console.log(waitingPassword);
    if(waitingPassword == 1) {
        document.querySelector('.password-field').style.display = 'inline-block';
        document.querySelector('.fingerprint-notifier').style.display = 'none';
    } else if(waitingPassword == 0) {
        document.querySelector('.password-field').style.display = 'none';
        document.querySelector('.fingerprint-notifier').style.display = 'inline-block';
    }
});

// document.querySelector('.warning-text').style.display='none';
let databaseData;
let waitingPassword;

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();

    let requiredPassword;
    const fingerprintId = databaseData.currentEntrance;

    for(let user in databaseData.users) {
        if(databaseData.users[user].id == fingerprintId) {
            console.log('Fingerprint user found with id: '+databaseData.users[user].id);
            requiredPassword = databaseData.users[user].password;
        } else {
            
        }
    }

    const userInput = Object.fromEntries(new FormData(e.target).entries());
    if(!triesRemaining) {
        document.querySelector('.password-field').style.display='none';
        document.querySelector('.no-tries-remianing').style.display = 'block';
    }
    if(userInput['password']==requiredPassword) {
        fetch('https://api.thingspeak.com/update?api_key=8GH5FISIM2GY8Z4L&field5=0&field6=0&field7=1')
        .then(res => res.json())
        .then(data => {        
            document.querySelector('.succes-message').style.display='block';        
            document.querySelector('.fail-message').style.display='none';        
        });
    } else {        
        document.querySelector('.succes-message').style.display='none';        
        document.querySelector('.fail-message').style.display='block';  
        document.querySelector('.tries-remaining').innerHTML = triesRemaining;
        triesRemaining--;
    }
    
});
document.querySelector(".restart").addEventListener("click", function() {
    fetch('https://api.thingspeak.com/update?api_key=8GH5FISIM2GY8Z4L&field5=1&field6=0&field7=0')
    .then(res => res.json())
    .then(data => {       
        setTimeout(() => location.reload(),1000) ;        
    })
    .catch(err=>console.log(err));
})


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
const firebaseConfig = {
apiKey: "AIzaSyCyUL_n_R-BL0mQpBRXhFJ7I5jl0R82YgA",
authDomain: "fingerprint-18576.firebaseapp.com",
databaseURL: "https://fingerprint-18576-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "fingerprint-18576",
storageBucket: "fingerprint-18576.appspot.com",
messagingSenderId: "343580357576",
appId: "1:343580357576:web:3f7fbb9c915c293a6446fd"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
import {getDatabase,get,  ref, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const db = getDatabase();

function getData() {
const dbref = ref(db);

get(child(dbref, "/"))
.then( snapshot => {          
    console.log(snapshot);
    if(snapshot.exists()) {
    databaseData = snapshot.val();
    console.log(databaseData); 
    const fingerprintId = databaseData.currentEntrance;
    for(let user in databaseData.users) {
        if(databaseData.users[user].id == fingerprintId) {
            document.querySelector('.username').insertAdjacentText('beforeend', user);
        } else {
            console.log(databaseData.users[user].id + " is not equal to " + fingerprintId )
        }
    }
    
    } 
})
}

window.onload = getData;