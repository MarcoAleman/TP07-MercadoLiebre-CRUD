const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {

		let visitados = products.filter(product => product.category == "visited")
		let ofertas = products.filter(product => product.category == "in-sale")
		/* let ofertas = products.filter(product => product.discount > 0) */

		function finalPrice (price,discount) {
			if(discount >0) {
				return toThousand(price - ((price * discount) / 100))
			} else {
				return toThousand(price)
			}
		}
		
		res.render('index', {
			visitados,
			ofertas,
			finalPrice
		})
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
