package com.eventbooking.eventbooking.util;

import java.security.SecureRandom;
import java.util.Base64;

public final class ResetTokenGenerator {

    private static final int TOKEN_BYTES = 32;
    private static final SecureRandom RANDOM = new SecureRandom();

    private ResetTokenGenerator() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Tạo reset token dài khoảng 43 ký tự.
     * Token an toàn khi truyền qua URL.
     */
    public static String generate() {
        byte[] bytes = new byte[TOKEN_BYTES];
        RANDOM.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}
