export default [
    // Очередь для сообщений для которых нужно сгенерировать routingKey
    {
      name: 'generateRoutingKey',
      options: {
        durable: true,
      },
    },
    // Очередь интеграции с валидатором
    {
      name: 'validator',
      options: {
        durable: true,
      },
    },
    // Отложенная очередь для сообщений которые ожидают повторной отправки к валидатору
    {
      name: 'validatorHold',
      options: {
        durable: true,
        deadLetterExchange: 'integrates',
        deadLetterRoutingKey: 'validator',
        messageTtl: 60000,
      },
    },
  ];