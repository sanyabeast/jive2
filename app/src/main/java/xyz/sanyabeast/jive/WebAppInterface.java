package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

/**
 * Created by User13 on 19.03.2018.
 */

public class WebAppInterface {
    Context context;

    WebAppInterface(Context c){
        context = c;
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
}
