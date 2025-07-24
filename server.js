const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/nutrition', async (req, res) => {
  const { food } = req.query;

  try {
    const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
      params: {
        search_terms: food,
        search_simple: 1,
        action: 'process',
        json: 1,
      }
    });

    const product = response.data.products[0];
    if (!product || !product.nutriments) {
      return res.status(404).json({ message: "No nutrition data found." });
    }

    const nutriments = product.nutriments;

    res.json({
      name: product.product_name || food,
      nutrients: {
        calories: nutriments['energy-kcal_100g'],
        fat: nutriments['fat_100g'],
        carbohydrates: nutriments['carbohydrates_100g'],
        sugars: nutriments['sugars_100g'],
        protein: nutriments['proteins_100g'],
        fiber: nutriments['fiber_100g'],
        salt: nutriments['salt_100g'],
        sodium: nutriments['sodium_100g']
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
