package com.eventbooking.eventbooking;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class DbMigrate {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/event_booking_db";
        String user = "root";
        String pass = "";

        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Executing ALTER TABLE...");
            stmt.executeUpdate("ALTER TABLE roles MODIFY COLUMN name VARCHAR(50) NOT NULL;");
            System.out.println("Migration successful!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
