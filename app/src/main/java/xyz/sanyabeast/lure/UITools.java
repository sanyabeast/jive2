package xyz.sanyabeast.lure;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.support.v4.app.NotificationCompat;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

/**
 * Created by Sanyabeast on 05.06.2018.
 */

public class UITools {
    private String TAG = "Jive/UITools";

    Activity activity;
    Context context;
    RootActivity rootActivity;

    public  UITools(Context c){
        context = c;
        activity = (Activity) c;
        rootActivity = (RootActivity) c;

    }

    public void hideNavigation(){
        activity.getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    public void setKeepingScreenAwake(Boolean keep){
        if (keep){
            rootActivity.runOnMainUIThread(new Runnable() {
                @Override
                public void run() {
                    activity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        } else {
            rootActivity.runOnMainUIThread(new Runnable() {
                @Override
                public void run() {
                    activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }
    }

    public void showAlert(String message){
        new AlertDialog.Builder(rootActivity)
            .setMessage(message)
            .setNeutralButton(android.R.string.ok, null)
            .show();
    }

    public void showToast(String message){
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

    public void notify(String title, String content){
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context, "jive");

        mBuilder.setSmallIcon(R.drawable.ic_launcher_foreground);
        mBuilder.setContentTitle(title);
        mBuilder.setContentText(content);

        Intent resultIntent = new Intent(context, RootActivity.class);

        TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
        stackBuilder.addParentStack(RootActivity.class);
        stackBuilder.addNextIntent(resultIntent);

        PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

        mBuilder.setContentIntent(resultPendingIntent);

        NotificationManager mNotificationManager = (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);

        mNotificationManager.notify(1, mBuilder.build());

    }

    public void setOrientation(String type){
        int orientation = type.equals("landscape") ? ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
        activity.setRequestedOrientation(orientation);
    }

    public void setNavBarVisible(Boolean isVisible){
        View  decorView = activity.getWindow().getDecorView();
        int flag = (isVisible) ? View.SYSTEM_UI_FLAG_HIDE_NAVIGATION : View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
        decorView.setSystemUiVisibility(flag);
    }
}
