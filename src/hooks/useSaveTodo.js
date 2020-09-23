import { useMutation, queryCache } from 'react-query'
import axios from 'axios'


export default function useSaveTodo() {
  return useMutation(
    todo => 
    axios.patch(`/api/todos/${todo.id}`, {
      data: {
        type: 'todos', 
        id: todo.id, 
        attributes: {
          ...todo
      }
    }
  }).then((res) => res.data),
    {
      onMutate: todo => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        queryCache.cancelQueries('todos')

        // Snapshot the previous value
        const previousTodos = queryCache.getQueryData('todos');

        // Optimistically update to the new value
        queryCache.setQueryData('todos', oldTodos =>  {
          const newTodos =  oldTodos.data.map((oldTodo) => {
            if(oldTodo.id === todo.id) {
              return {...oldTodo, attributes: {...todo}}
            } else {
              return oldTodo;
            }
          })
          return {data: newTodos};
        })

        // Return the snapshotted value
        return () => queryCache.setQueryData('todos', previousTodos)
      },
      
      // After success or failure, refetch the todos query
      onSettled: (newTodo, error, variables, rollback) => {
        if(error) rollback();
        queryCache.invalidateQueries('todos')
      },
    }
  )
}