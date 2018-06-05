package xyz.sanyabeast.jive;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.view.View;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.InterstitialAd;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.reward.RewardItem;
import com.google.android.gms.ads.reward.RewardedVideoAd;
import com.google.android.gms.ads.reward.RewardedVideoAdListener;

/**
 * Created by Sanyabeast on 04.06.2018.
 */

/**Test ad unit IDs
 * interstitial: ca-app-pub-3940256099942544/1033173712
 * banner: ca-app-pub-3940256099942544/6300978111
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
    private String TAG = "AdsManager";

    private Context context;
    private RootActivity rootActivity;
    private Activity activity;
    private WebToolchain mWebToolchain;

    private InterstitialAd mInterstitialAd;
    private AdView mAdView;
    private RewardedVideoAd mRewardedAd;

    private String adMobAppID = "ca-app-pub-2521065562985916~6087787085";

    private String adUnitIDInterstitial;
    private String adUnitIDBanner;
    private String adUnitIDRewarded;

    public AdsManager(Context c){
        context = c;
        rootActivity = (RootActivity) c;
        activity = (Activity) c;

        adUnitIDInterstitial = activity.getString(R.string.ad_interstital_id);
        adUnitIDBanner = activity.getString(R.string.ad_banner_id);
        adUnitIDRewarded = activity.getString(R.string.ad_rewarded_id);

        MobileAds.initialize(context, adMobAppID);

        /**Setting up Interstitial ad
         */
        mInterstitialAd = new InterstitialAd(context);
        mInterstitialAd.setAdUnitId(adUnitIDInterstitial);

        rootActivity.runOnMainUIThread(new Runnable() {
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

        /**Setting up Banner ad
         */
        mAdView = activity.findViewById(R.id.adbanner);

        rootActivity.runOnMainUIThread(new Runnable() {
            @Override
            public void run() {
                mAdView.setAdListener(new AdListener(){
                    @Override
                    public void  onAdLoaded(){
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.banner.loading.completed"));
                        Log.d(TAG, "Banner loading completed: ");
                    }

                    @Override
                    public void onAdFailedToLoad(int errorCode) {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.banner.loading.failed", new Object(){}));
                        Log.d(TAG, "Banner ad failed to load, errocode: " + errorCode);
                    }

                    @Override
                    public void onAdOpened() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.banner.opened"));
                        Log.d(TAG, "Banner ad has opened");
                    }

                    @Override
                    public void onAdLeftApplication() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.banner.used"));
                        Log.d(TAG, "Banner ad has been used");
                    }

                    @Override
                    public void onAdClosed() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.banner.closed"));
                        Log.d(TAG, "Banner ad has been closed");
                    }
                });
            }
        });

        /**Settings up Rewarded ad
         */
        mRewardedAd = MobileAds.getRewardedVideoAdInstance(context);
        rootActivity.runOnMainUIThread(new Runnable() {
            @Override
            public void run() {
                mRewardedAd.setRewardedVideoAdListener(new RewardedVideoAdListener() {
                    @Override
                    public void onRewardedVideoAdLoaded() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.loading.completed"));
                        Log.d(TAG, "Rewarded loading completed: ");
                        mRewardedAd.show();
                    }

                    @Override
                    public void onRewardedVideoAdOpened() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.opened"));
                        Log.d(TAG, "Rewarded opened: ");
                    }

                    @Override
                    public void onRewardedVideoStarted() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.video.started"));
                        Log.d(TAG, "Rewarded video started: ");
                    }

                    @Override
                    public void onRewardedVideoAdClosed() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.closed"));
                        Log.d(TAG, "Rewarded closed: ");
                    }

                    @Override
                    public void onRewarded(RewardItem rewardItem) {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.rewarded"));
                        Log.d(TAG, "Rewarded rewarded: ");
                    }

                    @Override
                    public void onRewardedVideoAdLeftApplication() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.used"));
                        Log.d(TAG, "Rewarded used: ");
                    }

                    @Override
                    public void onRewardedVideoAdFailedToLoad(int i) {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.loading.failed"));
                        Log.d(TAG, "Rewarded loading failed: ");
                    }

                    @Override
                    public void onRewardedVideoCompleted() {
                        rootActivity.mWebToolchain.send(new Envelope("android.ads.rewarded.video.completed"));
                        Log.d(TAG, "Rewarded video completed: ");
                    }
                });
            }
        });
    }

    public void showInterstitial(){
        rootActivity.runOnMainUIThread(new Runnable() {
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

    public void showBanner(){
        rootActivity.runOnMainUIThread(new Runnable() {
            @Override
            public void run() {
                mAdView.setVisibility(View.VISIBLE);
                mAdView.loadAd(new AdRequest.Builder().build());
            }
        });
    }

    public void hideBanner(){
        rootActivity.runOnMainUIThread(new Runnable() {
            @Override
            public void run() {
                mAdView.setVisibility(View.GONE);
            }
        });
    }

    public void showRewarded(){
        rootActivity.runOnMainUIThread(new Runnable() {
            @Override
            public void run() {
                mRewardedAd.loadAd(adUnitIDRewarded, new AdRequest.Builder().build());
            }
        });
    }

}
