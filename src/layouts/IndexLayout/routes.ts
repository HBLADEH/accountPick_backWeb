import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';

const IndexLayoutRoutes: Array<RoutesDataItem> = [
  /*
  {
    title: 'index-layout.menu.home',
    path: '/home',
    component: ()=> import('@/views/home/index.vue')
  }, */

  {
    icon: 'home',
    title: 'index-layout.menu.home',
    path: '/home',
    redirect: '/home/workplace',
    component: BlankLayout,
    children: [
      {
        icon: 'control',
        title: 'index-layout.menu.home.workplace',
        path: 'workplace',
        component: () => import('@/views/home/index.vue')
      },
      {
        icon: 'edit',
        title: 'index-layout.menu.home.custom-breadcrumbs',
        path: 'custombreadcrumbs',
        component: () => import('@/views/custom-breadcrumbs/index.vue'),
        breadcrumb: [
          {
            title: 'index-layout.menu.home.custom-breadcrumbs',
            path: '/home/custombreadcrumbs',
          },
          {
            title: 'index-layout.menu.home',
            path: '/home',
          },
          {
            title: 'index-layout.menu.home.custom-breadcrumbs.liqingsong.cc',
            path: 'http://liqingsong.cc',
          },
        ],
      },
      {
        icon: 'detail',
        title: 'index-layout.menu.home.docs',
        path: 'http://admin-element-vue.liqingsong.cc/',
        belongTopMenu: '/home',
        redirect: ''
      },
    ],
  },

  {
    icon: 'page',
    title: 'index-layout.menu.goods',
    path: '/goods',
    redirect: '/goods/list',
    component: BlankLayout,
    children: [
      {
        icon: '',
        title: 'index-layout.menu.goods.list',
        path: 'list',
        component: () => import('@/views/goods/list/index.vue')
      },
      {
        icon: '',
        title: 'index-layout.menu.goods.add',
        path: 'add',
        component: () => import('@/views/goods/add/index.vue')
      },
      {
        hidden: true,
        icon: '',
        title: 'index-layout.menu.goods.edit',
        path: 'edit',
        component: () => import('@/views/goods/edit/index.vue'),
      }
    ]
  },
  {
    icon: 'page',
    title: 'index-layout.menu.game',
    path: '/games',
    redirect: '/games/list',
    component: BlankLayout,
    children: [
      {
        icon: '',
        title: 'index-layout.menu.game.list',
        path: 'list',
        component: () => import('@/views/game/table/index.vue')
      },
    ]
  }, {
    icon: 'page',
    title: 'index-layout.menu.channel',
    path: '/channels',
    redirect: '/channels/list',
    component: BlankLayout,
    children: [
      {
        icon: '',
        title: 'index-layout.menu.channel.list',
        path: 'list',
        component: () => import('@/views/channel/table/index.vue')
      },
    ]
  },

  {
    icon: 'components',
    title: 'index-layout.menu.component',
    path: '/component',
    redirect: '/component/icon/svg',
    component: BlankLayout,
    children: [
      {
        icon: 'icon',
        title: 'index-layout.menu.component.icon',
        path: 'icon',
        redirect: '/component/icon/svg',
        component: BlankLayout,
        children: [
          {
            title: 'index-layout.menu.component.icon.svg',
            path: 'svg',
            component: () => import('@/views/component/icon/svg/index.vue'),
          },
          {
            title: 'index-layout.menu.component.icon.font',
            path: 'font',
            component: () => import('@/views/component/icon/font/index.vue'),
          },
        ]
      },
    ]
  },

  {
    icon: 'page',
    title: 'index-layout.menu.pages',
    path: '/pagesample',
    redirect: '/pagesample/list/table',
    component: BlankLayout,
    children: [
      {
        icon: 'list',
        title: 'index-layout.menu.pages.list',
        path: 'list',
        redirect: '/pagesample/list/table',
        component: BlankLayout,
        children: [
          {
            title: 'index-layout.menu.pages.list.table',
            path: 'table',
            component: () => import('@/views/pagesample/list/table/index.vue'),
          },
          {
            title: 'index-layout.menu.pages.list.highly-adaptive-table',
            path: 'highlyadaptivetable',
            component: () => import('@/views/pagesample/list/highly-adaptive-table/index.vue'),
          },
          {
            title: 'index-layout.menu.pages.list.search',
            path: 'search',
            redirect: '/pagesample/list/search/table',
            component: BlankLayout,
            children: [
              {
                title: 'index-layout.menu.pages.list.search.table',
                path: 'table',
                component: () => import('@/views/pagesample/list/search/table/index.vue'),
              }
            ],
          },
        ],
      },
      {
        icon: 'edit',
        title: 'index-layout.menu.pages.form',
        path: 'form',
        redirect: '/pagesample/form/basic',
        component: BlankLayout,
        children: [
          {
            title: 'index-layout.menu.pages.form.basic',
            path: 'basic',
            component: () => import('@/views/pagesample/form/basic/index.vue'),
          },
          {
            title: 'index-layout.menu.pages.form.complex',
            path: 'complex',
            component: () => import('@/views/pagesample/form/complex/index.vue'),
          },
        ],
      },
      {
        icon: 'detail',
        title: 'index-layout.menu.pages.detail',
        path: 'detail',
        redirect: '/pagesample/detail/basic',
        component: BlankLayout,
        children: [
          {
            title: 'index-layout.menu.pages.detail.basic',
            path: 'basic',
            component: () => import('@/views/pagesample/detail/basic/index.vue'),
          },
          {
            title: 'index-layout.menu.pages.detail.module',
            path: 'module',
            component: () => import('@/views/pagesample/detail/module/index.vue'),
          },
          {
            title: 'index-layout.menu.pages.detail.table',
            path: 'table',
            component: () => import('@/views/pagesample/detail/table/index.vue'),
          },
        ],
      },
    ],
  },

  {
    icon: 'permissions',
    title: 'index-layout.menu.roles',
    path: '/roles',
    redirect: '/roles/all',
    component: BlankLayout,
    children: [
      {
        icon: 'detail',
        title: 'index-layout.menu.roles.all',
        path: 'all',
        component: () => import('@/views/roles/all/index.vue'),
      },
      {
        icon: 'detail',
        roles: ['user'],
        title: 'index-layout.menu.roles.user',
        path: 'user',
        component: () => import('@/views/roles/user/index.vue'),
      },
      {
        icon: 'detail',
        roles: ['test'],
        title: 'index-layout.menu.roles.test',
        path: 'test',
        component: () => import('@/views/roles/test/index.vue'),
      },
    ],
  },

];

export default IndexLayoutRoutes;