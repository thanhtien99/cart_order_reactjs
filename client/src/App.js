import './App.css';
import Footer from './components/layout/footer';
import Navbar from './components/layout/navbar';
import PathURL from './components/pathURL';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='App'>
      <Navbar/>
      <section className='d-flex flex-grow-1 align-items-center justify-content-center'>
        <PathURL />
      </section>
      <Footer/>
      <ToastContainer/>
    </div>
  );
}

export default App;
