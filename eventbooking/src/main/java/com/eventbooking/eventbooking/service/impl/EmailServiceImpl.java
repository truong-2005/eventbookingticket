package com.eventbooking.eventbooking.service.impl;

import com.eventbooking.eventbooking.exception.BookingException;
import com.eventbooking.eventbooking.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendResetPasswordEmail(String to, String link) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Đặt lại mật khẩu - Event Booking");
            helper.setText("""
                    <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Bấm vào liên kết dưới đây để đặt lại mật khẩu (hiệu lực 30 phút):</p>
                    <p><a href="%s">Đặt lại mật khẩu</a></p>
                    <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
                    """.formatted(link), true);
            mailSender.send(message);
            log.info("Đã gửi email reset tới {}", to);
        } catch (MessagingException e) {
            log.error("Gửi email thất bại tới {}: {}", to, e.getMessage());
            throw new BookingException("Gửi email thất bại, vui lòng thử lại");
        }
    }
}
