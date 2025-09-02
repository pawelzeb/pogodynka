class Global {
    static user = null;
    static currentUserColor = "#4444AA";
    static fb = null;
    static firebaseApp;
    static currentSession = null;          //nazwa sesji pobrana z internetu albo od użytkownika    
    static bLive = false;               //jeśli currentSession && bLive tzn. aktualizuj w FB
    static nodeRef = null;
    static liveRef = null;                  //referencja do sesji LIVE
    static sessionOn = false;
    static adminRights = [];
    static email = "pogoda@mail.com";
    static password = "pogodynka321";
}

export default Global;