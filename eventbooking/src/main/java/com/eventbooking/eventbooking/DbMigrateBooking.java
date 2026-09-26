package com.eventbooking.eventbooking;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbMigrateBooking {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/event_booking_db";
        String user = "root";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Executing ALTER TABLE bookings...");
            stmt.executeUpdate("ALTER TABLE bookings " +
                    "ADD COLUMN payment_method VARCHAR(20), " +
                    "ADD COLUMN payment_status VARCHAR(20) DEFAULT 'PENDING', " +
                    "ADD COLUMN transaction_id VARCHAR(100), " +
                    "ADD COLUMN payment_date DATETIME;");
            System.out.println("Migration successful!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
