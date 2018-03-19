package xyz.sanyabeast.jive;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;

/**
 * Created by User13 on 19.03.2018.
 */

public class Main extends AppCompatActivity {
     WebToolchain webtoolchain;

     @Override
     public void onCreate(Bundle savedInstanceState ) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webtoolchain = new WebToolchain(this);
        webtoolchain.open("file:///android_asset/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        webtoolchain.send(new Envelope("android", "exit", new Object()));
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            switch (keyCode) {

                case KeyEvent.KEYCODE_BACK:
                    webtoolchain.onBackButtonPressed();
                    return true;
            }

        }

        return super.onKeyDown(keyCode, event);
    }
}
