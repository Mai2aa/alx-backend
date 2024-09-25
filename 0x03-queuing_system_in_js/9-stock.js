import express from 'express';
import redis from 'redis';

const app = express();
const PORT = 1245;

const client = redis.createClient();

const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];


const getItemById = (id) => {
    return listProducts.find(product => product.id === id);
};

app.get('/list_products', (req, res) => {
    const productsResponse = listProducts.map(product => ({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
    }));
    res.json(productsResponse);
});

const reserveStockById = (itemId, stock) => {
    client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
    return new Promise((resolve, reject) => {
        client.get(`item.${itemId}`, (err, reply) => {
            if (err) return reject(err);
            resolve(reply ? parseInt(reply) : 0);
        });
    });
};

app.get('/list_products/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const product = getItemById(itemId);
    
    if (!product) {
        return res.status(404).json({ status: "Product not found" });
    }

    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({
        itemId: product.id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
        currentQuantity: product.stock - currentQuantity,
    });
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const itemId = parseInt(req.params.itemId, 10);
    const product = getItemById(itemId);
    
    if (!product) {
        return res.status(404).json({ status: "Product not found" });
    }

    const currentQuantity = await getCurrentReservedStockById(itemId);
    
    if (currentQuantity >= product.stock) {
        return res.json({ status: "Not enough stock available", itemId });
    }

    reserveStockById(itemId, currentQuantity + 1);
    res.json({ status: "Reservation confirmed", itemId });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
