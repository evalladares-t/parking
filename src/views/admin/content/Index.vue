<template lang="pug">
  v-container.fill-height
    v-row(justify='center', align='center')
      v-col
        h1.text-center WELCOME {{ $store.state.user.name }}
</template>

<script>
export default {
  name: 'AdminIndex',
  data: () => ({
    dialogs: {
      msg: false
    },
    valids: {
      form: false
    },
    inputs: {
      name_user: '',
      pass: ''
    },
    loadings: {
      form: false
    },
    flags: {
      e1: true
    },
    text: {
      message: 'El usuario y/o contraseña no coinciden.'
    }
  }),
  created: function () {
  },
  methods: {
    async submit () {
      console.log(this.inputs)
      var data = {
        name_user: this.inputs.name_user,
        pass: this.inputs.pass
      }
      // console.log(data)
      try {
        const response = await this.$api({
          method: 'POST',
          url: '/login',
          data: data
        })
        console.log(response)
        if (!response.data.success) {
          this.dialogs.msg = true
          this.loadings.form = false
          this.text.message = response.data.message
        } else {
          this.auth(response.data.token)
        }
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    auth (data) {
      this.loadings.form = true

      localStorage.setItem('_token', JSON.stringify(data))
      // var retrievedObject = localStorage.getItem('testObject');
      this.$router.push({ name: 'AdminIndex' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
</style>
