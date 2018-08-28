<template>
  <a :href="href" class="link">
    {{ label }}
    <span class="link__top-line"></span>
  </a>
</template>

<script>
export default {
  name: 'Link',
  props: {
    label: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_vars.scss';

.link {
  position: relative;
  display: inline-block;
  min-width: 150px;
  height: 40px;
  padding: 0 10px;
  outline: none;
  text-align: center;
  cursor: pointer;
  color: #1c264a;
  text-transform: uppercase;
  line-height: 40px;
  font-size: $fs-buttons;
  letter-spacing: $ls-buttons;
  font-weight:$fw-bold;
  background-color: transparent;
  border: 1px solid #f0eae1;
  z-index: 0;
  color:$white;
  text-decoration:none;

  &:after {
    content: ' ';
    position: absolute;
    height: 40px;
    top: -1px;
    left: -1px;
    right: -1px;
    border-left: 1px solid #b5966b;
    border-right: 1px solid #b5966b;
    display: block;
    -webkit-transition: all 0.2s 0.1s;
    transition: all 0.2s 0.1s;
    z-index: 1;
  }
  &:hover {
    &:after {
      height: 0%;
      top: 50%;
    }
    .link__top-line {
      &:before {
        left: 0%;
        width: 0%;
      }
      &:after {
        left: 100%;
        width: 0%;
      }
    }
  }

  &__top-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:after,
    &:before {
      content: '';
      position: absolute;
      top: -1px;
      bottom:-1px;
      border-top: 1px solid #b5966b;
      left: 0%;
      width: 50%;
      display: block;
      border-bottom: 1px solid #b5966b;
      -webkit-transition: all 0.2s;
      transition: all 0.2s;
    }
    &:before {
      left: 50%;
    }
  }
}
</style>
