<?php
$token = "7321335943:AAFH2vzjL6_sAfofa-p7-G5Frduhs3jBCfU";
$chat_id = "-1002236838798";


$customer_name = $_POST['customer_name'];
$customer_phone = $_POST['customer_phone'];
$message_content = $_POST['message_content'];

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
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Отключить проверку сертификата
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // Отключить проверку имени хоста

$result = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo json_encode(['result' => !($result === false)]);
