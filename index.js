const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(cors());
let stocks = [
  { id: 1, name: "reliance industries", price: 2500, growth: 3.5, industry: "finance", exchange: "nse" },
  { id: 2, name: "hdfc bank", price: 1800, growth: 4.2, industry: "finance", exchange: "bse" },
  { id: 3, name: "icici bank", price: 1600, growth: 5.1, industry: "finance", exchange: "nse" },
  { id: 4, name: "tata consultancy services", price: 3200, growth: 2.9, industry: "finance", exchange: "bse" },
  // Continue with the rest of the stocks...
];

app.get('/stocks/sort/pricing', (req, res) => {
  const pricing = req.query.order;
  let sortedStocks;

  if (pricing === 'high-to-low') {
    sortedStocks = [...stocks].sort((a, b) => b.price - a.price);
  } else {
    sortedStocks = [...stocks].sort((a, b) => a.price - b.price);
  }

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