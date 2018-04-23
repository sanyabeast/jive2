package xyz.sanyabeast.jive;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.View;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.AccountPicker;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.OptionalPendingResult;
import com.google.android.gms.common.api.Result;
import com.google.android.gms.common.api.ResultCallback;

import static android.support.v4.app.ActivityCompat.startActivityForResult;

/**
 * Created by SlimShady on 3/21/2018.
 */



public class GoogleServicesManager implements
        GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener
{
    private String TAG = "GoogleServicesManager";

    private static final int SIGNED_IN = 0;
    private static final int STATE_SIGNING_IN = 1;
    private static final int STATE_IN_PROGRESS = 2;
    private static final int RC_SIGN_IN = 3;

    private Activity context;
    private GoogleApiClient mGoogleApiClient;
    private int mSignInProgress;
    private PendingIntent mSignInIntent;
    private GoogleSignInAccount account;

    GoogleServicesManager(Activity c){
        context = c;

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        GoogleApiClient.Builder builder = new GoogleApiClient.Builder(context);

        builder.addConnectionCallbacks(this);
        builder.addOnConnectionFailedListener(this);
        builder.enableAutoManage((FragmentActivity) context, this);
        builder.addApi(Auth.GOOGLE_SIGN_IN_API, gso);

        mGoogleApiClient = builder.build();

    }

    public void signIn(){
        Intent intent = AccountPicker.newChooseAccountIntent(null, null, new String[]{"com.google"},
                false, null, null, null, null);

        context.startActivityForResult(intent, 123);
    }


    public void disconnectGoogleApiClient(){
        mGoogleApiClient.disconnect();
    }

    public void connectGoogleApiClient(){
        mGoogleApiClient.connect();
    }

    public boolean isSignedIn() {
        return GoogleSignIn.getLastSignedInAccount(context) != null;
    }

    public void onConnected(Bundle connectionHint){
        mSignInProgress = this.SIGNED_IN;

        OptionalPendingResult opr = Auth.GoogleSignInApi.silentSignIn(mGoogleApiClient);

        opr.setResultCallback(new ResultCallback<GoogleSignInResult>() {
            @Override
            public void onResult(@NonNull GoogleSignInResult result) {
                if (result.isSuccess()){
                    try {
                        account = result.getSignInAccount();
                        Log.d(TAG, account.toString());
                    } catch (Exception error){
                        String exception = error.getLocalizedMessage();
                        String exceptionString = error.toString();
                        Log.d(TAG, exception);
                        Log.d(TAG, exceptionString);
                    }
                }
            }
        });
    }

    public void onConnectionSuspended(int cause){
        mGoogleApiClient.connect();
        Log.d(TAG, "susupened");
    }

    public void onConnectionFailed(ConnectionResult result){
        Log.d(TAG, result.toString());

        if (mSignInProgress != this.STATE_IN_PROGRESS){
            mSignInIntent = result.getResolution();
            if (mSignInProgress == STATE_SIGNING_IN){
                this.resolveSignInError(result);
            }
        }

    }

    public void resolveSignInError(ConnectionResult result){
    }

}
