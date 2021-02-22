import {inject} from '@loopback/core';
import {get, Model, param, post, Request, requestBody, response, ResponseObject, RestBindings} from '@loopback/rest';
import {model, property} from '@loopback/repository';
import {authenticate} from '@loopback/authentication';

/**
 * OpenAPI response for ping()
 */
const SEND_MESSAGE_RESPONSE: ResponseObject = {
  description: 'Send Message Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'SendMessageResponse',
        properties: {},
      },
    },
  },
};

const FETCH_MESSAGES_RESPONSE: ResponseObject = {
  description: 'Fetch Message Response',
  content: {
    'application/json': {
      schema: {
        type: 'array',
        title: 'FetchMessageResponse',
        items: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              title: 'Text'
            },
            timestamp: {
              type: 'string',
              title: 'Timestamp'
            }
          }
        }
      },
    },
  },
};

@model()
export class Message extends Model {

  @property({ required: true })
  text: string;

  @property({
    type: 'date',
    required: false,
    default: '$now',
  })
  timestamp: string;
}

const MESSAGES: Record<string, Message[]> = {};

@authenticate('jwt')
export class MessagesController {

  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {
  }

  @post('/{receiverId}/messages')
  @response(200, SEND_MESSAGE_RESPONSE)
  sendMessage(
    @param.path.string('receiverId') receiverId: string,
    @requestBody() message: Message,
  ): {} {

    console.log('User', receiverId, 'will receive message', message);

    if (!MESSAGES[receiverId]) {
      MESSAGES[receiverId] = [];
    }

    MESSAGES[receiverId].push(message);

    return {};
  }

  @get('/{receiverId}/messages')
  @response(200, FETCH_MESSAGES_RESPONSE)
  fetchMessages(
    @param.path.string('receiverId') receiverId: string,
  ): Message[] {
    return MESSAGES[receiverId] || [];
  }
}
