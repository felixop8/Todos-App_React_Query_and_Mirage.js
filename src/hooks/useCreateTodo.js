import { useMutation, queryCache } from 'react-query'
import axios from 'axios'



export default function useCreateTodos() {
    return useMutation(
      (values) => axios.post('/api/todos', values).then((res) => res.data),
      {
        onSuccess: () => queryCache.refetchQueries('todos'),
      }
    )
  }