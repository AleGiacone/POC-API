import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import ToDoList from './components/ToDoList';
import ToDoForm from './components/ToDoForm';
import './App.css';

function App() {
  // Apollo Client para GraphQL
  const client = new ApolloClient({
    uri: 'http://localhost:4000/', 
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <div className="todo-app">
        <h1>Lista de Tareas</h1>
        <ToDoForm />
        <ToDoList />
      </div>
    </ApolloProvider>
  );
}

export default App;
