import { motion } from 'framer-motion';

function FoodItemsList({ items, setItems }) {
  const addItem = () => {
    setItems([...items, { name: '', price: '', quantity: '1' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="food-items-list">
      <div className="food-items-header">
        <h3>Food Items</h3>
        <button type="button" onClick={addItem} className="add-item-btn">
          Add Item
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="food-item">
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
              placeholder="0.00"
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
            Total: GH₵{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
          </div>

          <button
            type="button"
            className="remove-item-btn"
            onClick={() => removeItem(index)}
          >
            ×
          </button>
        </div>
      ))}

      <div className="food-items-total">
        Total Amount: GH₵{items.reduce((sum, item) => 
          sum + ((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)), 
          0
        ).toFixed(2)}
      </div>
    </div>
  );
}

export default FoodItemsList; 