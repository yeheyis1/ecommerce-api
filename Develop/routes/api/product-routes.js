const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll({
      // Include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag }],
    });
    // Respond with the product data in JSON format
    res.status(200).json(productData);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  try {
    const productData = await Product.findByPk(req.params.id, {
      // Include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag }],
    });

    // If no product is found, respond with a 404 status
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    // If found, respond with the product data in JSON format
    res.status(200).json(productData);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this:
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, create pairings to bulk create in the ProductTag model
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // If no product tags, just respond with the created product
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      // Log any error and respond with a 400 status
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data by its `id`
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // If there are tag IDs associated with the product, update the tag associations
      if (req.body.tagIds && req.body.tagIds.length) {
        // Find all existing product tags for the product
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // Create a list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // Find which tags to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);

          // Run both destroy and bulkCreate actions to update tags
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      // Respond with the updated product
      return res.json(product);
    })
    .catch((err) => {
      // If there's an error, respond with a 400 status and the error
      console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  // Delete one product by its `id`
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    // If no product is found with the provided id, respond with a 404 status
    if (!productData) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }

    // If successful, respond with a success message
    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (err) {
    // If there's an error, respond with a 500 status and the error
    res.status(500).json(err);
  }
});

module.exports = router;
