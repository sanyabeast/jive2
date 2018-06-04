package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.games.AchievementsClient;
import com.google.android.gms.games.EventsClient;
import com.google.android.gms.games.Games;
import com.google.android.gms.games.LeaderboardsClient;
import com.google.android.gms.games.Player;
import com.google.android.gms.games.PlayersClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

import java.util.concurrent.Executor;

/**
 * Created by sanyabeast on 30.05.2018.
 */

class GServicesMan {
    private Context context;
    private Activity activity;
    private RootActivity rootActivity;

    private String TAG = "Jive/GServicesMan";
    private GoogleSignInClient mGoogleSignInClient;
    private AchievementsClient mAchievementsClient;
    private LeaderboardsClient mLeaderboardsClient;
    private EventsClient mEventsClient;
    private PlayersClient mPlayersClient;

    // request codes we use when invoking an external activity
    private static final int RC_UNUSED = 5001;
    private static final int RC_SIGN_IN = 9001;


    GServicesMan(Context _context){
        context = _context;
        activity = (Activity) context;
        rootActivity = (RootActivity) context;

        mGoogleSignInClient = GoogleSignIn.getClient(
                context,
                new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_GAMES_SIGN_IN).build()
        );
    }

    private void onConnected(GoogleSignInAccount googleSignInAccount) {
        Log.d(TAG, "onConnected(): connected to Google APIs");

        mAchievementsClient = Games.getAchievementsClient(activity, googleSignInAccount);
        mLeaderboardsClient = Games.getLeaderboardsClient(activity, googleSignInAccount);
        mEventsClient = Games.getEventsClient(activity, googleSignInAccount);
        mPlayersClient = Games.getPlayersClient(activity, googleSignInAccount);

        // Set the greeting appropriately on main menu
        mPlayersClient.getCurrentPlayer().addOnCompleteListener(new OnCompleteListener<Player>() {
            @Override
            public void onComplete(@NonNull Task<Player> task) {
                String displayName;
                if (task.isSuccessful()) {
                    displayName = task.getResult().getDisplayName();
                    Log.d(TAG, "connection successed: " + displayName);
                } else {
                    Exception e = task.getException();
                    Log.d(TAG,  "connection failed: " + e.toString());
                }
            }
        });

        rootActivity.mWebToolchain.send(new Envelope("google.services.connected", null));

    }

    private void onDisconnected() {
        Log.d(TAG, "onDisconnected()");

        mAchievementsClient = null;
        mLeaderboardsClient = null;
        mPlayersClient = null;

        rootActivity.mWebToolchain.send(new Envelope("google.services.disconnected", null));
    }

    public void signInSilently() {
        Log.d(TAG, "signInSilently()");

        mGoogleSignInClient.silentSignIn().addOnCompleteListener(activity,
                new OnCompleteListener<GoogleSignInAccount>() {
                    @Override
                    public void onComplete(@NonNull Task<GoogleSignInAccount> task) {
                        if (task.isSuccessful()) {
                            Log.d(TAG, "signInSilently(): success");
                            rootActivity.mWebToolchain.send(new Envelope("google.services.sign-in.success", task.getResult()));
                            onConnected(task.getResult());
                        } else {
                            Log.d(TAG, "signInSilently(): failure", task.getException());
                            rootActivity.mWebToolchain.send(new Envelope("google.services.sign-in.failure", task.getResult()));
                            onDisconnected();
                        }
                    }
                });
    }

    public boolean isSignedIn() {
        return GoogleSignIn.getLastSignedInAccount(activity) != null;
    }

    public void signOut() {
        Log.d(TAG, "signOut()");

        if (!isSignedIn()) {
            Log.w(TAG, "signOut() called, but was not signed in!");
            return;
        }

        mGoogleSignInClient.signOut().addOnCompleteListener(activity,
                new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        boolean successful = task.isSuccessful();
                        String modifier = successful ? "success" : "failure";
                        Log.d(TAG, "signOut(): " + (successful ? "success" : "failed"));
                        rootActivity.mWebToolchain.send(new Envelope("google.services.signed-out." + modifier, null));
                        onDisconnected();
                    }
                });
    }

    public void signIn() {
        activity.startActivityForResult(mGoogleSignInClient.getSignInIntent(), RC_SIGN_IN);
    }

    /*Achievements and leaderboard*/
    public void showAchievements() {
        mAchievementsClient.getAchievementsIntent()
                .addOnSuccessListener(new OnSuccessListener<Intent>() {
                    @Override
                    public void onSuccess(Intent intent) {
                        activity.startActivityForResult(intent, RC_UNUSED);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        rootActivity.handleException(e, activity.getString(R.string.achievements_exception));
                    }
                });
    }

    public void showLeaderboard() {
        mLeaderboardsClient.getAllLeaderboardsIntent()
                .addOnSuccessListener(new OnSuccessListener<Intent>() {
                    @Override
                    public void onSuccess(Intent intent) {
                        activity.startActivityForResult(intent, RC_UNUSED);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        rootActivity.handleException(e, activity.getString(R.string.leaderboards_exception));
                    }
                });
    }
}
