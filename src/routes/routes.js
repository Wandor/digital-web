import Users from '../pages/Administration/Users/Users';
import AddUser from '../pages/Administration/Users/AddUser';

const routes = [

  {
    path: '/app/create-user',
    exact: true,
    name: 'Create User',
    component: AddUser,
  },
  {
    path: '/app/edit-user/:id',
    exact: true,
    name: 'Edit User',
    component: AddUser,
  },
  {
    path: '/',
    exact: true,
    name: 'Users List',
    component: Users,
  },
];

export default routes;
