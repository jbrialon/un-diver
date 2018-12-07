<template>
  <transition name="slide">
    <div class="cookie-message" v-if="show">
      <div class="cookie-message__content">
        Ulysse Nardin uses cookies to offer you a better experience of navigation. By continuing the navigation, we believe you accept their use
        <div class="cookie-message__buttons">
          <button @click="accept()">
            OK, I AGREE
          </button>
          <a href="https://www.ulysse-nardin.com/fr/services/privacy-policy" target="_blank">
            NO, GIVE ME MORE INFOS
          </a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Cookie',
  data () {
    return {
      show: !JSON.parse(localStorage.getItem('cookie'))
    }
  },
  methods: {
    accept () {
      this.show = false
      localStorage.setItem('cookie', true)
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.cookie-message {
  position:fixed;
  z-index:90;
  bottom:0;
  left:0;
  right:0;
  padding:40px 40px 60px 40px;
  background:#f2f2f2;
  color:$black;
  font-size:12px;
  font-weight:$fw-bold;
  will-change: transform;
  &__content {
    max-width:1280px;
    margin:auto;
  }
  &__buttons {
    display:flex;
    padding-top:20px;
    @include small-only {
      flex-direction:column;
    }
    a,
    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 150px;
      height: 40px;
      padding: 0 10px;
      outline: none;
      text-align: center;
      cursor: pointer;
      color: #1c264a;
      text-transform: uppercase;
      line-height:12px;
      font-size: $fs-buttons;
      letter-spacing: $ls-buttons;
      font-weight:$fw-bold;
      background-color: transparent;
      border: 1px solid $gold;
      z-index: 0;
      color:$black;
      text-decoration:none;
    }
    a {
      color:$black;
    }
    button {
      color:$black;
      margin-right:20px;
      @include small-only {
        margin-right:0;
        margin-bottom:20px;
      }
    }
  }

}
</style>
