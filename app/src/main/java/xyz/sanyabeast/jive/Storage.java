package xyz.sanyabeast.jive;

import android.content.Context;

import net.rehacktive.waspdb.WaspDb;
import net.rehacktive.waspdb.WaspFactory;
import net.rehacktive.waspdb.WaspHash;

/**
 * Created by Sanybeast on 04.06.2018.
 */

public class Storage {
    private String TAG = "Jive/Storage";

    WaspDb db;
    Context context;
    public Storage(Context c){
        context = c;
        db = WaspFactory.openOrCreateDatabase(context.getFilesDir().getPath(),"jive","lSVR9FYuZY5IzWr82vfZ");
    }

    public String get(String scopeID, String key){
        WaspHash scope = db.openOrCreateHash(scopeID);
        return scope.get(key);
    }

    public String get(String key){
        WaspHash scope = db.openOrCreateHash("jive");
        return scope.get(key);
    }

    public void set(String scopeID, String key, String value){
        WaspHash scope = db.openOrCreateHash(scopeID);
        scope.put(key, value);
    }

    public void set(String key, String value){
        WaspHash scope = db.openOrCreateHash("jive");
        scope.put(key, value);
    }
}
