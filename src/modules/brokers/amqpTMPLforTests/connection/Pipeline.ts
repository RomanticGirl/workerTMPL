import { RabbitConnect } from './RabbitConnect';
import { PipelineConfig } from '../interfaces';
import { Types } from '../constants';

export class Pipeline extends RabbitConnect {
  private _pipeline: PipelineConfig;
  constructor(pipelineConfig: PipelineConfig) {
    super();
    this._pipeline = pipelineConfig;
  }
  public async create() {
    try {
      await this.connect();

      // Создаем очереди
      const createQueues = this._pipeline.queues.map(queue =>
        this.chanel.assertQueue(queue.name, queue.options),
      ) as PromiseLike<any>[];
      const promise = [];
      promise.push(...createQueues);

      // Создаём обменники
      if (this._pipeline.exchanges) {
        const createExchanges = this._pipeline.exchanges.map(exchange =>
          this.chanel.assertExchange(exchange.name, exchange.type),
        ) as PromiseLike<any>[];
        promise.push(...createExchanges);
      }
      
      await Promise.all(promise);
      // После создания необходимых компонентов создаём биндинги
      const createBindings = this._pipeline.bindings.map(binding => {
        if (binding.type === Types.QUEUE) {
          return this.chanel.bindQueue(binding.destination, binding.source, binding.routingKey);
        }
        return this.chanel.bindExchange(binding.destination, binding.source, binding.routingKey);
      });

      await Promise.all(createBindings);
      return this.disconnect();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }
}