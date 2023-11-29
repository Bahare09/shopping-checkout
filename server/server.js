const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const port = 5000;

app.use(bodyParser.json());
app.use(cors());
function scanItems(items, pricingRules) {
  const itemCounts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  let totalPrice = 0;

  Object.keys(itemCounts).forEach((item) => {
    const count = itemCounts[item];
    const rule = pricingRules[item];

    if (rule && rule.specialPrice) {
      const specialOffers = Math.floor(count / rule.specialPriceQuantity);
      const remainingItems = count % rule.specialPriceQuantity;

      totalPrice +=
        specialOffers * rule.specialPrice + remainingItems * rule.unitPrice;
    } else {
      totalPrice += count * rule.unitPrice;
    }
  });

  return totalPrice;
}

app.post("/checkout", (req, res) => {
  const { items, pricingRules } = req.body;
  const total = scanItems(items, pricingRules);
  res.json({ total });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
