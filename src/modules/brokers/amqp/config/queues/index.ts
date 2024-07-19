export default [
  // Очередь интеграции с валидатором
  {
    name: "PARSER_QUEUE",
    options: {
      durable: true,
    },
  }, 
  {
    name: "VALIDATOR_QUEUE",
    options: {
      durable: true,
    },
  },
];