import { ApolloClient, InMemoryCache, gql, } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});
  

//mis pequeñas queries
                                                                                                           
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      dueDate
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status
      dueDate
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      status
      dueDate
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const STATUS_OPTIONS = [
  {
    value: 'pending',
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'in_progress',
    label: 'En Progreso',
    color: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'completed',
    label: 'Completada',
    color: 'bg-green-100 text-green-800',
  },
];
