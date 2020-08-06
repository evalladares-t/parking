<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar el vehículo ${vehicleItem.license_plate} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedVehicle ? 'Editar' : 'Agregar' }} vehículo
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12')
                  v-text-field(v-model='vehicleItem.license_plate', label='Placa')
                v-col(cols='12')
                  v-textarea(v-model='vehicleItem.description', label='Descripción' rows='2')
                v-col(cols='12')
                  v-textarea(v-model='vehicleItem.reference', label='Referencia' rows='2')
          v-card-actions
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='vehicleItems', sort-by='calories').kt-border_st1.max-width-40r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getVehicles') Reset
</template>

<script>
export default {
  name: 'AdminVehicles',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'Placa', value: 'license_plate', align: 'start' },
      { text: 'Referencia', value: 'reference', align: 'start' },
      { text: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ],
    vehicleItems: [],
    defaultVehicleItem: {
      name: ''
    },
    vehicleItem: {
      name: ''
    },
    editedVehicle: false,
    indexItem: -1
  }),
  created () {
    this.getVehicles()
  },
  methods: {
    async getVehicles () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/vehicle'
        })
        this.vehicleItems = response.data.data
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    createShow () {
      this.dialog.edit = true
      this.editedVehicle = false
    },

    updateShow (item) {
      this.indexItem = this.vehicleItems.indexOf(item)
      this.editedVehicle = true
      this.vehicleItem = Object.assign({}, item)
      this.dialog.edit = true
    },

    deleteShow (item) {
      this.indexItem = this.vehicleItems.indexOf(item)
      this.vehicleItem = Object.assign({}, item)
      this.dialog.delete = true
    },

    async deleteItem () {
      try {
        await this.$api({
          method: 'DELETE',
          url: '/vehicle/' + this.vehicleItem.idvehicle
        })
        this.vehicleItems.splice(this.indexItem, 1)
      } catch (error) {
        console.error(error)
      }
    },

    saveItem () {
      if (this.editedVehicle) {
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
          url: '/vehicle',
          data: this.vehicleItem
        })
        this.vehicleItems.push(response.data.data)
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/vehicle/' + this.vehicleItem.idvehicle,
          data: this.vehicleItem
        })
        Object.assign(this.vehicleItems[this.indexItem], this.vehicleItem)
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
        this.vehicleItem = Object.assign({}, this.defaultVehicleItem)
      })
    }
  }
}
</script>
