import { Contacts } from 'src/pages/Contacts/Contacts';
import { Home } from 'src/pages/Home/Home';
import { Root } from 'src/Root';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/organize',
      },
      {
        path: '/contacts',
        element: <Contacts />
      }
    ]
  }
]);

export { router };