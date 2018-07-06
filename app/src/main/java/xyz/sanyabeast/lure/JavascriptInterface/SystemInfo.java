package xyz.sanyabeast.lure.JavascriptInterface;

import android.content.Context;
import android.os.Build;

import com.facebook.device.yearclass.YearClass;

import java.time.Year;

/**
 * Created by Sanyabeast on 08.06.2018.
 */

public class SystemInfo {
    int sdkVersion = Build.VERSION.SDK_INT;
    String baseOSVersion = Build.VERSION.BASE_OS;
    int deviceClassYear;
    Boolean hardwareAccelerated = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;

    public SystemInfo(Context c){
        deviceClassYear = YearClass.get(c);
    }
}
