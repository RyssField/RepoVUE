import { createRouter, createWebHistory } from 'vue-router';
import PanelGestion from '@/components/PanelGestion.vue';
import PaginaInicio from '@/components/PaginaInicio.vue';
import TablaUsuarios from '@/components/TablaUsuarios.vue';
import TablaContacto from '@/components/TablaContacto.vue';
import TablaEmpleo from '@/components/TablaEmpleo.vue';
import NotFound from '@/components/NotFound.vue';
import AvisoLegal from '@/components/AvisoLegal.vue';
import PoliticaPrivacidad from '@/components/PoliticaPrivacidad.vue';
import TablaComentarios from '@/components/TablaComentarios.vue';
import TablaArticulos from '@/components/TablaArticulos.vue';
import TablaRegistro from '@/components/TablaRegistro.vue';
import TablaLogin from '@/components/TablaLogin.vue';
import TiendaProductos from '@/components/TiendaProductos.vue';
import TablaCarrito from '@/components/TablaCarrito.vue';
import TablaSuccess from '@/components/TablaSuccess.vue';
import TablaCancel from '@/components/TablaCancel.vue';

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: PaginaInicio,
  },
  {
    path: '/gestion',
    name: 'gestion',
    component: PanelGestion,
    meta: { requiresAdmin: true },
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: TablaUsuarios,
    meta: { requiresAdmin: true },
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: TablaContacto
  },
  {
    path: '/empleo',
    name: 'empleo',
    component: TablaEmpleo
  },
  {
    path: '/avisos-legales',
    name: 'avisos-legales',
    component: AvisoLegal
  },
  {
    path: '/privacidad',
    name: 'privacidad',
    component: PoliticaPrivacidad
  },
  {
    path: '/comentarios',
    name: 'comentarios',
    component: TablaComentarios
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: TablaArticulos,
    meta: { requiresAdmin: true },
  },
  {
    path: '/registro',
    name: 'registro',
    component: TablaRegistro,
    meta: { requiresNotLogged: true },
  },
  {
    path: '/login',
    name: 'login',
    component: TablaLogin,
    meta: { requiresNotLogged: true },
  },
  {
    path: '/tienda',
    name: 'tienda',
    component: TiendaProductos,
  },
  {
    path: '/carrito',
    name: 'carrito',
    component: TablaCarrito,
  },
  {
    path: '/success',
    name: 'success',
    component: TablaSuccess,
  },
  {
    path: '/cancel',
    name: 'cancel',
    component: TablaCancel,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const isLogueado = localStorage.getItem('isLogueado') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!isLogueado || !isAdmin) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else if (to.meta.requiresNotLogged) {
    const isLogueado = localStorage.getItem('isLogueado') === 'true';

    if (isLogueado) {
      next({ name: 'inicio' });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
