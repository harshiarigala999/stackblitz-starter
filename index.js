const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(cors());

let stocks = [
  { id: 1, name: "Stock A", price: 100 },
  { id: 2, name: "Stock B", price: 50 },
  { id: 3, name: "Stock C", price: 150 },
  // Add more stocks as needed
];

// Endpoint to display all stocks
app.get('/stocks', (req, res) => {
  res.json({ stocks });
});

// Endpoint to sort stocks by pricing (low-to-high or high-to-low)
app.get('/stocks/sort/pricing', (req, res) => {
  // Get the 'pricing' query parameter
  const pricing = req.query.pricing;

  // Copy the stocks array to avoid mutating the original data
  let sortedStocks = [...stocks];

  // Sort stocks based on the pricing condition
  if (pricing === 'high-to-low') {
      sortedStocks.sort((a, b) => b.price - a.price);
  } else if (pricing === 'low-to-high') {
      sortedStocks.sort((a, b) => a.price - b.price);
  }

  // Return the sorted stocks as a JSON response
  res.json({ stocks: sortedStocks });
});

app.get('/stocks/sort/growth', (req, res) => {
  const { order } = req.query;

  if (!order || (order !== 'high-to-low' && order !== 'low-to-high')) {
    return res.status(400).json({
      error: 'Invalid sorting order. Use "high-to-low" or "low-to-high".'
    });
  }
  
  const sortedStocks = [...stocks].sort((a, b) =>
    order === 'high-to-low' ? b.growth - a.growth : a.growth - b.growth
  );

  res.json({ stocks: sortedStocks });
});

app.get('/stocks/filter/exchange', (req, res) => {
  const exchange = req.query.exchange?.toLowerCase();
  if (!exchange) {
    return res.status(400).json({ error: 'Please provide an exchange (NSE or BSE).' });
  }

  const filteredStocks = stocks.filter(stock => stock.exchange.toLowerCase() === exchange);

  if (filteredStocks.length === 0) {
    return res.status(404).json({ message: 'No stocks found for the specified exchange.' });
  }
  
  res.json({ stocks: filteredStocks });
});

app.get('/stocks/filter/industry', (req, res) => {
  const industry = req.query.industry?.toLowerCase();
  if (!industry) {
    return res.status(400).json({ error: 'Please provide an industry (Finance, Pharma, or Power).' });
  }

  const filteredStocks = stocks.filter(stock => stock.industry.toLowerCase() === industry);

  if (filteredStocks.length === 0) {
    return res.status(404).json({ message: 'No stocks found for the specified industry.' });
  }

  res.json({ stocks: filteredStocks });
});

app.get('/stocks', (req, res) => {
  res.json({ stocks });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});