package xyz.sanyabeast.jive;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;

import com.google.android.gms.common.AccountPicker;
import com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener;

import com.google.android.gms.common.api.GoogleApiClient;

/**
 * Created by User13 on 19.03.2018.
 */

public class Main extends FragmentActivity
{
     WebToolchain webtoolchain;
     GoogleServicesManager gsm;

     @Override
     public void onCreate(Bundle savedInstanceState ) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.gsm = new GoogleServicesManager(this);
        this.webtoolchain = new WebToolchain(this, gsm);
        this.webtoolchain.open("file:///android_asset/index.html");

//        this.gsm.connectGoogleApiClient();
         this.gsm.signIn();
    }

    @Override
    public void onStop(){
        this.gsm.disconnectGoogleApiClient();
        super.onStop();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        webtoolchain.send(new Envelope("android", "button.pressed", event));
        return true;
    }
}
