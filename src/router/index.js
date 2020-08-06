import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

// AUTH
import AuthLayout from '@/views/auth/AuthLayout.vue'
import AuthLogin from '@/views/auth/content/Login.vue'

// ADMIN
import AdminLayout from '@/views/admin/AdminLayout.vue'

import AdminIndex from '@/views/admin/content/Index.vue'
import AdminProfiles from '@/views/admin/content/Profiles.vue'
import AdminUsers from '@/views/admin/content/Users.vue'
import AdminLocations from '@/views/admin/content/Locations'
import AdminVehicleTypes from '@/views/admin/content/VehicleTypes'
import AdminVehicles from '@/views/admin/content/Vehicles'
import AdminVehicleEntry from '@/views/admin/content/VehicleEntry'
import AdminVehicleExit from '@/views/admin/content/VehicleExit'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/',
    component: AuthLayout,
    children: [{
      path: '',
      name: 'AuthLogin',
      component: AuthLogin
    }]
  },
  {
    path: '/administrador',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminIndex',
        component: AdminIndex,
        meta: {
          titlename: 'Parking',
          hidden: true
        }
      },
      {
        path: '/perfiles',
        name: 'AdminProfiles',
        component: AdminProfiles,
        meta: {
          titlename: 'Perfiles'
        }
      },
      {
        path: '/usuarios',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: {
          titlename: 'Usuarios'
        }
      },
      {
        path: '/ubicaciones',
        name: 'AdminLocations',
        component: AdminLocations,
        meta: {
          titlename: 'Ubicaciones'
        }
      },
      {
        path: '/tipos-de-vehiculos',
        name: 'AdminVehicleTypes',
        component: AdminVehicleTypes,
        meta: {
          titlename: 'Tipos de vehículos'
        }
      },
      {
        path: '/vehiculos',
        name: 'AdminVehicles',
        component: AdminVehicles,
        meta: {
          titlename: 'Vehículos'
        }
      },
      {
        path: '/ingreso-de-vehiculo',
        name: 'AdminVehicleEntry',
        component: AdminVehicleEntry,
        meta: {
          titlename: 'Ingreso de vehículos'
        }
      },
      {
        path: '/salida-de-vehiculo',
        name: 'AdminVehicleExit',
        component: AdminVehicleExit,
        meta: {
          titlename: 'Salida de vehículos'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'AuthLogin') {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/')
  } else {
    next()
  }
})

export default router
