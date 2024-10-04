import { Route, Routes } from 'react-router-dom';
import './App.css';
// Pages
import Home from './pages/Home.tsx';


function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={ <Home /> }>
      </Route>
    </Routes>
    </>
  )
}

export default App
