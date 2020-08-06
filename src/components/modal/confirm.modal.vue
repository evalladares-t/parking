<template lang="pug">
  v-dialog(v-model="modal" max-width="31.25rem")
    v-card
      v-card-title
        span.grey--text.text--darken-1 {{ msg }}
      v-card-actions
        v-spacer
        v-btn(color="grey darken-1" text='' @click.native="deny") Cancelar
        v-btn(:color="confirm.color" text='' @click.native="confirmevent") {{confirm.msg}}
</template>

<script>
export default {
  name: 'confirmModal',
  props: {
    active: {
      default: false
    },
    name: {
      default: 'ktconfirm'
    },
    msg: {
      default: '¿ Esta seguro ?'
    },
    confirm: {
      type: Object,
      default: function () {
        return {
          msg: 'Confirmar',
          color: 'green'
        }
      }
    }
  },
  data: function () {
    return {
      modal: false
    }
  },
  watch: {
    active (val) {
      // console.log(val, 'active')
      if (val) {
        this.modal = this.active
      }
    },
    modal (val) {
      // console.log(val, 'modal')
      if (!val) {
        this.$emit('update:active', false)
      }
    }
  },
  mounted: function () {

  },
  methods: {
    confirmevent () {
      this.modal = false
      this.$emit('update:active', false)
      this.$emit('confirmevent', true)
    },
    deny () {
      this.modal = false
      this.$emit('update:active', false)
      this.$emit('denyevent', true)
    }
  }
}
</script>
<style lang="sass" scoped>
  .google-maps
    width: 100%
    height: 50vh
    margin: 0 auto
    background: gray
</style>
