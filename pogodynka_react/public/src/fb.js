
let auth = false;    
let defaultApp = null;
let database = null;

//inicjalizuje połączenie z FireBase
function initFireBase(bInit)
{
    if(typeof defaultApp === "undefined" || defaultApp == null)
    {
        console.log("initFireBase");
        config = {
            apiKey: "AIzaSyBdMuzQU24tYjF99SBlFcfxp4c8_dn1-hI",
            authDomain: "pogodynka-e398e.firebaseapp.com",
            databaseURL: "https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "pogodynka-e398e",
            storageBucket: "pogodynka-e398e.firebasestorage.app",
            messagingSenderId: "766903572746",
            appId: "1:766903572746:web:04919bbb638e3a2a38c2f3"
        };
            if (firebase.apps.length === 0) {
                defaultApp = firebase.initializeApp(config);
                database = getDatabase(firebaseApp);
                const auth = getAuth(firebaseApp);
            }
            else {
                defaultApp = firebase;
            }
            signIn()
            setAlert("Jakiś alert", "Radom")
        }
    }

}
function signIn() {
    defaultApp.auth().signInWithEmailAndPassword("pogoda@mail.com",  "pogodynka321").catch(function(error) {
        if (error.errorCode === 'auth/wrong-password') {
            console.error("error_trying_to_login_to_server_database");
        } else {
            console.error(error.message);
        }
    });
}

function setAlert(msg, city) {
    if(!defaultApp) return;

    defaultApp.database().ref(city).set(msg, function(error){
            if(error){
                console.error("Nie dodało");
            }
            else{
                console.log("Data successfully saved to FB");
            }
        });
}

