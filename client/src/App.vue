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
