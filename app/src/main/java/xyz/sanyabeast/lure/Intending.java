package xyz.sanyabeast.lure;

import android.content.Intent;

import java.util.Hashtable;

/**
 * Created by Sanyabeast on 05.06.2018.
 */

public abstract class Intending {
    private String TAG = "Jive/Intending";
    protected Hashtable<String, Integer> REQUEST_CODES = new Hashtable<String, Integer>();
    public boolean checkRequestCode(Integer requestCode){
        return REQUEST_CODES.containsValue(requestCode);
    }

    protected void addRequestCode(String key, Integer value){
        REQUEST_CODES.put(key, value);
    }

    abstract public void processRequestCode(Integer requestCode, Integer resultCode, Intent intent);
}
