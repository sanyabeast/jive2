package xyz.sanyabeast.jive;

import android.content.Context;
import android.util.Log;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.MobileAds;

/**
 * Created by Sanyabeast on 04.06.2018.
 */

/**Test ad unit IDs
 * interstitial: ca-app-pub-3940256099942544/1033173712
 */

/**Jive ad unit IDs
 * interstitial: ca-app-pub-2521065562985916/7513808579
 */

public class AdsManager {
    private Context context;
    private InterstitialAd mInterstitialAd;
    private String TAG = "AdsManager";

    public AdsManager(Context c){
        context = c;
        MobileAds.initialize(context, "ca-app-pub-2521065562985916~6087787085");

        mInterstitialAd = new InterstitialAd(context);
        mInterstitialAd.setAdUnitId("ca-app-pub-3940256099942544/1033173712");
        mInterstitialAd.setAdListener(new AdListener(){
            @Override
            public void  onAdLoaded(){
                mInterstitialAd.show();
            }

            @Override
            public void onAdFailedToLoad(int errorCode) {
                Log.d(TAG, "Interstitial ad failed to load, errocode: " + errorCode);
            }

            @Override
            public void onAdOpened() {
                Log.d(TAG, "Interstital ad has opened");
            }

            @Override
            public void onAdLeftApplication() {
                Log.d(TAG, "Interstital ad has been used");
            }

            @Override
            public void onAdClosed() {
                Log.d(TAG, "Interstital ad has been closed");
            }
        });
    }

    public void showInterstitial(){
        mInterstitialAd.loadAd(new AdRequest.Builder().build());
        if (mInterstitialAd.isLoaded()){
            mInterstitialAd.show();
        } else {
            Log.d(TAG, "The interstitial wasn't loaded yet.");
        }
    }

}
