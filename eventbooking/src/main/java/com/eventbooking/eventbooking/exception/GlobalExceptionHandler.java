package com.eventbooking.eventbooking.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice(basePackages = "com.eventbooking.eventbooking")
public class GlobalExceptionHandler {

    // ===== 404 - Không tìm thấy =====
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(404, ex.getMessage()));
    }

    // ===== 401 - Sai tài khoản/mật khẩu =====
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "Tên đăng nhập hoặc mật khẩu không đúng"));
    }

    // ===== 401 - Tài khoản bị khóa =====
    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse> handleDisabled(DisabledException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, "Tài khoản đã bị khóa, vui lòng liên hệ quản trị viên"));
    }

    // ===== 401 - Chưa đăng nhập / token hỏng =====
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, ex.getMessage()));
    }

    // ===== 401 - Token sai / hết hạn / đã dùng (access, refresh, reset) =====
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(401, ex.getMessage()));
    }

    // ===== 403 - Không đủ quyền =====
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse.of(403, "Bạn không có quyền thực hiện thao tác này"));
    }

    // ===== 400/409 - Lỗi nghiệp vụ đặt vé =====
    @ExceptionHandler(BookingException.class)
    public ResponseEntity<ErrorResponse> handleBooking(BookingException ex) {
        return ResponseEntity.status(ex.getStatus())
                .body(ErrorResponse.of(ex.getStatus(), ex.getMessage()));
    }

    // ===== 400 - Validate @Valid thất bại (message tiếng Việt từ DTO) =====
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .distinct()
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(400, message));
    }

    // ===== 400 - Tham số sai kiểu (ví dụ id = "abc") =====
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.badRequest()
                .body(ErrorResponse.of(400, "Tham số '" + ex.getName() + "' không hợp lệ"));
    }

    // ===== 409 - Vi phạm ràng buộc DB (trùng username, email...) =====
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ErrorResponse.of(409, "Dữ liệu đã tồn tại hoặc vi phạm ràng buộc (email/tên đăng nhập có thể bị trùng)"));
    }

    // ===== 500 - Lỗi không lường trước =====
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Lỗi hệ thống: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(500, "Lỗi hệ thống, vui lòng thử lại sau"));
    }
}
