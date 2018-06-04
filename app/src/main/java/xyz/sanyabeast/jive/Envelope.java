package xyz.sanyabeast.jive;

/**
 * Created by sanyabeast on 19.03.2018.
 */

public class Envelope {
    String theme;
    Object data;

    Envelope(String t, Object d){
        theme = t;
        data = d;
    }

    Envelope(String t){
        theme = t;
        data = new Object();
    }
}
