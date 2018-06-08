package xyz.sanyabeast.omen.JavascriptInterface;

import android.content.Context;
import android.os.Build;

/**
 * Created by Sanyabeast on 08.06.2018.
 */

public class SystemInfo {
    int sdkVersion = Build.VERSION.SDK_INT;
    String baseOSVersion = Build.VERSION.BASE_OS;

    public SystemInfo(Context c){

    }
}
