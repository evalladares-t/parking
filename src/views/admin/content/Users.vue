<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      //- confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar el usuario ${userItem.name} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      //- v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedUser ? 'Editar' : 'Agregar' }} usuario
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12' sm='6')
                  v-text-field(v-model='userItem.name', label='Nombre')
                v-col(cols='12' sm='6')
                  v-text-field(v-model='userItem.last_name', label='Nombre')
                v-col(cols='12' sm='6')
                  v-text-field(v-model='userItem.dni', label='DNI')
                v-col(cols='12' sm='6')
                  v-text-field(v-model='userItem.imgurl', label='Imagen')
          v-card-actions
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='userItems', sort-by='calories').kt-border_st1.max-width-40r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getUsers') Reset
</template>

<script>
export default {
  name: 'AdminUsers',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'DNI', value: 'dni', align: 'start' },
      { text: 'Nombre', value: 'name', align: 'start' },
      { text: 'Apellido', value: 'last_name', align: 'start' }
      // { text: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ],
    userItems: [],
    defaultUserItem: {
      name: ''
    },
    userItem: {
      name: ''
    },
    editedUser: false,
    indexItem: -1
  }),
  created () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/user'
        })
        this.userItems = response.data.data
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    createShow () {
      this.dialog.edit = true
      this.editedUser = false
    },

    updateShow (item) {
      this.indexItem = this.userItems.indexOf(item)
      this.editedUser = true
      this.userItem = Object.assign({}, item)
      this.dialog.edit = true
    },

    deleteShow (item) {
      this.indexItem = this.userItems.indexOf(item)
      this.userItem = Object.assign({}, item)
      this.dialog.delete = true
    },

    async deleteItem () {
      try {
        const response = await this.$api({
          method: 'DELETE',
          url: '/user/' + this.userItem.iduser
        })
        console.log(response)
        this.userItems.splice(this.indexItem, 1)
      } catch (error) {
        console.error(error)
      }
    },

    saveItem () {
      if (this.editedUser) {
        this.updateItem()
      } else {
        this.createItem()
      }
      this.dialog.edit = false
    },

    async createItem () {
      try {
        const response = await this.$api({
          method: 'POST',
          url: '/user',
          data: this.userItem
        })
        this.userItems.push(response.data.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/user/' + this.userItem.iduser,
          data: this.userItem
        })
        Object.assign(this.userItems[this.indexItem], this.userItem)
        this.reset()
      } catch (error) {
        console.error(error)
      }
    },

    close () {
      this.dialog.edit = false
      this.reset()
    },

    reset () {
      this.$nextTick(() => {
        this.userItem = Object.assign({}, this.defaultUserItem)
      })
    }
  }
}
</script>
