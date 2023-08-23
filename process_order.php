<?php
$token = "6449904505:AAGb70C0Cx2h9q7dIAFZgFzrNyQSQq9hoZY";
$chat_id = "-808357395";

$customer_name = $_POST['customer_name'];
$customer_phone = $_POST['customer_phone'];
$cart_data = $_POST['cart_data'];
$customer_city = $_POST['customer_city'];
$customer_region = $_POST['customer_region'];
$delivery_method = $_POST['delivery_method'];
$post_office = $_POST['post_office'];
$order_comment = $_POST['order_comment'];

if (empty($customer_name) || empty($customer_phone) || empty($cart_data)) {
    header('Content-Type: application/json');
    echo json_encode(['result' => false, 'error' => 'All fields are required']);
    exit();
}

$cart_items = json_decode($cart_data, true);

$total_sum = 0;
$cart_text = "";
foreach ($cart_items as $item) {
    $price = floatval(str_replace('₴', '', $item['price']));
    $total_sum += $price * $item['quantity'];  // Учитываем количество
    $cart_text .= "{$item['name']} (Цена: ₴{$item['price']}, Количество: {$item['quantity']})\n";
}

$message = "Новый заказ:\n";
$message .= "Имя: $customer_name\n";
$message .= "Телефон: $customer_phone\n";
$message .= "Город: $customer_city\n";
$message .= "Область: $customer_region\n";
$message .= "Способ доставки: " . ($delivery_method === 'new_post' ? 'Новая Почта' : 'Укрпочта') . "\n";
$message .= "Номер отделения: $post_office\n";
$message .= "Комментарий: $order_comment\n";
$message .= "Корзина: \n$cart_text";
$message .= "Общая сумма: ₴$total_sum гривен\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$chat_id}&parse_mode=html&text={$message}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);
curl_close($ch);

header('Content-Type: application/json');
echo json_encode(['result' => !($result === false)]);

