        const searchButton = document.getElementById('searchButton');
        const searchProduct = document.getElementById('searchProduct');
        const resultsShow = document.getElementById('results');

        searchButton.addEventListener('click', () => {
            const name = searchProduct.value.trim();
            if (!name) {
                resultsShow.innerHTML = '<p>Please enter a product name.</p>';
                return;
            }

            fetch(`https://dummyjson.com/products/search?q= ${name}`)
                .then(response => response.json())
                .then(data => {
                    displayResults(data.products);
                })
        });

        function displayResults(products) {

            const productHtml = products.map(product => `
                <div class="product">
                    <h3>${product.title}</h3>
                    <p>Price: ${product.price}</p>
                    <p>${product.description}</p>
                     </div>
            `).join('');

            resultsShow.innerHTML = productHtml;
        }