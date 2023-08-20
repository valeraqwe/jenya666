// Глобальная переменная для корзины
let cart;

document.addEventListener("DOMContentLoaded", function () {
    // Инициализация cart
    cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const cartTable = document.querySelector(".cart-table");
    const cartTotal = document.querySelector("#cart-total");

    function updateCartCounter() {
        const counterElement = document.querySelector("#cartCounter");
        if (counterElement) {
            counterElement.innerText = cart.length;
        }
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        cart.forEach(product => {
            const productPrice = parseFloat(product.price.replace("$", ""));
            if (!isNaN(productPrice)) {
                totalPrice += productPrice;
            }
        });
        cartTotal.innerText = "$" + totalPrice.toFixed(2);
    }

    function updateCart() {
        cartTable.innerHTML = "";
        cart.forEach((product, index) => {
            const productRow = document.createElement("tr");
            productRow.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td><button class="remove-from-cart-btn" data-index="${index}">Удалить</button></td>
            `;
            cartTable.appendChild(productRow);
        });
        updateCartCounter();
        updateTotalPrice();
    }

    updateCart();

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("remove-from-cart-btn")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        }
    });

    function showPopup() {
        document.getElementById("thankYouPopup").style.display = "block";

        // Закрыть попап через 2 секунды (2000 миллисекунд)
        setTimeout(function() {
            closePopup();
        }, 2000);
    }
    document.getElementById("orderForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Предотвратить стандартное поведение формы

        // Здесь ваш код для отправки данных формы на сервер через AJAX
        // ...

        // После успешной отправки
        clearCart();
        showPopup();

        // Очистка формы
        document.getElementById("orderForm").reset();
    });

    function closePopup() {
        document.getElementById("thankYouPopup").style.display = "none";
    }

    document.getElementById("orderForm").addEventListener("submit", function(event) {
        event.preventDefault();
        document.getElementById("cartData").value = JSON.stringify(cart);
        clearCart();
        showPopup();
    });

    function clearCart() {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }
});
