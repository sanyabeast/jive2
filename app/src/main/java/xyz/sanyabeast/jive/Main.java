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
//        webtoolchain.open("file:///android_asset/index.html");
         webtoolchain.open("http://games.cdn.famobi.com/html5games/s/smarty-bubbles/v110/?fg_domain=play.famobi.com&fg_aid=A1000-1&fg_uid=d8f24956-dc91-4902-9096-a46cb1353b6f&fg_pid=4638e320-4444-4514-81c4-d80a8c662371&fg_beat=842#_ga=2.249529728.606019034.1521567737-487884578.1521567737");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        webtoolchain.send(new Envelope("android", "button.pressed", event));
//        if (event.getAction() == KeyEvent.ACTION_DOWN) {
//            switch (keyCode) {
//
//                case KeyEvent.KEYCODE_BACK:
//                    webtoolchain.onBackButtonPressed();
//                    return true;
//            }
//
//        }

        return true;
    }
}
