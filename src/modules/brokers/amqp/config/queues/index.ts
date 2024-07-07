export default [
  // Очередь интеграции с валидатором
  {
    name: "VALIDATOR_QUEUE" || 'errWorker',
    options: {
      durable: true,
    },
  },
];