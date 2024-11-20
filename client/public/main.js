const socket = io('http://localhost:3001', {
	transport: ['websocket'],
});

const productForm = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const productList = document.getElementById('product-list');

socket.emit('get_products');

socket.on('products_list', (products) => {
	renderProducts(products);
});

socket.on('product_created', (product) => {
	addProductToList(product);
});

socket.on('product_updated', (product) => {
	updateProductInList(product);
});

socket.on('product_deleted', (id) => {
	removeProductFromList(id);
});

productForm.onsubmit = (event) => {
	event.preventDefault();

	const productData = {
		name: nameInput.value,
		description: descriptionInput.value,
		price: Number(priceInput.value),
		stock: Number(stockInput.value),
	};

	socket.emit('create_product', productData);

	nameInput.value = '';
	descriptionInput.value = '';
	priceInput.value = '';
	stockInput.value = '';
};

const renderProducts = (products) => {
	productList.innerHTML = '';
	products.forEach((product) => {
		addProductToList(product);
	});
};

const editProduct = (id) => {
	const li = productList.querySelector(`[data-id="${id}"]`);
	if (li) {
		const name = prompt('Nhập tên mới');
		const description = prompt('Nhập mô tả mới');
		const price = prompt('Nhập giá tiền mới');
		const stock = prompt('Nhập số lượng mới');

		socket.emit('update_product', {
			id,
			data: { name, description, price, stock },
		});
	}
};

const addProductToList = (product) => {
	const li = document.createElement('li');
	li.setAttribute('data-id', product._id);
	li.innerHTML = `
	<strong>${product.name}</strong><br/>
	${product.description}<br/>
	Price: $${product.price} | Stock: ${product.stock}
	<div class="actions">
		<button onclick="editProduct('${product._id}')">Sửa</button>
		<button onclick="deleteProduct('${product._id}')">Xóa</button>
	</div>
	`;

	productList.appendChild(li);
};

const updateProductInList = (product) => {
	const li = productList.querySelector(`[data-id="${product._id}"]`);
	if (li) {
		li.innerHTML = `
		<strong>${product.name}</strong><br/>
		${product.description}<br/>
		Price: $${product.price} | Stock: ${product.stock}
		<div class="actions">
			<button onclick="editProduct('${product._id}')">Sửa</button>
			<button onclick="deleteProduct('${product._id}')">Xóa</button>
		</div>
		`;
	}
};

const removeProductFromList = (id) => {
	const li = productList.querySelector(`[data-id=${product._id}]`);
	if (li) {
		productList.removeChild(li);
	}
};

const deleteProduct = (id) => {
	if (confirm('Bạn muốn xóa sản phẩm này?')) {
		socket.emit('delete_product', id);
	}
};

window.editProduct = editProduct;
