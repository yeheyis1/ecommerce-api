const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags
router.get('/', async (req, res) => {
  // Find all tags
  try {
    const tagData = await Tag.findAll({
      // Be sure to include its associated Product data through the ProductTag model
      include: [{ model: Product, through: ProductTag }],
    });
    // Respond with the tag data in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error message
    res.status(500).json(err);
  }
});

// GET a single tag by `id`
router.get('/:id', async (req, res) => {
  // Find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      // Include its associated Product data through the ProductTag model
      include: [{ model: Product, through: ProductTag }],
    });

    // If no tag is found, respond with a 404 status and a message
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Respond with the tag data in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    // If there's an error, respond with a 500 status and the error message
    res.status(500).json(err);
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  // Create a new tag
  try {
    const tagData = await Tag.create(req.body);
    // Respond with the newly created tag in JSON format
    res.status(200).json(tagData);
  } catch (err) {
    // If there's an error, respond with a 400 status and the error message
    res.status(400).json(err);
  }
});

// PUT (update) a tag by its `id`
router.put('/:id', async (req, res) => {
  // Update a tag's name by its `id`
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // If no tag is found, respond with a 404 status and a message
    if (!tagData[0]) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Respond with a success message
    res.status(200).json({ message: 'Tag updated successfully!' });
  } catch (err) {
    // If there's an error, respond with a 500 status and the error message
    res.status(500).json(err);
  }
});

// DELETE a tag by its `id`
router.delete('/:id', async (req, res) => {
  // Delete a tag by its `id`
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // If no tag is found, respond with a 404 status and a message
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Respond with a success message
    res.status(200).json({ message: 'Tag deleted successfully!' });
  } catch (err) {
    // If there's an error, respond with a 500 status and the error message
    res.status(500).json(err);
  }
});

module.exports = router;
