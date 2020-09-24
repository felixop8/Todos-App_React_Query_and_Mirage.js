import { Server, JSONAPISerializer,  Model, Factory } from "miragejs";
import identityManager from './identityManager';


export function makeServer({ environment = "test" } = {}) {
    let server = new Server({
      environment,
      
      identityManagers: {
        application: identityManager,
      },

      models: {
        todos: Model,
      },

      factories: {
        todo: Factory.extend({
          title(i) {
            return `Todo title ${i}` // Todo title 1, Todo title 2, ...
          },
          description(i) {
            return `Todo description ${i}`
          },
          completed: false,
        }),
      },

      seeds(server) {
        server.create("todo")
        server.create("todo")
        server.create("todo", { completed: true })
      },

      serializers: {
        application: JSONAPISerializer,
      },
  
      routes() {
        this.namespace = "api";
        this.timing = 2000

        this.resource("todos")
      },
    })
  
    return server
  }