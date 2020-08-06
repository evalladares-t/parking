<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar el tipo ${vehicletypeItem.name} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedVehicleType ? 'Editar' : 'Agregar' }} tipo
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12')
                  v-text-field(v-model='vehicletypeItem.name', label='Nombre')
                v-col(cols='12')
                  v-text-field(v-model='vehicletypeItem.price', label='Precio')
                    template(slot="prepend")
                      span S/
          v-card-actions
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='vehicletypeItems', sort-by='calories').kt-border_st1.max-width-35r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.price='{ item }')
          span S/{{item.price}}.00
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getVehicleTypes') Reset
</template>

<script>
export default {
  name: 'AdminVehicleTypes',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'Nombre', value: 'name', align: 'start' },
      { text: 'Precio', value: 'price', align: 'end' },
      { text: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ],
    vehicletypeItems: [],
    defaultVehicleTypeItem: {
      name: ''
    },
    vehicletypeItem: {
      name: ''
    },
    editedVehicleType: false,
    indexItem: -1
  }),
  created () {
    this.getVehicleTypes()
  },
  methods: {
    async getVehicleTypes () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/typevehicle'
        })
        this.vehicletypeItems = response.data.data
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    createShow () {
      this.dialog.edit = true
      this.editedVehicleType = false
    },

    updateShow (item) {
      this.indexItem = this.vehicletypeItems.indexOf(item)
      this.editedVehicleType = true
      this.vehicletypeItem = Object.assign({}, item)
      this.dialog.edit = true
    },

    deleteShow (item) {
      this.indexItem = this.vehicletypeItems.indexOf(item)
      this.vehicletypeItem = Object.assign({}, item)
      this.dialog.delete = true
    },

    async deleteItem () {
      try {
        await this.$api({
          method: 'DELETE',
          url: '/typevehicle/' + this.vehicletypeItem.idtypevehicle
        })
        this.vehicletypeItems.splice(this.indexItem, 1)
      } catch (error) {
        console.error(error)
      }
    },

    saveItem () {
      if (this.editedVehicleType) {
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
          url: '/typevehicle',
          data: this.vehicletypeItem
        })
        this.vehicletypeItems.push(response.data.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/typevehicle/' + this.vehicletypeItem.idtypevehicle,
          data: this.vehicletypeItem
        })
        Object.assign(this.vehicletypeItems[this.indexItem], this.vehicletypeItem)
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
        this.vehicletypeItem = Object.assign({}, this.defaultVehicleTypeItem)
      })
    }
  }
}
</script>
