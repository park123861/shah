<?php
// Replace this with your own email address
$to = 'parkseroyi42@gmail.com';

function url(): string {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    return $scheme . '://' . $host;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message_body = isset($_POST['message']) ? trim($_POST['message']) : '';

// Basic validation
if ($name === '' || $email === '' || $message_body === '') {
    http_response_code(400);
    echo 'Please fill all required fields.';
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email address.';
    exit;
}

// Prevent header injection
$name = preg_replace("/[\r\n]+/", ' ', $name);
$subject = preg_replace("/[\r\n]+/", ' ', $subject);
if ($subject === '') { $subject = 'Contact Form Submission'; }

// Build HTML message
$message = '';
$message .= "<p><strong>From:</strong> " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</p>";
$message .= "<p><strong>Email:</strong> " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</p>";
$message .= "<p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message_body, ENT_QUOTES, 'UTF-8')) . "</p>";
$message .= "<hr><p>This email was sent from your site " . htmlspecialchars(url(), ENT_QUOTES, 'UTF-8') . " contact form.</p>";

// Use a domain-based From and set Reply-To to user to avoid SPF/DMARC issues
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$fromAddress = 'no-reply@' . preg_replace('/^www\./', '', $host);

$headers = [];
$headers[] = "From: WEWBSITE <$fromAddress>";
$headers[] = "Reply-To: " . $email;
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=UTF-8";
$headers_str = implode("\r\n", $headers);

// Optional: set sendmail_from on Windows
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    ini_set('sendmail_from', $fromAddress);
}

$ok = mail($to, $subject, $message, $headers_str);

if ($ok) {
    echo "OK";
} else {
    http_response_code(500);
    // For local debugging you can log error_get_last() to a file
    // error_log(print_r(error_get_last(), true));
    echo "Something went wrong. Please try again.";
}
?>