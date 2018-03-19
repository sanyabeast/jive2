package xyz.sanyabeast.jive;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

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
    }
}
