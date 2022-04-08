const {
	json
} = require('express');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

function writeJson(dataBase) {
	fs.writeFileSync(productsFilePath, JSON.stringify(dataBase), 'utf-8');
}

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		function finalPrice(price, discount) {
			if (discount > 0) {
				return toThousand(price - ((price * discount) / 100))
			} else {
				return toThousand(price)
			}
		}

		res.render('products', {
			products,
			finalPrice
		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		function finalPrice(price, discount) {
			if (discount > 0) {
				return toThousand(price - ((price * discount) / 100))
			} else {
				return toThousand(price)
			}
		}

		let idProduct = +req.params.id //lo pongo en number
		let producto = products.find(product => product.id === idProduct)

		res.render('detail', {
			producto,
			finalPrice
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		let lastId = 1
		products.map(product => {
			if (product.id > lastId) {
				lastId = product.id
			}
		})

		let {
			name,
			price,
			discount,
			category,
			description
		} = req.body
		let newProduct = {
			id: lastId + 1,
			name,
			price,
			discount,
			category,
			description,
			image: req.file ? req.file.filename : 'default-image.png'
		}

		products.push(newProduct);

		writeJson(products)

		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		let idProduct = +req.params.id //lo pongo en number
		let product = products.find(product => product.id === idProduct)

		res.render('product-edit-form', {
			product
		})
	},
	// Update - Method to update
	update: (req, res) => {
		let idProduct = +req.params.id //lo pongo en number
		let {
			name,
			price,
			discount,
			category,
			description
		} = req.body

		products.forEach(product => {
			if (product.id === idProduct) {
				product.name = name,
				product.price = +price,
				product.discount = +discount,
				product.category = category,
				product.description = description
				if(req.file) {
					if(fs.existsSync('./public/images/products/', product.image)) {
						fs.unlinkSync(`./public/images/products/${product.image}`)
					} else {
						console.log('No encontre el archivo')
					}
					product.image = req.file.filename
				} else {
					product.image = product.image
				} 
			}
		});


		writeJson(products)

		res.redirect(`/products/detail/${idProduct}`)
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		let idProduct = +req.params.id //lo pongo en number

		products.forEach(product => {
			if (product.id === idProduct) {
				if(fs.existsSync('./public/images/products/', product.image)) {
					fs.unlinkSync(`./public/images/products/${product.image}`)
				} else {
					console.log('No encontre el archivo')
				}

				let productToDestroy = products.indexOf(product)
				if (productToDestroy !== -1) {
					products.splice(productToDestroy, 1);
				} else {
					console.log('No encontre el producto')
				}
			}
		})

		//Esta forma es mas segura ya que busca la posicion a traves del id
		/* getSucursales.forEach(sucursal => {
            if(sucursal.id === idSucursal){
                let sucursalAEliminar = getSucursales.indexOf(sucursal)
                getSucursales.splice(sucursalAEliminar, 1)
            } else {

			}
        }) */

		writeJson(products);

		res.redirect('/products')
	}
};

module.exports = controller;