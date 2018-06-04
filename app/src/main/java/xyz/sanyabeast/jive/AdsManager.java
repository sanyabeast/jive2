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
 * banner: ca-app-pub-2521065562985916/1241534956
 * reward: ca-app-pub-2521065562985916/8929572849
 */

/**Jive app identifier
 * ca-app-pub-2521065562985916~6087787085
 */

public class AdsManager {
    private Context context;
    private InterstitialAd mInterstitialAd;
    private String TAG = "AdsManager";
    private RootActivity rootActivity;
    private WebToolchain mWebToolchain;

    private String adMobAppID = "ca-app-pub-2521065562985916~6087787085";

    private String adUnitIDInterstitial = "ca-app-pub-3940256099942544/1033173712";
    private String adUnitIDBanner = "ca-app-pub-2521065562985916/1241534956";
    private String adUnitIDReward = "ca-app-pub-2521065562985916/8929572849";

    public AdsManager(Context c){
        context = c;
        rootActivity = (RootActivity) c;

        MobileAds.initialize(context, adMobAppID);

        mInterstitialAd = new InterstitialAd(context);
        mInterstitialAd.setAdUnitId(adUnitIDInterstitial);

        rootActivity.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                mInterstitialAd.setAdListener(new AdListener(){
                    @Override
                    public void  onAdLoaded(){
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.loading.completed"));
                        mInterstitialAd.show();
                    }

                    @Override
                    public void onAdFailedToLoad(int errorCode) {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.loading.failed", new Object(){}));
                        Log.d(TAG, "Interstitial ad failed to load, errocode: " + errorCode);
                    }

                    @Override
                    public void onAdOpened() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.opened"));
                        Log.d(TAG, "Interstital ad has opened");
                    }

                    @Override
                    public void onAdLeftApplication() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.used"));
                        Log.d(TAG, "Interstital ad has been used");
                    }

                    @Override
                    public void onAdClosed() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.closed"));
                        Log.d(TAG, "Interstital ad has been closed");
                    }
                });
            }
        });
    }

    public void showInterstitial(){
        rootActivity.runOnUIThread(new Runnable() {
            @Override
            public void run() {
                rootActivity.mWebToolchain.send(new Envelope("android.ads.interstitial.loading.started"));
                mInterstitialAd.loadAd(new AdRequest.Builder().build());
                if (mInterstitialAd.isLoaded()){
                    mInterstitialAd.show();
                } else {
                    Log.d(TAG, "The interstitial wasn't loaded yet.");
                }
            }
        });
    }

}
