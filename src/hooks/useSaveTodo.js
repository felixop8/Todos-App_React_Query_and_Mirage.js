import { useMutation, queryCache } from 'react-query'
import axios from 'axios'


export default function useSaveTodo() {
  return useMutation(
    (values) => 
      axios.patch(`/api/todos/${values.data.id}`, values).then((res) => res.data),
    {
      onMutate: (values) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        queryCache.cancelQueries('todos')

        // Snapshot the previous value
        const previousTodos = queryCache.getQueryData(['todos']);

        // Optimistically update to the new value
        queryCache.setQueryData(['todos'], (old) =>  ({
          ...old,
          entities: {todos: { ...old.entities.todos, [values.data.id]: {id: values.data.id, ...values.data.attributes} }},
        }))

        // Return the snapshotted value
        return () => queryCache.setQueryData(['posts'], previousTodos)
      },

       // If the mutation fails, use the value returned from onMutate to roll back
      onError: (error, values, rollback) => rollback(),
      
      // Always refetch after error or success:
      onSettled: (values) => {
        queryCache.invalidateQueries('todos')
      },
    }
  )
}