const WebSocket = require('ws');

// Create WebSocket server on port 3001 (IPv4 only)
const wss = new WebSocket.Server({
  port: 3001,
  host: '127.0.0.1'
});

console.log('WebSocket server started on ws://127.0.0.1:3001');

// Store subscriptions for each symbol
const subscriptions = new Map();

// Generate mock trade data
function generateTradeData(symbol) {
  const now = Date.now();
  const basePrice = 0.15 + Math.random() * 0.02; // Base price around 0.15-0.17
  const volatility = 0.001;

  return {
    type: "trade",
    symbol: symbol,
    payload: {
      timestamp: now,
      open: basePrice,
      high: basePrice + (Math.random() * volatility),
      low: basePrice - (Math.random() * volatility),
      close: basePrice + ((Math.random() - 0.5) * volatility),
      volume: Math.floor(500 + Math.random() * 2000),
      previousClose: basePrice - ((Math.random() - 0.5) * volatility)
    }
  };
}

// Handle new connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Track subscriptions for this client
  const clientSubscriptions = new Set();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'subscribe' && data.payload.symbol) {
        const symbol = data.payload.symbol;
        clientSubscriptions.add(symbol);

        // Add to global subscriptions
        if (!subscriptions.has(symbol)) {
          subscriptions.set(symbol, new Set());
        }
        subscriptions.get(symbol).add(ws);

        console.log(`Client subscribed to ${symbol}`);

        // Send initial data immediately
        const initialData = generateTradeData(symbol);
        ws.send(JSON.stringify(initialData));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    // Remove client from all subscriptions
    clientSubscriptions.forEach(symbol => {
      if (subscriptions.has(symbol)) {
        subscriptions.get(symbol).delete(ws);
        if (subscriptions.get(symbol).size === 0) {
          subscriptions.delete(symbol);
        }
      }
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast live data to subscribed clients
setInterval(() => {
  subscriptions.forEach((clients, symbol) => {
    const tradeData = generateTradeData(symbol);

    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(tradeData));
      }
    });
  });
}, 2000); // Send new data every 2 seconds

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
