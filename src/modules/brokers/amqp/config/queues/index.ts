export default [
  // Очередь интеграции с валидатором
  {
    name: "PARSER_QUEUE" || 'errWorker',
    options: {
      durable: true,
    },
  },
];