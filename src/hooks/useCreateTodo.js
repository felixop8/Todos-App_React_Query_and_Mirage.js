import { useMutation, queryCache } from 'react-query'
import axiosConfig from '../api/axiosConfig'
import { v4 as uuidv4 } from 'uuid';

export default function useCreateTodos() {
  const uuid = uuidv4();

    return useMutation(
      newTodo => axiosConfig.post('/api/todos', {
        data: {
          type: 'todos',
          id: newTodo.id,
          attributes: {
            ...newTodo
          }
        }
      }).then((res) => res.data),
      {
        onMutate: newTodo => {
          
          // Todo: move this flag somewhere else.
          queryCache.setQueryData('creatingTodos', (old) => {
            return [...old, newTodo.id];
          })


          // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
          queryCache.cancelQueries('todos')
          
          // Snapshot the previous value
          const previousTodos = queryCache.getQueryData('todos')
  
          // Optimistically update to the new value
          queryCache.setQueryData('todos', oldTodos => ({
            data: [
              ...oldTodos.data,
              {type: 'todos',
              id: newTodo.id,
              attributes: {
                ...newTodo
              }}
            ]
          }))
  
          // Return the snapshotted value
          return () => queryCache.setQueryData('todos', previousTodos)
        },

        // After success or failure, refetch the todos query
        onSettled: (newTodo, error, variables, rollback) => {
          if(error) rollback();

          // Todo: move this flag somewhere else.
          queryCache.setQueryData('creatingTodos', (old) => {
            return old.filter( id => id !== newTodo.data.id);
          })
         
          queryCache.invalidateQueries('todos')
        },
      }
    )
  }