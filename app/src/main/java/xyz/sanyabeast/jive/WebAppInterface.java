package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.google.gson.Gson;

/**
 * Created by Sanyabeast on 19.03.2018.
 */

public class WebAppInterface {
    private String TAG = "Jive:WebAppInterface";
    private Context context;
    private Activity activity;
    private RootActivity rootActivity;
    private Gson gson = new Gson();
    private Storage storage;
    private AdsManager mAdsManager;

    WebAppInterface(Context c){
        context = c;
        activity = (Activity) c;
        rootActivity = (RootActivity) c;
        storage = rootActivity.mStorage;
        mAdsManager = rootActivity.mAdsManager;
    }

    @JavascriptInterface
    public void exit(){
        Activity activity = (Activity)context;
        activity.finishAffinity();
        System.exit(0);
    }

    @JavascriptInterface
    public String getSystemConfig(){
        Configuration config = context.getResources().getConfiguration();
        String configJSON = gson.toJson(config);
        return configJSON;
    }

    @JavascriptInterface
    public void gsSignInSilently(){
        RootActivity mainActivity = (RootActivity) context;
        rootActivity.mGServicesMan.signInSilently();
    }

    @JavascriptInterface
    public String gsIsSignedIn(){
        Gson gson = new Gson();
        Log.d(TAG, gson.toJson(rootActivity.mGServicesMan.isSignedIn()));
        return gson.toJson(rootActivity.mGServicesMan.isSignedIn());
    }

    @JavascriptInterface
    public void gsSignOut(){
        rootActivity.mGServicesMan.signOut();
    }

    @JavascriptInterface
    public void gsSignIn(){
        rootActivity.mGServicesMan.signIn();
    }

    @JavascriptInterface
    public void gsShowAchievements(){
        rootActivity.mGServicesMan.showAchievements();
    }

    @JavascriptInterface
    public void gsShowLeaderboard(){
        rootActivity.mGServicesMan.showLeaderboard();
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
