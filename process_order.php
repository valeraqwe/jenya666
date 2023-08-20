<?php
$token = "6308892385:AAEfSUnU2RBscWmrRTx_OOEMTfmmA8mqYfA";
$chat_id = "-946666122";

$customer_name = $_POST['customer_name'];
$customer_address = $_POST['customer_address'];
$customer_phone = $_POST['customer_phone'];
$cart_data = $_POST['cart_data'];
$totalSum = $_POST['total_sum'];
$totalItems = $_POST['total_items'];

$message = "Новый заказ:\n";
$message .= "Имя: $customer_name\n";
$message .= "Адрес: $customer_address\n";
$message .= "Телефон: $customer_phone\n";
$message .= "Общая сумма: $totalSum\n";
$message .= "Общее количество: $totalItems\n";
$message .= "Товары:\n$cart_data";


// Инициализация cURL сессии
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$chat_id}&parse_mode=html&text={$message}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

// Закрыть cURL сессию
curl_close($ch);

// Вернуть JSON-ответ
header('Content-Type: application/json');
echo json_encode(['result' => !($result === false)]);

