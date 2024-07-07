import { BrokerTypes } from "../../amqp.types";

export default [
  {
    type: BrokerTypes.QUEUE,
    destination: 'validator',
    source: 'integrates',
    routingKey: '#.validator.#',
  },
  {
    type: BrokerTypes.QUEUE,
    destination: 'validatorHold',
    source: 'integrates',
    routingKey: 'validatorHold',
  },
];