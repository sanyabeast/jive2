package xyz.sanyabeast.jive;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
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
    private static String TAG = "RootActivity";
    public WebToolchain mWebToolchain;
    public GServicesMan mGServicesMan;
    public Storage mStorage;
    public AdsManager mAdsManager;

    @Override
    public void onCreate(Bundle savedInstanceState ) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        mAdsManager = new AdsManager(this);
        mStorage = new Storage(this);
        mGServicesMan = new GServicesMan(this);
        mWebToolchain = new WebToolchain(this);
        mWebToolchain.open("file:///android_asset/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //Integer keycode = event.getKeyCode();
        //Log.d(TAG, keycode.toString());
        mWebToolchain.send(new Envelope("android.button.pressed", event));
        return true;
    }


    public void handleException(Exception e, String details) {
        int status = 0;

        if (e instanceof ApiException) {
            ApiException apiException = (ApiException) e;
            status = apiException.getStatusCode();
        }

        String message = getString(R.string.status_exception_error, details, status, e);

        new AlertDialog.Builder(RootActivity.this)
                .setMessage(message)
                .setNeutralButton(android.R.string.ok, null)
                .show();
    }

    public void showInterstitial(){
        mAdsManager.showInterstitial();
    }

    public void runOnUIThread(Runnable runnable){
        new Handler(Looper.getMainLooper()).post(runnable);
    }

}
