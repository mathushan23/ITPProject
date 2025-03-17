import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import AddTask from './components/AddTask';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TasksList from './components/TasksList';



function App() {
  return (
    <Container>
    <Navbar/>
    <Row className="justify-content-md-center">
        <Col lg="6">
    <AddTask/>
    <TasksList/>
    </Col>
    </Row>
    </Container>
  );
}

export default App;
