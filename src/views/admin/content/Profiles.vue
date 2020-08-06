<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar el perfil ${profileItem.name} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedProfile ? 'Editar' : 'Agregar' }} perfil
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12')
                  v-text-field(v-model='profileItem.name', label='Nombre')
          v-card-actions
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='profileItems', sort-by='calories').kt-border_st1.max-width-35r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getProfiles') Reset
</template>

<script>
export default {
  name: 'AdminProfile',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'Nombre', value: 'name', align: 'start' },
      { text: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ],
    profileItems: [],
    defaultProfileItem: {
      name: ''
    },
    profileItem: {
      name: ''
    },
    editedProfile: false,
    indexItem: -1
  }),
  created () {
    this.getProfiles()
  },
  methods: {
    async getProfiles () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/profile'
        })
        this.profileItems = response.data.data
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    createShow () {
      this.dialog.edit = true
      this.editedProfile = false
    },

    updateShow (item) {
      this.indexItem = this.profileItems.indexOf(item)
      this.editedProfile = true
      this.profileItem = Object.assign({}, item)
      this.dialog.edit = true
    },

    deleteShow (item) {
      this.indexItem = this.profileItems.indexOf(item)
      this.profileItem = Object.assign({}, item)
      this.dialog.delete = true
    },

    async deleteItem () {
      try {
        const response = await this.$api({
          method: 'DELETE',
          url: '/profile/' + this.profileItem.idprofile
        })
        console.log(response)
        this.profileItems.splice(this.indexItem, 1)
      } catch (error) {
        console.error(error)
      }
    },

    saveItem () {
      if (this.editedProfile) {
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
          url: '/profile',
          data: this.profileItem
        })
        this.profileItems.push(response.data.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/profile/' + this.profileItem.idprofile,
          data: this.profileItem
        })
        Object.assign(this.profileItems[this.indexItem], this.profileItem)
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
        this.profileItem = Object.assign({}, this.defaultProfileItem)
      })
    }
  }
}
</script>
