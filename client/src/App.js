import React, { useState } from "react";

function App() {
  const [items, setItems] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [pricingRules, setPricingRules] = useState({
    A: { unitPrice: 60, specialPrice: 150, specialPriceQuantity: 3 },
    B: { unitPrice: 30, specialPrice: 45, specialPriceQuantity: 2 },
    C: { unitPrice: 30 },
    D: { unitPrice: 25 },
  });
  const [newRule, setNewRule] = useState({});

  const handleScan = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: items.split(""), pricingRules }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTotalPrice(data.total);
    } catch (error) {
      console.error("Error scanning items:", error);
      // You might want to provide feedback to the user about the error
    }
  };

  const handleAddRule = () => {
    // Add the new rule to the pricingRules state
    setPricingRules((prevRules) => ({
      ...prevRules,
      [newRule.item]: newRule,
    }));
    // Clear the newRule state for the next input
    setNewRule({});
  };

  return (
    <div>
      <label>
        Scan items (e.g., 'AABBC'):
        <input
          type="text"
          value={items}
          onChange={(e) => setItems(e.target.value.toUpperCase())}
        />
      </label>
      <button onClick={handleScan}>Scan</button>

      <div>
        <h2>Add New Pricing Rule:</h2>
        <label>
          Item:
          <input
            type="text"
            value={newRule.item || ""}
            onChange={(e) =>
              setNewRule({ ...newRule, item: e.target.value.toUpperCase() })
            }
          />
        </label>
        <label>
          Unit Price:
          <input
            type="number"
            value={newRule.unitPrice || ""}
            onChange={(e) =>
              setNewRule({ ...newRule, unitPrice: parseFloat(e.target.value) })
            }
          />
        </label>
        <label>
          Special Price:
          <input
            type="number"
            value={newRule.specialPrice || ""}
            onChange={(e) =>
              setNewRule({
                ...newRule,
                specialPrice: parseFloat(e.target.value),
              })
            }
          />
        </label>
        <label>
          Special Price Quantity:
          <input
            type="number"
            value={newRule.specialPriceQuantity || ""}
            onChange={(e) =>
              setNewRule({
                ...newRule,
                specialPriceQuantity: parseInt(e.target.value),
              })
            }
          />
        </label>
        <button onClick={handleAddRule}>Add Rule</button>
      </div>

      {totalPrice !== null && <p>Total Price: {totalPrice}</p>}
    </div>
  );
}

export default App;

