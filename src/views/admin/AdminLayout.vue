<template lang="pug">
  v-app#inspire
    v-navigation-drawer(v-model='drawer', app='', temporary='', width="350")
      v-img(src='https://cdn.vuetifyjs.com/images/cards/server-room.jpg')
        v-list
          v-list-item
            v-list-item-avatar(size='70')
              v-img(:src='$store.state.user ? $store.state.user.imgurl : ""')
          v-menu(bottom right offset-y origin="top left" transition="scale-transition")
            template(v-slot:activator='{ on, attrs }')
              v-list-item(link='' v-on='on' v-bind='attrs')
                v-list-item-content
                  v-list-item-title.title.white--text {{ $store.state.user.name }}
                  v-list-item-subtitle.white--text {{ $store.state.user.last_name }}
                v-list-item-action
                  v-icon.white--text mdi-menu-down
            v-list
              v-list-item(@click="logout")
                v-list-item-title Cerrar sesion
      v-divider.mb-2
      v-list(shaped='')
        template(v-for='item in menu')
          v-list-group(v-if='item.children', :key='item.text', v-model='item.model', :prepend-icon='item.icon', append-icon='mdi-chevron-down')
            template(v-slot:activator='')
              v-list-item-content
                v-list-item-title {{ item.text }}
            v-list-item(v-for='(child, i) in item.children', :key='i', link='', :to="child.route?{name: child.route}:''")
              v-list-item-action(v-if='child.icon')
                v-icon {{ child.icon }}
              v-list-item-content
                v-list-item-title {{ child.text }}
          v-list-item(v-else='', :key='item.text', link='', :to="item.route?{name: item.route}:''")
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title {{ item.text }}

    v-app-bar(app='', dark='', clipped-left='', color="grey darken-3",:src='bg_image', prominent='', shrink-on-scroll='', scroll-target='#scrolling-techniques-2')
      template(v-slot:img='{ props }')
        v-img(v-bind='props', gradient='to top right, rgba(0, 0, 0, 0.4), rgba(70, 70, 70, 0.4)')
      v-app-bar-nav-icon(@click.stop='drawer = !drawer')
      v-toolbar-title.mr-12.align-center
        span.title {{titlename}}
      v-spacer
      v-menu(bottom left offset-y origin="top right" transition="scale-transition")
        template(v-slot:activator='{ on, attrs }')
          v-btn(icon="" v-on='on' v-bind='attrs')
            v-icon mdi-cog
        v-list
          v-list-item(@click="logout")
            v-list-item-title Cerrar sesion
    v-main#scrolling-techniques-2.overflow-y-auto.grey.lighten-4
      router-view
</template>

<script>
export default {
  name: 'AdminLayout',
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    menu: [
      { icon: 'mdi-contacts', text: 'Inicio', route: 'AdminIndex' }
    ],
    bg_image: 'https://source.unsplash.com/1080x150/?parking'
  }),
  watch: {
    '$route' (to, from) {
      this.titlename = this.$route.meta.titlename
      this.changeImage()
    }
  },
  created () {
    this.menu = this.menu.concat(this.$store.state.menu)
    this.titlename = this.$route.meta.titlename
  },
  methods: {
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'AuthLogin' })
      })
    },
    changeImage () {
      const base = 'https://source.unsplash.com/1080x150/?'
      const option = ['automobile', 'road', 'parking', 'vehicle', 'car', 'transportation']
      this.bg_image = base + option[Math.floor(Math.random() * 7)]
    }
  }
}
</script>
