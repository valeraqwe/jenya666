<?php
$token = "";
$chat_id = "";

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
foreach ($cart_items as $item) {
    $price = floatval(str_replace('₴', '', $item['price']));
    $total_sum += $price * $item['quantity'];  // Учитываем количество
}

$message_parts = [];
$customer_info = "ПІБ: $customer_name\n";
$customer_info .= "Телефон: $customer_phone\n";
$customer_info .= "Город: $customer_city\n";
$customer_info .= "Область: $customer_region\n";
$customer_info .= "Способ доставки: " . ($delivery_method === 'new_post' ? 'Новая Почта' : 'Укрпочта') . "\n";
$customer_info .= "Номер отделения: $post_office\n";
$customer_info .= "Комментарий: $order_comment\n";

$cart_items_chunked = array_chunk($cart_items, 10); // Разбиваем корзину на части по 10 элементов

foreach ($cart_items_chunked as $index => $chunk) {
    $cart_text_chunk = "";
    foreach ($chunk as $item) {
        $cart_text_chunk .= "{$item['name']} (Цена: ₴{$item['price']}, Количество: {$item['quantity']})\n";
    }
    $message = ($index === 0 ? "Новый заказ:\n$customer_info" : "") . "Корзина: \n$cart_text_chunk";
    if ($index === count($cart_items_chunked) - 1) {
        $message .= "\nОбщая сумма: ₴$total_sum гривен\n";
    }
    $message_parts[] = $message;
}

$ch = curl_init();
foreach ($message_parts as $message) {
    curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "chat_id={$chat_id}&parse_mode=html&text={$message}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Отключить проверку сертификата
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); // Отключить проверку имени хоста

    $result = curl_exec($ch);
    if ($result === false) {
        $error = curl_error($ch);
        break;
    }
}
curl_close($ch);

header('Content-Type: application/json');
echo json_encode(['result' => $result !== false, 'error' => $error ?? null]);

