package xyz.sanyabeast.jive;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.AccountPicker;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;

import com.google.android.gms.common.api.GoogleApiClient;

/**
 * Created by User13 on 19.03.2018.
 */

public class RootActivity extends FragmentActivity {
     public WebToolchain mWebToolchain;
     public GServicesMan mGServicesMan;

     @Override
     public void onCreate(Bundle savedInstanceState ) {
         super.onCreate(savedInstanceState);

         setContentView(R.layout.activity_main);

         this.mGServicesMan = new GServicesMan(this);
         this.mWebToolchain = new WebToolchain(this);
         this.mWebToolchain.open("file:///android_asset/index.html");

         this.mGServicesMan.signInSilently();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        mWebToolchain.send(new Envelope("android", "button.pressed", event));
        return true;
    }

    public GServicesMan getmGServicesMan(){
         return mGServicesMan;
    }

}