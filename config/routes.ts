export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        name: 'village',
        component: './village',
      },
      {
        path: '/equipment',
        name: 'equipment',
        routes: [
          {
            path: 'access',
            name: 'access',
            component: './equipment/access',
          },
          {
            path: 'charge',
            name: 'charge',
            component: './equipment/charge',
          },
        ],
      },
      {
        path: '/client',
        name: 'client',
        component: './client',
      },     
      {
        path: '/order',
        name: 'order',
        routes: [
          {
            path: 'access',
            name: 'access',
            component: './order/access',
          },
          {
            path: 'charge',
            name: 'charge',
            component: './order/charge',
          },
          {
            path: 'create',
            name: 'create',
            component: './order/create',
          },
        ],
      },
      // {
      //   path: '/log',
      //   name: 'log',
      //   component: './log',
      // },
      {
        path: '/log',
        name: 'log',
        routes: [
          {
            path: 'access',
            name: 'access',
            component: './log/access',
          },
          {
            path: 'charge',
            name: 'charge',
            component: './log/charge',
          },
        ],
      },
      {
        path: '/message',
        name: 'message',
        component: './message',
      },
      // {
      //   path: '/welcome',
      //   name: 'welcome',
      //   icon: 'smile',
      //   component: './Welcome',
      // },
      {
        path: '/admin',
        name: 'admin',
        icon: 'crown',
        component: './Admin',
        authority: ['admin'],
        routes: [
          {
            path: '/admin/sub-page',
            name: 'sub-page',
            icon: 'smile',
            component: './Welcome',
            authority: ['admin'],
          },
        ],
      },
      // {
      //   name: 'list.table-list',
      //   icon: 'table',
      //   path: '/list',
      //   component: './ListTableList',
      // },

      {
        component: './404',
      },
      // {
      //   path: '/',
      //   component: '../layouts/BasicLayout',
      //   authority: ['admin', 'user'],
      //   routes: [

      //   ],
      // },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
