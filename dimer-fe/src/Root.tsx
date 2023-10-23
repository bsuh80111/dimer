import './Root.scss';
import { Navbar } from './components/Navbar/Navbar';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';


function Root() {

  return (
    <>
      <Navbar />
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export { Root };
