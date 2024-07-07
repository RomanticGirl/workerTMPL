import { Types } from '../constants';

export default [
  {
    type: Types.EXCHANGE,
    destination: 'integrates',
    source: 'postprocessing',
    routingKey: '#.integrates.#',
  },
  {
    type: Types.QUEUE,
    destination: 'generateRoutingKey',
    source: 'postprocessing',
    routingKey: 'generateRoutingKey',
  },
  {
    type: Types.QUEUE,
    destination: 'validator',
    source: 'integrates',
    routingKey: '#.validator.#',
  },
  {
    type: Types.QUEUE,
    destination: 'validatorHold',
    source: 'integrates',
    routingKey: 'validatorHold',
  },
];