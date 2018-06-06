package xyz.sanyabeast.jive;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.gson.Gson;


/**
 * Created by User13 on 19.03.2018.
 */

public class WebViewManager {
    private String TAG = "Jive/WebToolChain";

    private WebView mWebView;
    private Context context;
    private WebSettings mWebSettings;
    private WebViewClient mWebViewClient = new WebViewClient();
    private JavaScriptInterface mJavaScriptInterface;
    private Gson gson = new Gson();

    public WebViewManager(Context c){
        context = c;
        mJavaScriptInterface = new JavaScriptInterface(c);

        Activity activity = (Activity) context;

        // TODO make toggling based on enviroment variable (dev/prod);
        if (Build.VERSION.SDK_INT >= 19) WebView.setWebContentsDebuggingEnabled(true);

        mWebView = (WebView) activity.findViewById(R.id.webview);
        mWebView.setBackgroundColor(Color.TRANSPARENT);
        mWebView.setWebViewClient(mWebViewClient);
        mWebView.addJavascriptInterface(mJavaScriptInterface, "_android");


        mWebSettings = mWebView.getSettings();
        mWebSettings.setJavaScriptEnabled(true);
        if (Build.VERSION.SDK_INT >= 16) mWebSettings.setAllowFileAccessFromFileURLs(true); //Maybe you don't need this rule
        if (Build.VERSION.SDK_INT >= 16) mWebSettings.setAllowUniversalAccessFromFileURLs(true);
        mWebSettings.setAllowContentAccess(true);
        mWebSettings.setDomStorageEnabled(true);
        if (Build.VERSION.SDK_INT >= 17) mWebSettings.setMediaPlaybackRequiresUserGesture(false);
        if (Build.VERSION.SDK_INT >= 23) mWebSettings.setOffscreenPreRaster(true);
        if (Build.VERSION.SDK_INT >= 16) mWebSettings.setAllowUniversalAccessFromFileURLs(true);
        mWebSettings.setMinimumFontSize(1);
        mWebSettings.setMinimumLogicalFontSize(1);
        mWebSettings.setLoadsImagesAutomatically(true);
        mWebSettings.setNeedInitialFocus(false);
        mWebSettings.setSupportZoom(false);
        mWebSettings.setDatabaseEnabled(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // chromium, enable hardware acceleration
            mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            // older android version, disable hardware acceleration
            mWebView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
    }

    public void open(String location){
        mWebView.loadUrl(location);
    }

    public void send(Envelope envelope){
        try {
            String json = gson.toJson(envelope);
            Log.d(TAG, "postal.say('$android', " + json + ")");
            this.open("javascript:postal.say('$android', " + json + ")");
        } catch (Exception e){
            log("failed to send data: " + e.getMessage());
            Log.d(TAG, "failed to send data: " + e.getMessage());
        }
    }

    public void set(String key, Object value){
        Log.d(TAG, "setting value");
        try {
            Object[] pair = {key, value};
            this.send(new Envelope("var-global", pair));
        } catch (Exception e){
            log("failed to set value: " + e.getMessage());
            Log.d(TAG, "failed to set value: " + e.getMessage());
        }
    }

    public void log(Object data){
        this.send(new Envelope("console.log", data));
    }
}
