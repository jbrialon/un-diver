<template>
  <header class="header" :class="{'hidden': vrModeActivated}">
    <c-link :href="''" :label="'Diver collection'" class="header__link" v-if="!vrModeActivated"></c-link>
    <a href="/" class="header__logo" v-if="!vrModeActivated">
      <img src="@/assets/logo_un@2x.png" alt="Ulysse Nardin">
    </a>
    <c-menu class="header__menu"></c-menu>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import Menu from '@/components/vue/Menu.vue'
import Link from '@/components/vue/Link.vue'

export default {
  name: 'Header',
  components: {
    'c-menu': Menu,
    'c-link': Link
  },
  computed: {
    ...mapGetters([
      'vrModeActivated'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.header {
  position:relative;
  display: flex;
  align-items: center;
  height:40px;
  position: fixed;
  z-index: $zMenu;
  top: 2vw;
  left:4vw;
  right: 4vw;

  &__logo {
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    margin:auto;
  }
  &__link {
    @include small-only {
      display:none;
    }
  }
  &__menu {
    margin-left:auto;
    @include small-only {
      display:none;
    }
  }

  @media screen and (max-width: 480px) {
    &__menu, &__link {
      display: none;
    }
  }
}
</style>
