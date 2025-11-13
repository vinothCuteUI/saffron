<?php
header("Content-Type: application/json");

// Read POST data
$name = $_POST['name'] ?? '';
$phone = $_POST['mobile'] ?? '';
$email = $_POST['email'] ?? '';
$subjectType = $_POST['subject'] ?? '';
$message = $_POST['message'] ?? '';

if (!$name || !$phone || !$email || !$subjectType || !$message) {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

// Email settings
$to = "kvinothkanna28@gmail.com";  
$subject = "New Contact Message from $name";
$body = "Name: $name\nEmail: $email\n Mobile: $phone\nMessage:\n$message \n Subject: $subjectType\n";
$headers = "From: $email\r\n" .
           "Reply-To: $email\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
if (mail($to, $subject, $body, $headers)) {
    echo json_encode(["success" => true, "message" => "Email sent successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to send email."]);
}
?>
