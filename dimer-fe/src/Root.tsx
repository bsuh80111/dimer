import 'src/Root.scss';
import { Navbar } from 'src/components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';


function Root() {

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export { Root };
