import { useQuery } from 'react-query'
import axios from 'axios'

export default function useTodos() {
    return useQuery('todos', () => axios.get('/api/todos').then((res) => res.data))
}