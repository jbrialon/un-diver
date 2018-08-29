<template>
  <header class="header">
    <c-link :href="''" :label="'Diver collection'" class="header__link"></c-link>
    <a href="/" class="header__logo">
      <img src="@/assets/logo_un@2x.png" alt="Ulysse Nardin">
    </a>
    <c-menu class="header__menu"></c-menu>
  </header>
</template>

<script>
import Menu from '@/components/vue/Menu.vue'
import Link from '@/components/vue/Link.vue'

export default {
  name: 'Header',
  components: {
    'c-menu': Menu,
    'c-link': Link
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

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

  &__menu {
    margin-left:auto;
  }
}
</style>
