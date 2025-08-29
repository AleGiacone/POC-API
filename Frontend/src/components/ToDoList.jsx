import { useQuery } from '@apollo/client';
import { GET_TASKS } from '../graphql/client';
import ToDo from './ToDo';


const ToDoList = () => {
  const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const tasks = data?.tasks || [];

  return (
    <div className="todo-list">
      {tasks.length === 0 ? (
        <p>No hay tareas disponibles</p>
      ) : (
        tasks.map((task) => (
          <ToDo key={task.id} task={task} />
        ))
      )}
    </div>
  );
};

export default ToDoList;
