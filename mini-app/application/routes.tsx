import type { RouteObject } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { NotFoundScreen, SelectRecipient, Sign } from '@example/screens';

export const routes: RouteObject[] = [
  {
    path: '/select',
    element: <Outlet />,
    children: [
      {
        path: '*',
        element: <NotFoundScreen />,
      },
      {
        index: true,
        element: <SelectRecipient />,
      },
    ],
  },
  {
    path: '/sign',
    element: <Outlet />,
    children: [
      {
        path: '*',
        element: <NotFoundScreen />,
      },
      {
        index: true,
        element: <Sign />,
      },
    ],
  },
];
