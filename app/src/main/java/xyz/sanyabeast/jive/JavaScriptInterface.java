package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;
import android.webkit.JavascriptInterface;

import com.google.gson.Gson;

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

    JavaScriptInterface(Context c){
        context = c;
        activity = (Activity) c;
        rootActivity = (RootActivity) c;
        storage = rootActivity.mStorage;
        mAdsManager = rootActivity.mAdsManager;
    }

    /**System methods*/
    @JavascriptInterface
    public void sysExit(){
        Activity activity = (Activity)context;
        activity.finishAffinity();
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
    public void uiNotify(String title, String content){
        rootActivity.mUITools.notify(title, content);
    }

}
