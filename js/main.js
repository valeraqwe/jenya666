document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function(event) {
            const productId = event.target.getAttribute("data-product-id");
            const productName = document.querySelector(`#product-${productId} h4`).innerText;
            const productImageURL = document.querySelector(`#product-${productId} img`).src;
            const productSizeSelect = document.querySelector(`#product-${productId} select`);

            // Перевірка, чи користувач зробив вибір
            let selectedOption = productSizeSelect.value;

            // Якщо користувач не зробив вибору, використовуємо другу опцію зі списку
            if (!selectedOption) {
                selectedOption = productSizeSelect.options[1].value;
            }

            const [price, quantityStr] = selectedOption.split(" - ");
            const quantity = parseInt(quantityStr.split(" ")[0]);
            const finalPrice = parseFloat(price.replace("грн", "").trim());

            // Пошук вже існуючого продукту в кошику з такими ж параметрами
            const existingProduct = cart.find(product => product.id === productId && product.size === selectedOption);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                const product = {
                    id: productId,
                    name: productName,
                    price: finalPrice,
                    image: productImageURL,
                    size: selectedOption,
                    quantity: quantity
                };
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCounter();
        });
    });

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

    updateCartCounter();
});
