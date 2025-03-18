import { useState } from "react";
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');


  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { title, description,price,quantity };

    const response = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setTitle('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setError(null);
      dispatch({ type: 'CREATE_WORKOUT', payload: json });

      setEmptyFields([]);
      console.log('New workout added:', json);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a new Product</h3>

      <label htmlFor="title">Product name</label>
      <input
        id="title"
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className={emptyFields.includes('description') ? 'error' : ''}
      />

      <label htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        onChange={(e) => setPrice(e.target.value)}
        value={price}
        className={emptyFields.includes('price') ? 'error' : ''}
      />
      <label htmlFor="quantity">Quantity</label>
      <input
        id="quantity"
        type="number"
        onChange={(e) => setQuantity(e.target.value)}
        value={quantity}
        className={emptyFields.includes('quantity') ? 'error' : ''}
      />

      <button>Add Product</button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
