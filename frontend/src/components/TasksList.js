import React,{useState,useEffect} from "react";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import MyVerticallyCenteredModal from './UpdateTask';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedTask, deleteTaskFromServer } from "../slices/tasksSlice";
import { getTasksFromServer } from './../slices/tasksSlice';
import AddTask from "./AddTask.js";

const TasksList = () => {
  const {tasksList} = useSelector((state) => state.tasks)
  const dispatch = useDispatch()

  const updateTask = (task) => {
    console.log("update Task");
    setModalShow(true)
    dispatch(setSelectedTask(task))
  };

  useEffect(() => {
    dispatch(getTasksFromServer())
  },[dispatch])

  const deleteTask = (task) => {
  console.log("Deleting Task:", task); // Debugging step

  dispatch(deleteTaskFromServer(task))
    .unwrap()
    .then(() => {
      console.log("Task Deleted Successfully");
    })
    .catch((error) => {
      console.error("Error Deleting Task:", error);
    });
};


  const [modalShow,setModalShow] = useState(false)
  return (
    <>
    <AddTask/>
      <Table striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            tasksList && tasksList.map((task,index) => {
              return (
                <tr className="text-center" key={task._id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <Button
                    variant="primary"
                    className="mx-3"
                    onClick={() => updateTask(task)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button variant="primary">
                    <i className="bi bi-trash3" onClick={() => deleteTask(task)}></i>
                  </Button>
                </td>
              </tr>
              )
            })
          }
         
        </tbody>
      </Table>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default TasksList;