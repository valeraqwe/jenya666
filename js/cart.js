// Глобальная переменная для корзины
let cart;

document.addEventListener("DOMContentLoaded", function () {
    // Инициализация cart
    cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.querySelector("#cart-total");

    // Обновление счетчика товаров в корзине
    function updateCartCounter() {
        let totalItems = 0;
        cart.forEach(product => {
            totalItems += product.quantity;
        });
        const counterElement = document.querySelector("#cartCounter");
        if (counterElement) {
            counterElement.innerText = totalItems;
        }
    }

    // Обновление общей стоимости товаров в корзине
    function updateTotalPrice() {
        let totalPrice = 0;
        cart.forEach(product => {
            const productPrice = parseFloat(product.price.replace("₴", ""));
            if (!isNaN(productPrice)) {
                totalPrice += productPrice * product.quantity;
            }
        });
        cartTotal.innerText = "₴" + totalPrice.toFixed(2);
    }

    // Обновление списка товаров в корзине

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        const formElement = document.getElementById("orderForm");
        const totalPriceElement = document.querySelector(".total-price");

        if (cart.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.className = "empty-cart-message";
            emptyMessage.innerHTML = "Немає товарів у кошику";
            cartItemsContainer.appendChild(emptyMessage);

            if (formElement) formElement.style.display = "none";
            if (totalPriceElement) totalPriceElement.style.display = "none";
        } else {
            cart.forEach((product, index) => {
                const productRow = document.createElement("div");
                productRow.className = "cart-item";
                productRow.innerHTML = `
                <div class="cart-item-detail" data-label="Product"><img src="${product.image}" alt="${product.name}" width="50"></div>
                <div class="cart-item-detail" data-label="Name">${product.name}</div>
                <div class="cart-item-detail" data-label="Price">₴${product.price}</div>
                <div class="cart-item-detail" data-label="Quantity">
                    <div class="quantity-wrapper">
                        <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                        <span class="quantity-number">${product.quantity}</span>
                        <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-detail" data-label="Remove"><button class="remove-from-cart-btn" data-index="${index}">🗑️</button></div>`;
                cartItemsContainer.appendChild(productRow);
            });

            if (formElement) formElement.style.display = "flex";
            if (totalPriceElement) totalPriceElement.style.display = "flex";
        }

        updateCartCounter();
        updateTotalPrice();
    }

    updateCart();

    document.addEventListener("click", function (event) {
        const index = event.target.getAttribute("data-index");
        if (event.target.classList.contains("remove-from-cart-btn")) {
            cart.splice(index, 1);
        } else if (event.target.classList.contains("increase-quantity")) {
            cart[index].quantity++;
        } else if (event.target.classList.contains("decrease-quantity")) {
            cart[index].quantity = Math.max(1, cart[index].quantity - 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    });

    function showPopup() {
        const popupElement = document.getElementById("thankYouPopup");
        if (popupElement) {
            popupElement.style.display = "block";
            setTimeout(function () {
                closePopup();
            }, 2000);
        } else {
            console.error("Element with id 'thankYouPopup' not found");
        }
    }

    function closePopup() {
        const popupElement = document.getElementById("thankYouPopup");
        if (popupElement) {
            popupElement.style.display = "none";
        } else {
            console.error("Element with id 'thankYouPopup' not found");
        }
    }

    function clearCart() {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    document.getElementById("orderForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Собираем данные о товарах
        let cartInfo = JSON.stringify(cart); // Переводим объект в строку JSON
        document.getElementById("cartData").value = cartInfo;

        // Сохраняем в скрытое поле
        document.getElementById("cartData").value = cartInfo;

        // Создаем объект FormData
        const formData = new FormData(document.getElementById("orderForm"));

        // AJAX-запрос на сервер
        fetch('process_order.php', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
                if (data.result === true) {
                    clearCart();
                    showPopup();
                    document.getElementById("orderForm").reset();  // Очистка формы
                } else {
                    alert('Что-то пошло не так, пожалуйста, попробуйте ещё раз.');
                }
            })
            .catch((error) => console.error('Fetch error:', error));
    });
    // Этот код добавляется сразу после вашего текущего обработчика события отправки orderForm

});
