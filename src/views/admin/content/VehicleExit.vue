<template lang="pug">
  v-container.py-5
    v-row(justify='center')
      //- loading-modal(:active="loadingm.active", :msg="loadingm.msg")
      confirm-modal(:active.sync="dialog.delete", :msg="`¿ Esta seguro de eliminar la entrada del vehiculo ${data.vehicle[vehicleItem.idvehicle]} ?`", :confirm="{msg: 'Eliminar', color: 'error'}", @confirmevent='deleteItem()')

      v-btn(bottom='', color='primary', dark='', fab='', fixed='', right='', @click='createShow')
        v-icon mdi-plus
      v-dialog(v-model='dialog.edit', content-class="max-width-30r")
        v-card
          v-card-title.grey.darken-2
            span.headline.white--text {{ editedVehicle ? 'Editar' : 'Salida: ' + datehour }}
            v-spacer
            span.green--text S/ {{cost}}
          v-card-text
            v-container.pa-0
              v-row
                v-col(cols='12')
                  v-autocomplete(
                    v-model="data.result"
                    :items="data.entry"
                    item-text="entryText"
                    item-value="idvehiclespace"
                    return-object=''
                    @change='calculateCost'
                    label="Registro de salida")
          v-card-actions
            v-spacer
            v-btn(color='grey darken-1', text='', @click='close') Cancelar
            v-btn(color='green darken-1', text='', @click='saveItem') Guardar
      v-data-table(:headers='headers', :items='vehicleItems', sort-by='calories').kt-border_st1.max-width-50r.width-full.mx-4.elevation-2.border-radius_st1
        template(v-slot:item.cost='{ item }')
          span S/ {{item.cost}}.00
        template(v-slot:item.actions='{ item }')
          v-btn.mx-0.mr-2(icon="" @click='updateShow(item)')
            v-icon(color="blue") mdi-pencil
          v-btn.mx-0(icon="" @click='deleteShow(item)')
            v-icon(color="pink") mdi-delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='getVehicleExit') Reset
</template>

<script>
export default {
  name: 'AdminVehicleExit',
  data: () => ({
    dialog: {
      delete: false,
      edit: false
    },
    headers: [
      { text: 'Entrada', value: 'start', align: 'start' },
      { text: 'Salida', value: 'end', align: 'start' },
      { text: 'Placa', value: 'license_plate', align: 'start' },
      { text: 'Ubicacion', value: 'name', align: 'start' },
      { text: 'Precio', value: 'cost', align: 'end' },
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
    indexItem: -1,
    items: {
      vehicle: [],
      parking: []
    },
    data: {
      entry: [],
      vehicle: [],
      idtypevehicle: [],
      parking: [],
      typevehicle: [],
      result: {}
    },
    datehour: '',
    cost: ''
  }),
  created () {
    this.getParking()
  },
  methods: {
    async getVehicleExit () {
      this.vehicleItems = []
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/vehiclespace'
        })
        response.data.data.map((x, y) => {
          if (!(x.cost === '' || x.cost === 0)) {
            x.license_plate = this.data.vehicle[x.idvehicle]
            x.name = this.data.parking[x.idparking]
            x.start = this.formatDate(x.start)
            x.end = this.formatDate(x.end)
            this.vehicleItems.push(x)
          }
        })
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    async getVehicleEntry () {
      this.data.entry = []
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/vehiclespace'
        })
        response.data.data.map((x, y) => {
          if (x.end === null || x.end === '') {
            x.idtypevehicle = this.data.idtypevehicle[x.idvehicle]
            x.license_plate = this.data.vehicle[x.idvehicle]
            x.name = this.data.parking[x.idparking]
            x.entryText = x.name + ' - ' + x.license_plate + ' - ' + this.formatDate(x.start)
            x.start = this.formatDate(x.start)
            x.price = this.data.typevehicle[x.idtypevehicle]
            this.data.entry.push(x)
          }
        })
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    async getVehicleType () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/typevehicle'
        })
        response.data.data.map((x, y) => {
          this.data.typevehicle[x.idtypevehicle] = x.price
        })
        this.getVehicleEntry()
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    async getVehicles () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/vehicle'
        })
        this.items.vehicle = response.data.data
        response.data.data.map((x) => {
          this.data.vehicle[x.idvehicle] = x.license_plate
          this.data.idtypevehicle[x.idvehicle] = x.idtypevehicle
        })
        this.getVehicleExit()
        this.getVehicleType()
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    async getParking () {
      try {
        const response = await this.$api({
          method: 'GET',
          url: '/parking'
        })
        this.items.parking = response.data.data
        response.data.data.map((x) => {
          this.data.parking[x.idparking] = x.name
        })
        this.getVehicles()
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    calculateCost (data) {
      const start = new Date(data.start)
      const end = new Date(this.datehour)

      const timeDiff = (end.getTime() - start.getTime()) / 1000
      const seconds = Math.round(timeDiff)
      const minutes = Math.round(seconds / 60)
      const hours = Math.round(minutes / 60)
      this.cost = hours < 1 ? data.price : hours * data.price
    },

    getDate () {
      const date = new Date()
      this.datehour = this.formatDate(date)
    },

    formatDate (data) {
      var pad = function (num) {
        var norm = Math.floor(Math.abs(num))
        return (norm < 10 ? '0' : '') + norm
      }
      const date = new Date(data)
      const datetoday = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
      const datehours = pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
      return datetoday + ' ' + datehours
    },

    createShow () {
      this.getDate()
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
          url: '/vehiclespace/salida/' + this.vehicleItem.idvehiclespace
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
      const data = {
        cost: this.cost,
        end: this.datehour
      }
      try {
        await this.$api({
          method: 'PATCH',
          url: '/vehiclespace/salida/' + this.data.result.idvehiclespace,
          data: data
        })
        // this.vehicleItems.push(response.data.data)
        this.getVehicleExit()
        this.getVehicleEntry()
      } catch (error) {
        console.error(error)
      }
    },

    async updateItem () {
      try {
        await this.$api({
          method: 'PATCH',
          url: '/vehiclespace/salida/' + this.vehicleItem.idvehiclespace,
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
