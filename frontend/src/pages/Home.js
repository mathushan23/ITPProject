import { useEffect } from "react"
import { useWorkoutsContext } from "../hooks/useWorkoutsContext"

// components
import ProductDetails from "../components/ProductDetails"
import ProductForm from "../components/ProductForm"

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext()

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch('/api/workouts')
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_WORKOUTS', payload: json})
      }
    }

    fetchWorkouts()
  }, [dispatch])

  return (
    <div className="home">
      <div className="workouts">
        {workouts && workouts.map(workout => (
          <ProductDetails workout={workout} key={workout._id} />
        ))}
      </div>
      <ProductForm />
    </div>
  )
}

export default Home