<template>
  <div id="app">
    <DonationForm />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    DonationForm: require('./components/DonationForm.vue').default
  }
}
</script>

<style scoped>
#app{
  font-family: Open Sans;
  font-style: normal;
  font-weight: 400;
  height: 100%;
}
</style>
