import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import MyVerticallyCenteredModal from './UpdateTask';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask, removeTaskFromList, getTasksFromServer, deleteTaskFromServer } from '../slices/tasksSlice';

const TasksList = () => {
  const { tasksList } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    dispatch(getTasksFromServer());
  }, [dispatch]);

  const updateTask = (task) => {
    console.log('Update Task');
    setModalShow(true);
    dispatch(setSelectedTask(task));
  };

  const deleteTask = (task) => {
    console.log('Delete Task');
    dispatch(deleteTaskFromServer(task))
      .unwrap()
      .then(() => {
        dispatch(removeTaskFromList(task));
      });
  };

  return (
    <section className="container my-5">
      <h3 className="text-center mb-4" style={{ color: '#011F60' }}>Task List</h3>

      <Table striped bordered hover className="shadow-lg rounded text-center">
        <thead style={{ backgroundColor: '#011F60', color: 'white' }}>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasksList && tasksList.map((task, index) => (
            <tr key={task.id}>
              <td>{index + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <Button
                  variant="outline-primary"
                  className="mx-2"
                  onClick={() => updateTask(task)}
                  style={{ borderColor: '#011F60', color: '#011F60' }}
                >
                  <i className="bi bi-pencil-square"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => deleteTask(task)}
                >
                  <i className="bi bi-trash3"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for updating task */}
      <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
    </section>
  );
};

export default TasksList;
