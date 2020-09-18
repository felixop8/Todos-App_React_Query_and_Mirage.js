import { Server, Response } from "miragejs";
import { v4 } from 'uuid';


export function makeServer({ environment = "test" } = {}) {
    let server = new Server({
      environment,
  
      routes() {
        this.namespace = "api";
        this.timing = 2000
        const failureRate = 0.5;

        const fakeDatabase = {
            todos: [{
              id: v4(),
              text: 'hey',
              completed: true,
            }, {
              id: v4(),
              text: 'ho',
              completed: true,
            }, {
              id: v4(),
              text: 'let’s go',
              completed: false,
            }],
          };
  
        this.get("/todos", (schema, request) => {
            const {
                queryParams: { pageOffset, pageSize },
            } = request
        
            const todos = fakeDatabase.todos;
        
            if (Number(pageSize)) {
                const start = Number(pageSize) * Number(pageOffset)
                const end = start + Number(pageSize)
                const page = todos.slice(start, end)
            
                return {
                    items: page,
                    nextPage: todos.length > end ? Number(pageOffset) + 1 : undefined,
                }
            }
            return todos;
        });

        this.post("/todo", (schema, request) => {
            if (Math.random() > failureRate) {
              return new Response(400, { some: 'header' }, { errors: [ 'An unknown error occurred!'] });
            }

            const todo = {
              id: v4(),
              ...JSON.parse(request.requestBody),
              completed: false,
            };
            fakeDatabase.todos.push(todo);
            return todo;
        });
      },
    })
  
    return server
  }