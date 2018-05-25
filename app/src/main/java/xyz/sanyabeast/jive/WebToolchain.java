package xyz.sanyabeast.jive;
import android.app.Activity;
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
    WebView webview;
    Activity mainActivity;
    WebSettings settings;
    WebViewClient client = new WebViewClient();
    WebAppInterface webinterface;

    public WebToolchain(Activity activity){
        mainActivity = activity;
        webinterface = new WebAppInterface(activity);

        webview = (WebView) mainActivity.findViewById(R.id.webview);
        webview.setBackgroundColor(Color.TRANSPARENT);
        webview.setWebViewClient(client);
        webview.addJavascriptInterface(webinterface, "_android");


        settings = webview.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setAllowFileAccessFromFileURLs(true); //Maybe you don't need this rule
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setOffscreenPreRaster(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // chromium, enable hardware acceleration
            webview.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        } else {
            // older android version, disable hardware acceleration
            webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
    }

    public void open(String location){
        webview.loadUrl(location);
    }

    public void onBackButtonPressed(){

    }

    public void send(Envelope envelope){
        Gson gson = new Gson();
        String json = gson.toJson(envelope);
        webview.loadUrl("javascript:postal.say('android::bridge', " + json + ")");
    }
}
