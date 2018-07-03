package xyz.sanyabeast.lure;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.util.Log;
import android.view.KeyEvent;
import android.view.inputmethod.BaseInputConnection;
import android.webkit.JavascriptInterface;

import com.google.gson.Gson;

import xyz.sanyabeast.lure.JavascriptInterface.Resources;
import xyz.sanyabeast.lure.JavascriptInterface.SystemInfo;

/**
 * Created by Sanyabeast on 19.03.2018.
 */

public class JavaScriptInterface {
    private String TAG = "Jive/JavaScriptInterface";
    private Context context;
    private Activity activity;
    private RootActivity rootActivity;
    private Gson gson = new Gson();
    private Storage storage;
    private AdsManager mAdsManager;
    private SystemInfo mSystemInfo;
    private Resources mResources;

    JavaScriptInterface(Context c){
        context = c;
        activity = (Activity) c;
        rootActivity = (RootActivity) c;
        storage = rootActivity.mStorage;
        mAdsManager = rootActivity.mAdsManager;
        mSystemInfo = new SystemInfo(c);
        mResources = new Resources(c);

    }

    /**System methods*/
    @JavascriptInterface
    public void sysKeyDown(String keycode){
        BaseInputConnection mInputConnection = new BaseInputConnection(rootActivity.mWebViewManager.mWebView, true);

        int intKeyCode = Integer.parseInt(keycode);

        try {
            rootActivity.waitingKeyPressCode = intKeyCode;
            mInputConnection.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_DOWN, intKeyCode));
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
        }
    }

    public void sysKeyUp(String keycode){
        BaseInputConnection mInputConnection = new BaseInputConnection(rootActivity.mWebViewManager.mWebView, true);

        try {
            mInputConnection.sendKeyEvent(new KeyEvent(KeyEvent.ACTION_UP, Integer.parseInt(keycode)));
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
        }
    }

    @JavascriptInterface
    public void sysExit(){
        Activity activity = (Activity)context;
        if (Build.VERSION.SDK_INT >= 16) activity.finishAffinity();
        System.exit(0);
    }

    @JavascriptInterface
    public String sysGetConfig(){
        try {
            return gson.toJson(context.getResources().getConfiguration());
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
            return null;
        }
    }

    @JavascriptInterface
    public String sysGetInfo(){
        try {
            return gson.toJson(mSystemInfo);
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
            return null;
        }
    }

    /*resources*/
    public String sysGetResources(){
        try {
            return gson.toJson(mResources);
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
            return null;
        }
    }

    /*8Google Services methods*/
    @JavascriptInterface
    public void gsSignInSilently(){
        RootActivity mainActivity = (RootActivity) context;
        rootActivity.mGoogleServicesManager.signInSilently();
    }

    @JavascriptInterface
    public String gsIsSignedIn(){
        Gson gson = new Gson();
        Log.d(TAG, gson.toJson(rootActivity.mGoogleServicesManager.isSignedIn()));
        return gson.toJson(rootActivity.mGoogleServicesManager.isSignedIn());
    }

    @JavascriptInterface
    public void gsSignOut(){
        rootActivity.mGoogleServicesManager.signOut();
    }

    @JavascriptInterface
    public void gsSignIn(){
        rootActivity.mGoogleServicesManager.signIn();
    }

    @JavascriptInterface
    public void gsShowAchievements(){
        rootActivity.mGoogleServicesManager.showAchievements();
    }

    @JavascriptInterface
    public void gsShowLeaderboard(){
        rootActivity.mGoogleServicesManager.showLeaderboard();
    }

    @JavascriptInterface
    public String gsGetPlayer(){
        try {
            return gson.toJson(rootActivity.mGoogleServicesManager.mPlayer);
        } catch (Exception e){
            Log.d(TAG, e.getMessage());
            return null;
        }
    }

    /**Storage methods
     *
     * @param scopeID - scopes`s ID
     * @param key - key name
     * @param value - data to store
     */
    @JavascriptInterface
    public void storageSet(String scopeID, String key, String value){
        storage.set(scopeID, key, value);
    }

    @JavascriptInterface
    public String storageGet(String scopeID, String key){
        return storage.get(scopeID, key);
    }

    /**Ads*/
    @JavascriptInterface
    public void adShowInterstitial(){
        mAdsManager.showInterstitial();
    }

    @JavascriptInterface
    public void adShowBanner(){
        mAdsManager.showBanner();
    }

    @JavascriptInterface
    public void adHideBanner(){
        mAdsManager.hideBanner();
    }
    @JavascriptInterface
    public void adShowRewarded(){
        mAdsManager.showRewarded();
    }

    /**UI Tools*/
    @JavascriptInterface
    public void uiShowAlert(String message){
        rootActivity.mUITools.showAlert(message);
    }

    @JavascriptInterface
    public void uiShowToast(String message) {
        rootActivity.mUITools.showToast(message);
    }

    @JavascriptInterface
    public void uiSetOrientation(String type){
        rootActivity.mUITools.setOrientation(type);
    }

    @JavascriptInterface
    public void uiNotify(String title, String content){
        rootActivity.mUITools.notify(title, content);


    }

    @JavascriptInterface
    public void uiSetNavBarVisible(String isVisible){
        Log.d(TAG, isVisible);
        rootActivity.mUITools.setNavBarVisible(isVisible.equals("true"));
    }

}
