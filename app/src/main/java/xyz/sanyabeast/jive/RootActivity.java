package xyz.sanyabeast.jive;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.KeyEvent;

import com.google.android.gms.common.api.ApiException;

/**
 * Created by Sanyabeast on 19.03.2018.
 */

public class RootActivity extends FragmentActivity {
    private String TAG = "Jive/RootActivity";

    public WebViewManager mWebViewManager;
    public GoogleServicesManager mGoogleServicesManager;
    public Storage mStorage;
    public AdsManager mAdsManager;
    public UITools mUITools;

    @Override
    public void onCreate(Bundle savedInstanceState ) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        mUITools = new UITools(this);
        mAdsManager = new AdsManager(this);
        mStorage = new Storage(this);
        mGoogleServicesManager = new GoogleServicesManager(this);
        mWebViewManager = new WebViewManager(this);
        mWebViewManager.open("file:///android_asset/index.html");
        mWebViewManager.set("activity", mWebViewManager);
    }

    @Override
    public void onResume(){
        super.onResume();
        Log.d(TAG, "onResume");
    }

    @Override
    public void onPause(){
        super.onPause();
        Log.d(TAG, "onPause");
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent){
        Log.d(TAG, "Processing intent result: requestCode - " + requestCode + ", resultCode - " + resultCode);
        if (mGoogleServicesManager.checkRequestCode(requestCode)){
            mGoogleServicesManager.processRequestCode(requestCode, resultCode, intent);
            return;
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        //Integer keycode = event.getKeyCode();
        //Log.d(TAG, keycode.toString());
        mWebViewManager.send(new Envelope("android.button.pressed", event));
        mWebViewManager.set("lastKeyEvent", event);
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

    public void runOnMainUIThread(Runnable runnable){
        new Handler(Looper.getMainLooper()).post(runnable);
    }



}
