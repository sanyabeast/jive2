package xyz.sanyabeast.jive;
import android.app.Activity;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;


/**
 * Created by User13 on 19.03.2018.
 */

public class WebToolchain {
    WebView webview;
    Activity mainActivity;
    WebSettings settings;
    WebViewClient client = new WebViewClient();

    public WebToolchain(Activity activity){
        mainActivity = activity;

        webview = (WebView) mainActivity.findViewById(R.id.webview);
        webview.setWebViewClient(client);

        settings = webview.getSettings();
        settings.setJavaScriptEnabled(true);

        webview.loadUrl("https://google.com");
    }
}
