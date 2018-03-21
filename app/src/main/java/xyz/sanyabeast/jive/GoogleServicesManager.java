package xyz.sanyabeast.jive;

import android.content.Context;
import android.content.Intent;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;

import static android.support.v4.app.ActivityCompat.startActivityForResult;

/**
 * Created by SlimShady on 3/21/2018.
 */



public class GoogleServicesManager {
    private static final int RC_SIGN_IN = 123;
    Context context;
    GoogleServicesManager(Context c){
        context = c;
    }

    public boolean isSignedIn() {
        return GoogleSignIn.getLastSignedInAccount(context) != null;
    }
}
