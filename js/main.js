document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function(event) {
            const productId = event.target.getAttribute("data-product-id");
            const productName = document.querySelector(`#product-${productId} h4`).innerText;
            const productPrice = document.querySelector(`#product-${productId} p`).innerText;
            const productImageURL = document.querySelector(`#product-${productId} img`).src;

            const existingProduct = cart.find(product => product.id === productId);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImageURL,
                    quantity: 1  // добавляем поле для количества
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