let user = JSON.parse(sessionStorage.user || null);

// window.onload = () => {
//     if(user == null){
//         location.replace('/index')
//     }
// }

let editables = [...document.querySelectorAll('*[contenteditable="true"]')];

editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
    element.innerHTML = placeholder;
    element.addEventListener('focus',()=>{
        if(element.innerHTML === placeholder){
            element.innerHTML = '';
        }
    })
    element.addEventListener('focusout',()=>{
        if(element.innerHTML.length){
            element.innerHTML=placeholder;
        }
    })
})

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Inventory";

    // Function to fetch products
    function fetchProducts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.documents);
            })
            .catch(error => console.log("Error fetching products:", error));
    }

    // Function to display products
    function displayProducts(products) {
        const productList = document.getElementById("productList");
        productList.innerHTML = ""; // Clear previous product list
        products.forEach(product => {
            const productData = product.fields;
            const productId = product.name.split('/').pop();
            const productName = productData.name.stringValue;
            const productPrice = productData.price.stringValue;
            const productHtml = `
                <div class="product">
                    <h3>${productName}</h3>
                    <p>Price: ${productPrice}</p>
                    <button onclick="deleteProduct('${productId}')">Delete</button>
                    <button onclick="showUpdateForm('${productId}', '${productName}', '${productPrice}')">Update</button>
                </div>
            `;
            productList.innerHTML += productHtml;
        });
    }

    // Function to add product
    function addProduct(productName, productPrice) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    name: {
                        stringValue: productName
                    },
                    price: {
                        stringValue: productPrice
                    }
                }
            })
        })
        .then(() => {
            fetchProducts(); // Refresh product list after adding product
        })
        .catch(error => console.log("Error adding product:", error));
    }

    // Function to delete product
    function deleteProduct(productId) {
        fetch(`${apiUrl}/${productId}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchProducts(); // Refresh product list after deleting product
        })
        .catch(error => console.log("Error deleting product:", error));
    }

    // Function to show update form
    function showUpdateForm(productId, productName, productPrice) {
        const productNameInput = prompt("Enter new product name:", productName);
        const productPriceInput = prompt("Enter new product price:", productPrice);

        if (productNameInput !== null && productPriceInput !== null) {
            updateProduct(productId, productNameInput, productPriceInput);
        }
    }

    // Function to update product
    function updateProduct(productId, productName, productPrice) {
        fetch(`${apiUrl}/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    name: {
                        stringValue: productName
                    },
                    price: {
                        stringValue: productPrice
                    }
                }
            })
        })
        .then(() => {
            fetchProducts(); // Refresh product list after updating product
        })
        .catch(error => console.log("Error updating product:", error));
    }

    // Event listener for add product form submission
    document.getElementById("addProductForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        const productName = document.getElementById("productName").value;
        const productPrice = document.getElementById("productPrice").value;
        addProduct(productName, productPrice);
    });

    // Initial fetch of products when the page loads
    fetchProducts();
});
