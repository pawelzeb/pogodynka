package com.projekt.pogodynka.db

import android.content.Context
import android.util.Log
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.Logger
import com.google.firebase.database.ValueEventListener
import com.projekt.pogodynka.Globalne

object FirebaseHelper {

    private var counter = 0;
    private fun logInAndRun(context: Context, callback: () -> Unit) {
        val auth = Firebase.auth
        auth.signOut()
        auth.signInWithEmailAndPassword(Globalne.email, Globalne.password)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    auth.isSignInWithEmailLink(Globalne.email)
                    Log.d("TAG", "signInWithEmail:success")
                    callback()
                }
                else {
                    val exception = task.exception
                    Log.e("TAG", "Błąd logowania: ${exception?.message}")
                    // Możesz też pokazać komunikat użytkownikowi
                }
            }
    }

    /**
     * pobieramy alert RCB z Firebase
     */
    fun setAlertRCBListener(context: Context, callback: (msg:String) -> Unit) {
        FirebaseDatabase.getInstance().setLogLevel(Logger.Level.DEBUG)

        logInAndRun(context, { setListener(callback) })
    }

    private fun setListener(callback: (msg:String) -> Unit) {
        // Sign in success, update UI with the signed-in user's information

        val database = FirebaseDatabase.getInstance("https://pogodynka-e398e-default-rtdb.europe-west1.firebasedatabase.app")
        var myRef = database.getReference("msg")


        myRef.addValueEventListener(object : ValueEventListener {
            override fun onDataChange(snapshot: DataSnapshot) {
                Log.i("TAG", "czyta ${snapshot.key} == ${snapshot.value}")
                if(counter >0)
                    callback(snapshot.value.toString())
                counter++
            }

            override fun onCancelled(error: DatabaseError) {
                // Obsługa błędu
                Log.e("TAG", "bład ${error.message}")
            }
        })
    }
    fun signOut() {
        val auth = Firebase.auth
        Log.d("FAP", "SignOut...")
        auth.signOut()
    }
}