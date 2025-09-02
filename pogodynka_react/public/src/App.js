import './assets/App.css';
import Main from './components/Main.tsx'
import { useEffect, createContext } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, set, off , child, onValue, Database} from "firebase/database";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth"
import Global from "./Global.js";
import sun from "./assets/sun_icon.png";
import { WeatherProvider } from "./provider/WeatherProvider.js"; // ← importuj Provider

const firebaseConfig = {
  apiKey: "AIzaSyBdMuzQU24tYjF99SBlFcfxp4c8_dn1-hI",
  authDomain: "pogodynka-e398e.firebaseapp.com",
  databaseURL: "https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pogodynka-e398e",
  storageBucket: "pogodynka-e398e.firebasestorage.app",
  messagingSenderId: "766903572746",
  appId: "1:766903572746:web:04919bbb638e3a2a38c2f3"
};

// function NoMobile() {
//   return(<div class="info"><div class="info-text">{"Aplikacja nie działa na urządzeniach mobilnych (;"}</div></div>);
// }
function notify(title, msg) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: `${msg}`,
        icon: `${sun}`
      });
    }
}

function getGlobalAlerts(fb) {
  const dbRef = ref(fb);
  const adminRef = child(dbRef, `msg1`);
  const that = this;
    let cnt = 0;
    onValue(adminRef, snapshot => {
      cnt++;
      if(cnt == 1) return;
      if (snapshot.exists()) {
        const msg = snapshot.val();
        notify('Globalny alert', msg)
      } 
    });
  }
  function rmLocalAlerts(fb, city) {
    const dbRef = ref(fb);
    const adminRef = child(dbRef, city);
    off(adminRef)
  }
  function addLocalAlerts(fb, city) {
    const dbRef = ref(fb);
    const adminRef = child(dbRef, city);
    const that = this;
    let cnt = 0;
    console.log("✅ cubscribing ", city);
    onValue(adminRef, snapshot => {
      cnt++;
      if(cnt == 1) return;
        if (snapshot.exists()) {
            const msg = snapshot.val();
            notify(city, msg);
        } 
    });
}


function App() {
  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);
  const auth = getAuth(firebaseApp);
  function unsubscribe(city) {
    console.log("❌ Unsubscribing:", city);
    rmLocalAlerts(database, city)
  }
  function subscribe(city) {
    console.log("❌ Subscribing:", city);
    addLocalAlerts(database, city)
  }

useEffect(() => {
      signInWithEmailAndPassword(auth, Global.email, Global.password)
      .then(userCredential => {
        const user = userCredential.user;
        getGlobalAlerts(database)
        let list = []
        if(localStorage.getItem("follow_cities"))
          list = JSON.parse(localStorage.getItem("follow_cities")) ?? []
        console.log(list)
        for(const city of list) {
          //console.log("*"+city)
          addLocalAlerts(database, city)
        }
  })
  .catch(error => {
    console.error("❌ Błąd logowania:", error.message);
  });
  }
);
  return (
    <WeatherProvider onUnsubscribe={unsubscribe} onSubscribe={subscribe}> 
      <div className="App">
        <Main />
      </div>
    </WeatherProvider>
  );
}

export default App;
