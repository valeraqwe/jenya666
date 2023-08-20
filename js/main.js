document.addEventListener("DOMContentLoaded", function() {
    // Пустой массив для хранения товаров в корзине
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // Найти все кнопки "Добавить в корзину" на странице
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    // Добавить обработчик события для каждой кнопки
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function(event) {
            // Получить ID товара из атрибута кнопки
            const productId = event.target.getAttribute("data-product-id");

            // Получить название и цену товара
            const productName = document.querySelector(`#product-${productId} h4`).innerText;
            const productPrice = document.querySelector(`#product-${productId} p`).innerText;

            // Создать объект товара
            const product = {
                id: productId,
                name: productName,
                price: productPrice
            };

            // Добавить товар в корзину
            cart.push(product);

            // Сохранить корзину в LocalStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Обновить счетчик корзины (если он есть)
            updateCartCounter();
        });
    });

    // Функция для обновления счетчика корзины
    function updateCartCounter() {
        const counterElement = document.querySelector("#cartCounter");
        if (counterElement) {
            counterElement.innerText = cart.length;
        }
    }

    // Обновить счетчик при загрузке страницы
    updateCartCounter();
});
