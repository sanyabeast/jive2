package xyz.sanyabeast.omen;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.TaskStackBuilder;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
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
}
