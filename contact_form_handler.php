<?php
$token = "6449904505:AAGb70C0Cx2h9q7dIAFZgFzrNyQSQq9hoZY";
$chat_id = "-808357395";

$customer_name = $_POST['customer_name'];
$customer_phone = $_POST['customer_phone'];
$message_content = $_POST['message_content']; // предположим, что у вас есть такое поле

if (empty($customer_name) || empty($customer_phone) || empty($message_content)) {
    header('Content-Type: application/json');
    echo json_encode(['result' => false, 'error' => 'All fields are required']);
    exit();
}

$message = "Новый быстрый заказ:\n";
$message .= "Имя: $customer_name\n";
$message .= "Телефон: $customer_phone\n";
$message .= "Сообщение: $message_content\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$chat_id}&parse_mode=html&text={$message}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo json_encode(['result' => !($result === false)]);
