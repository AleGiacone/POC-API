import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK, DELETE_TASK, GET_TASKS } from '../graphql/client';

const ToDo = ({ task }) => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true
  });

  const [deleteTask, { loading: deleteLoading }] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    awaitRefetchQueries: true
  });

  const loading = updateLoading || deleteLoading;

  const save = async () => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          input: { title, description },
        },
      });
      setEdit(false);
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
    }
  };

  const changeStatus = async () => {
    if (task.status === 'completed') return;

    const nextStatus = task.status === 'pending' ? 'in_progress' : 'completed';

    try {
      await updateTask({
        variables: {
          id: task.id,
          input: { status: nextStatus },
        },
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const remove = async () => {
    try {
      await deleteTask({
        variables: { id: task.id },
      });
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getStatusButtonText = (status) => {
    switch (status) {
      case 'pending':
        return 'Iniciar';
      case 'in_progress':
        return 'Completar';
      case 'completed':
        return 'Completada';
      default:
        return 'Cambiar';
    }
  };

  return (
    <div className={`todo-item ${task.status}`}>
      {edit ? (
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
          <button onClick={save} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button onClick={() => setEdit(false)}>Cancelar</button>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <small>
            <span className="status-badge">{formatStatus(task.status)}</span> •
            Fecha límite: {new Date(task.dueDate).toLocaleDateString()}
          </small>
          <div>
            <button
              onClick={changeStatus}
              disabled={task.status === 'completed' || loading}
            >
              {getStatusButtonText(task.status)}
            </button>
            <button
              onClick={() => setEdit(true)}
              disabled={task.status === 'completed'}
            >
              Editar
            </button>
            <button onClick={remove} disabled={loading}>
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ToDo;
