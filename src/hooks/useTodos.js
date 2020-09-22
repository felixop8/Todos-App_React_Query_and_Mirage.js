import { useQuery } from 'react-query'
import axios from 'axios'
import normalize from 'jsonapi-normalizer'

export default function useTodos() {
    return useQuery('todos', () =>
    axios.get('/api/todos').then((res) => normalize(res.data))
  )
}