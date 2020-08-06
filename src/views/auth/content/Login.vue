<template lang="pug">
  v-form(v-model="valids.form" @submit.prevent="submit").elevation-5
    .align-self-center.width-full
      //- .parent_img
        img(:src="require('@/assets/img/logo.svg')")
      .initxt.headline.text-center.mb-1 Iniciar sesión
      v-text-field(v-model="inputs.name_user",name="usuario",:rules="[$rules.required]",label="Usuario")
      v-text-field(v-model="inputs.pass",
        :append-icon="flags.e1 ? 'mdi-eye' : 'mdi-eye-off'",
        @click:append="flags.e1 = !flags.e1",
        :type="flags.e1 ? 'password' : 'text'",
        label="Ingrese su contraseña",
        :rules="[$rules.required]")
      v-btn(block depressed
        :loading="loadings.form"
        :disabled="loadings.form || !valids.form"
        /* @click.native="submit" */
        type="submit"
        ).primary.white--text Login
      v-dialog(v-model='dialogs.msg' content-class="max-width-20r")
        div
          v-card(class="mx-auto" outlined="")
            v-card-text.headline
              h5 {{text.message}}
              //- .headline.mb-0
                i.v-icon.material-icons.theme--light.v-alert__icon.error--text(aria-hidden='true') warning
                | Error
            v-card-actions
              v-spacer
              v-btn(depressed="" @click.native="dialogs.msg = false").primary Aceptar
</template>

<script>
export default {
  name: 'AuthLogin',
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
      var data = {
        name_user: this.inputs.name_user,
        pass: this.inputs.pass
      }
      try {
        const response = await this.$api({
          method: 'POST',
          url: '/login',
          data: data
        })
        if (!response.data.success) {
          this.dialogs.msg = true
          this.loadings.form = false
          this.text.message = response.data.message
        } else {
          this.auth(response.data)
        }
      } catch (error) {
        console.error(error)
        this.loadings.form = false
      }
    },

    auth (data) {
      this.loadings.form = true
      this.$store.dispatch('login', data)
        .then(() => this.$router.push({ name: 'AdminIndex' }))
        .catch(err => console.log(err))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
</style>
