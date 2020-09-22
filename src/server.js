import { Server, JSONAPISerializer,  Model, Factory } from "miragejs";


export function makeServer({ environment = "test" } = {}) {
    let server = new Server({
      environment,

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

        // Get todos.
        this.get("/todos")

        // Create todo.
        this.post("/todos");

        // Get todo by id.
        this.get("/todos/:id");

        // Edit todo by id.
        this.patch("/todos/:id")

        // Delete todo by id.
        this.del("/todos/:id")

        // Get todos with pagination.
        this.get("/todos/pagination", (schema, request) => {
          const {queryParams: { pageOffset, pageSize }} = request

          const todos = schema.db.todos;
      
          if (Number(pageSize)) {
              const start = Number(pageSize) * Number(pageOffset)
              const end = start + Number(pageSize)
              const page = todos.slice(start, end)
          
              return {
                  items: page,
                  nextPage: todos.length > end ? Number(pageOffset) + 1 : undefined,
              }
          }
          return todos
      });
      },
    })
  
    return server
  }