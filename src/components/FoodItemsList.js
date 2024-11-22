import { motion } from 'framer-motion';

function FoodItemsList({ items, setItems }) {
  const addItem = () => {
    setItems([...items, { name: '', price: '', quantity: 1 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' && value < 1) {
      newItems[index].quantity = 1;
    }
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
    }, 0);
  };

  return (
    <div className="food-items-list">
      <div className="food-items-header">
        <h3>Food Items List</h3>
        <motion.button
          type="button"
          className="add-item-btn"
          onClick={addItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Item
        </motion.button>
      </div>

      {items.map((item, index) => (
        <motion.div 
          key={index} 
          className="food-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="item-input">
            <label>Item Name</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="item-input">
            <label>Price</label>
            <input
              type="number"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', e.target.value)}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="item-input">
            <label>Quantity</label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="item-total">
            Total: ₵{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
          </div>

          <motion.button
            type="button"
            className="remove-item-btn"
            onClick={() => removeItem(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </motion.div>
      ))}

      {items.length > 0 && (
        <div className="food-items-total">
          <strong>Total Amount:</strong> ₵{calculateTotal().toFixed(2)}
        </div>
      )}
    </div>
  );
}

export default FoodItemsList; 