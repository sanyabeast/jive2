package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.google.gson.Gson;

/**
 * Created by User13 on 19.03.2018.
 */

public class WebAppInterface {
    private String TAG = "Jive:WebAppInterface";
    private Context context;
    private Activity activity;
    private RootActivity rootActivity;
    private Gson gson = new Gson();

    WebAppInterface(Context c){
        context = c;
        activity = (Activity) c;
        rootActivity = (RootActivity) c;
    }

    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(context, toast, Toast.LENGTH_SHORT).show();
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
}
