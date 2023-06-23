const express = require('express');
const app = express();
const port = 4000;
app.use(express.json());

var dateObject = new Date();
let date = dateObject.toUTCString();
var active = [];

// Data Models
let users = [
	{
		email: "admin@gmail.com",
		password: "admin12345",
		isAdmin: true
	},
	{
		email: "employee1@gmail.com",
		password: "employee1",
		isAdmin: false
	},
	{
		email: "employee2@gmail.com",
		password: "employee2",
		isAdmin: false
	}
];

let products = [
	{
		name: "French Fries",
		description: "Side Dish",
		price: 45,
		isActive: true,
		createdOn: date
	},
	{
		name: "BBQ",
		description: "Main Dish",
		price: 70,
		isActive: true,
		createdOn: date
	},
	{
		name: "Siopao",
		description: "Snack",
		price: 55,
		isActive: true,
		createdOn: date
	}
];

let order = [
	{
		userId: 1,
		products: [
			{
				name: "French Fries",
				description: "Side Dish",
				price: 45,
				isActive: true,
				createdOn: date
			},
			{
				name: "Siopao",
				description: "Snack",
				price: 55,
				isActive: true,
				createdOn: date
			}
		],

		totalAmount: 100,
		purchasedOn: date
	},
	{
		userId: 2,
		products: [
			{
				name: "French Fries",
				description: "Side Dish",
				price: 45,
				isActive: true,
				createdOn: date
			}
		],

		totalAmount: 45,
		purchasedOn: date
	},
	{
		userId: 3,
		products: [
			{
				name: "French Fries",
				description: "Side Dish",
				price: 45,
				isActive: true,
				createdOn: date
			},
			{
				name: "BBQ",
				description: "Main Dish",
				price: 70,
				isActive: true,
				createdOn: date
			}
		],

		totalAmount: 115,
		purchasedOn: date
	}
];

// Login
let loggedUser;

app.post('/users/login', (req, res)=> {
	console.log(req.body);

	let foundUser = users.find((user) => {
		return user.email === req.body.email && user.password === req.body.password;
	});

	if(foundUser !== undefined){
		let foundUserIndex = users.findIndex((user) => {
			return user.email === foundUser.email
		});

		foundUser.index = foundUserIndex;
		loggedUser = foundUser;
		console.log(loggedUser);

		res.send('Thank you for logging in')
	} else {
		loggedUser = foundUser;
		res.status(401).send('Login failed. Wrong credentials.')
	}
});

// Create API that create one product and many product (Admin only)
app.post('/products', (req, res) => {
    if(loggedUser.isAdmin === true) {
        if (!Array.isArray(req.body)) {
             let newProd = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            isActive: req.body.isActive,
            createdOn: req.body.createdOn
        }
        products.push(newProd)
        res.status(201).send(products)
    }    else if (Array.isArray(req.body)) {
              let newProducts = req.body.map((products) => {
              return {
            name: products.name,
            description: products.description,
            price: products.price,
            isActive: products.isActive,
            createdOn: products.createdOn
          }
    })
    products.push(...newProducts);
    console.log(products);

    res.status(201).send(products);
    } else {
        res.status(403).send("ERROR 403: FORBIDDEN (Not an admin)")
        }
    }    
});

// A GET request is sent to the /products endpoint, shows Active only
app.get('/products', (req, res) => {
	console.log(loggedUser);
	let activeProducts = products.filter((product) => product.isActive === true);

	if (loggedUser.isAdmin === true){
		res.send(activeProducts);
	} else {
		res.status(401).send('Unauthoried. Action Forbidden');
	}
});


// A GET request is sent to the /products/:productid endpoint
app.get('/products/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId);
	let productId = parseInt(req.params.productId);
	if (productId >= 0 && productId < products.length){
		let product = products[productId];
		res.send(product)
	} else {
		res.status(404).send('Invalid Product ID');
	}
});

// A GET request sent to the /users/orders endpoint
app.get('/users/orders', (req, res) => {
	
	if (loggedUser.isAdmin === true){
		res.send(order);
	} else {
		res.status(401).send('Unauthoried. Action Forbidden.');
	}
});

// Archive
app.put('/products/archive/:index', (req, res) => {
	console.log(req.params);
	console.log(req.params.index);
	let productIndex = parseInt(req.params.index);

	if (loggedUser.isAdmin === true){
		if (productIndex >= 0 && productIndex < products.length){

		products[productIndex].isActive = false;
		console.log(products[productIndex]);
		res.send('Product Archived');
	} else {
		res.status(404).send('Invalid product ID.');
		}
	} else {
		res.status(401).send('Unauthoried. Action Forbidden.');
	}
});

// Update
app.put('/products/:productId', (req, res) => {
	console.log(req.params);
	console.log(req.params.productId)
	let productId = parseInt(req.params.productId)
	let product = products[productId]
	if (productId < products.length){
		let newProd = {
			name: req.body.name,
			descriptin: req.body.description,
			price: req.body.price,
			isActive: req.body.isActive,
			createdOn: req.body.createdOn
		}
		products[productId] = newProd;
		res.status(203).send(products)
	} else {
		res.status(404).send("Product does not exist")
	}
});

// Delete
app.delete('/order/:index', (req, res) => {
	console.log(req.params);
	console.log(req.params.index)

	let index = parseInt(req.params.index);
	delete order[index];
	res.status(203).send(order);
})

app.listen(port, () => console.log(`Server is running at port ${port}`));