package app.ongi.sharing.room;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class RoomCodeGenerator {

    private static final char[] ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ".toCharArray();
    private final SecureRandom random = new SecureRandom();

    public String generate() {
        char[] code = new char[8];
        for (int index = 0; index < code.length; index++) {
            code[index] = ALPHABET[random.nextInt(ALPHABET.length)];
        }
        return new String(code);
    }

    public static String normalize(String value) {
        return value == null ? "" : value.replace("-", "").replace(" ", "").toUpperCase();
    }

    public static String display(String value) {
        return value.substring(0, 4) + "-" + value.substring(4);
    }
}
