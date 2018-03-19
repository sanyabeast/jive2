package xyz.sanyabeast.jive;

/**
 * Created by User13 on 19.03.2018.
 */

public class Envelope {
    String channel;
    String topic;
    Object data;

    Envelope(String c, String t, Object d){
        channel = c;
        topic = t;
        data = d;
    }
}
