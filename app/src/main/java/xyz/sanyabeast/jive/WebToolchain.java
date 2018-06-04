package xyz.sanyabeast.jive;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.google.gson.Gson;


/**
 * Created by User13 on 19.03.2018.
 */

public class WebToolchain {
    private WebView mWebView;
    private Context context;
    private WebSettings mWebSettings;
    private WebViewClient mWebViewClient = new WebViewClient();
    private WebAppInterface mWebAppInterface;
    private Gson gson = new Gson();

    public WebToolchain(Context c){
        context = c;
        mWebAppInterface = new WebAppInterface(c);

        Activity activity = (Activity) context;

        // TODO make toggling based on enviroment variable (dev/prod);
        WebView.setWebContentsDebuggingEnabled(true);

        mWebView = (WebView) activity.findViewById(R.id.webview);
        mWebView.setBackgroundColor(Color.TRANSPARENT);
        mWebView.setWebViewClient(mWebViewClient);
        mWebView.addJavascriptInterface(mWebAppInterface, "_android");


        mWebSettings = mWebView.getSettings();
        mWebSettings.setJavaScriptEnabled(true);
        mWebSettings.setAllowFileAccessFromFileURLs(true); //Maybe you don't need this rule
        mWebSettings.setAllowUniversalAccessFromFileURLs(true);
        mWebSettings.setAllowContentAccess(true);
        mWebSettings.setDomStorageEnabled(true);
        mWebSettings.setMediaPlaybackRequiresUserGesture(false);
        mWebSettings.setOffscreenPreRaster(true);
        mWebSettings.setAllowUniversalAccessFromFileURLs(true);
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

    public void onBackButtonPressed(){

    }

    public void send(Envelope envelope){
        String json = gson.toJson(envelope);
        this.open("javascript:postal.say('android.bridge', " + json + ")");
    }
}
