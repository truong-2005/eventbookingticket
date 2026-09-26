package com.eventbooking.eventbooking.util;

import java.security.SecureRandom;

public final class BookingCodeGenerator {

    private static final String PREFIX = "BK-";

    // Bỏ O, 0, I, 1 để tránh nhầm lẫn
    private static final String CHARACTERS =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private static final int CODE_LENGTH = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private BookingCodeGenerator() {
        throw new IllegalStateException("Utility class");
    }

    public static String generate() {
        StringBuilder code = new StringBuilder(PREFIX);

        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = RANDOM.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }

        return code.toString();
    }
}
