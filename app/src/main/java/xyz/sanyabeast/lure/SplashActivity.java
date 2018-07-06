package xyz.sanyabeast.lure;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

/**
 * Created by sanyabeast on 23.04.2018.
 */

public class SplashActivity extends AppCompatActivity {
    private String TAG = "Jive/SplashActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        Intent intent = new Intent(this, RootActivity.class);
        startActivity(intent);
        finish();
    }

}
