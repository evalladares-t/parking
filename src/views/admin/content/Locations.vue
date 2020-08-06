<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar la ubicación ${locationItem.name} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedLocation ? 'Editar' : 'Agregar' }} ubicacion
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12')
                  v-text-field(v-model='locationItem.name', label='Nombre')
          v-card-actions
            v-switch(v-model='locationItem.state' label="Activo" color="primary" :true-value="'1'" :false-value="'0'").ma-0.pt-0.pl-1
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='locationItems', sort-by='calories').kt-border_st1.max-width-30r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.state='{ item }')
          span(v-if='item.state === "1"').green--text Activo
          span(v-else='').error--text Inactivo
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getLocations') Reset
</template>

<script>
export default {
  name: 'AdminLocations',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'Nombre', value: 'name', align: 'start' },
      { text: 'Estado', value: 'state', align: 'start' },
      { text: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ],
    locationItems: [],
    defaultLocationItem: {
      name: ''
    },
    locationItem: {
      name: ''
    },
    editedLocation: false,
    indexItem: -1
  }),
  created () {
    this.getLocations()
  },
  methods: {
    async getLocations () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/parking'
        })
        this.locationItems = response.data.data
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    createShow () {
      this.dialog.edit = true
      this.editedLocation = false
    },

    updateShow (item) {
      this.indexItem = this.locationItems.indexOf(item)
      this.editedLocation = true
      this.locationItem = Object.assign({}, item)
      this.dialog.edit = true
    },

    deleteShow (item) {
      this.indexItem = this.locationItems.indexOf(item)
      this.locationItem = Object.assign({}, item)
      this.dialog.delete = true
    },

    async deleteItem () {
      try {
        await this.$api({
          method: 'DELETE',
          url: '/parking/' + this.locationItem.idparking
        })
        this.locationItems.splice(this.indexItem, 1)
      } catch (error) {
        console.error(error)
      }
    },

    saveItem () {
      if (this.editedLocation) {
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
          url: '/parking',
          data: this.locationItem
        })
        this.locationItems.push(response.data.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/parking/' + this.locationItem.idparking,
          data: this.locationItem
        })
        Object.assign(this.locationItems[this.indexItem], this.locationItem)
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
        this.locationItem = Object.assign({}, this.defaultLocationItem)
      })
    }
  }
}
</script>
