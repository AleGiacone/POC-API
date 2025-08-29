import { useState } from 'react';
import { useMutation } from "@apollo/client";
import { CREATE_TASK, GET_TASKS } from '../graphql/client';


const ToDoForm = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // mutation que refresca automáticamente el query de las tareas
  const [createTask, { loading, error }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      // limpiar inputs después de crear exitosamente
      setTitulo("");
      setDescripcion("");
    }
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      await createTask({
        variables: {
          input: {
            title: titulo,
            description: descripcion,
            status: "pending",
            dueDate: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
          },
        },
      });
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };
    
  
  return (
    <form onSubmit={submit} className="todo-form">
      <input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="¿Qué necesitas hacer?"
        required
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Añade detalles sobre esta tarea (opcional)"
      />
      <button type="submit" className="todo-button" disabled={loading}>
        {loading ? 'Creando...' : 'Añadir tarea'}
      </button>
      {error && <span className="error-message">{error.message}</span>}
    </form>
  );
};

export default ToDoForm;
