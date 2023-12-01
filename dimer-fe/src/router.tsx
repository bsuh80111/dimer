import { Home } from "src/pages/Home/Home";
import { Players } from "src/pages/Players/Players";
import { Root } from "src/Root";
import { createBrowserRouter } from "react-router-dom";

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
        path: 'players',
        element: <Players />
      }
    ]
  }
]);

export { router };