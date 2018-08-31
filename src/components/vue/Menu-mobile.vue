<template>
  <nav class="menu-mobile">

  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import Link from '@/components/vue/Link.vue'

export default {
  name: 'Menu',
  data () {
    return {
      sound: true
    }
  },
  components: {
    'c-link': Link
  },
  computed: {
    ...mapGetters([
      'vrModeActivated'
    ])
  },
  methods: {
    toggleSound () {
      this.sound = !this.sound
    },
    toggleVrMode () {
      this.$store.commit('toggleVrMode')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

.menu-mobile {
  display:flex;

}
</style>
