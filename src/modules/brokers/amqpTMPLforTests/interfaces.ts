import { Options } from "amqplib";
import { ExchangeTypes, Types } from "./constants";

// Интерфейс описания очереди
export interface Queue {
  name: string;
  options: Options.AssertQueue;
}

// Интерфейс описания обменника
export interface Exchange {
  name: string;
  type: ExchangeTypes;
}

// Интерфейс описания привязки
export interface Binding {
  type: Types;
  destination: string;
  source: string;
  routingKey: string;
}

// Интерфейс конфигурации RabbitMQ
export interface PipelineConfig {
  queues: Queue[];
  exchanges?: Exchange[];
  bindings: Binding[];
}

// Сообщение в рамках системы.
export interface Message<O extends MainMessage> {
  errors: string[];
  retry: number;
  msg: O;
}

// Общий интерфейс сообщения
export interface MainMessage {
  content: string;
}


// Интерфейс сообщения которое будет отправленно в хранилище ошибок
export interface FailMessage extends Message<MainMessage> {
  exchange: string;
  routingKey: string;
}