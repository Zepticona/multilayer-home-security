
document.querySelector('.succes-message').style.display='none';        
document.querySelector('.fail-message').style.display='none'; 
// document.querySelector('.warning-text').style.display='none';
let data;
let passwordMatched;
fetch('https://api.thingspeak.com/channels/1996273/feeds.json?api_key=0JYUOL5Q31LMBMFK&results=2')
.then(res => res.json())
.then(data => {
    passwordMatched = data.feeds[1].field5;
    console.log(passwordMatched);
    if(passwordMatched == 1) {
        console.log('capturing');
        document.querySelector('.status-standby').style.display = 'none';
        document.querySelector('.status-capturing').style.display = 'inline-block';
    } else if(passwordMatched == 0) {
        console.log('stadning by');
        document.querySelector('.status-standby').style.display = 'inline-block';
        document.querySelector('.status-capturing').style.display = 'none';
    }
});

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();

    let requiredPassword;
    const fingerprintId = data.currentEntrance;

    for(let user in data.users) {
        if(data.users[user].id == fingerprintId) {
            console.log('Fingerprint user found with id: '+data.users[user].id);
            requiredPassword = data.users[user];
        } else {
            console.log(data.users[user].id + " is not equal to " + fingerprintId )
        }
    }

    const userInput = Object.fromEntries(new FormData(e.target).entries());
    if(userInput['password']==requiredPassword) {
        console.log('password matched');
        fetch('https://api.thingspeak.com/update?api_key=8GH5FISIM2GY8Z4L&field5=1')
        .then(res => res.json())
        .then(data => {        
            document.querySelector('.succes-message').style.display='block';        
            document.querySelector('.fail-message').style.display='none';        
        });
    } else {
        fetch('https://api.thingspeak.com/update?api_key=8GH5FISIM2GY8Z4L&field5=0')
        .then(res => res.json())
        .then(data => {        
            document.querySelector('.succes-message').style.display='none';        
            document.querySelector('.fail-message').style.display='block';           
        });
    }

    
});


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
            data = snapshot.val();
            console.log(data); 
            
          } 
        })
      }

      window.onload = getData