<template>
  <transition name="fade">
    <div class="social-networks" v-if="show">
      <ul>
        <li>{{ $t("footer_contact") }}</li>
        <li>
          <a href="https://www.instagram.com/ulyssenardinofficial/" target="_blank">
            <icon-inst></icon-inst>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/ulysse_nardin" target="_blank">
            <icon-tw></icon-tw>
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/UlysseNardinwatches/" target="_blank">
            <icon-fb></icon-fb>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/UlysseNardinWatches" target="_blank">
            <icon-yt></icon-yt>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/company/ulyssenardin-sa/" target="_blank">
            <icon-in></icon-in>
          </a>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import iconInst from '@/components/icon/icon-inst.vue'
import iconTw from '@/components/icon/icon-tw.vue'
import iconFb from '@/components/icon/icon-fb.vue'
import iconYt from '@/components/icon/icon-yt.vue'
import iconIn from '@/components/icon/icon-in.vue'

import Utils from '@/utils/Utils'

export default {
  name: 'social-networks',
  data () {
    return {
      isMobile: Utils.isMobile()
    }
  },
  components: {
    'icon-inst': iconInst,
    'icon-tw': iconTw,
    'icon-fb': iconFb,
    'icon-yt': iconYt,
    'icon-in': iconIn
  },
  computed: {
    ...mapGetters([
      'menuMobileActivated',
      'uiActivated'
    ]),
    show () {
      return (this.isMobile && this.menuMobileActivated) || (!this.isMobile && this.uiActivated)
    }
  }
}
</script>

<style lang="scss">
@import '@/scss/_vars.scss';
@import '@/scss/_mixins.scss';

.social-networks {
  position:fixed;
  right:4vw;
  bottom:4vw;
  color:$white;
  z-index:$zSocialNetwork;
  @include small-only {
    color:$darkblue;
    left:8vw;
    right:8vw;
    bottom:8vw;
  }
  ul {
    display:flex;
    align-items: center;
    @include small-only {
      justify-content: flex-end;
    }
    li {
      margin:0 10px;
      a {
        display:block;
        opacity:0.8;
        @include small-only {
          opacity:1;
        }
        transition:opacity 250ms ease-out;
        &:hover {
          opacity:1;
        }
        svg {
          height: 18px;
          path {
            fill: $white;
            @include small-only {
              fill:$darkblue;
            }
          }
        }
      }
      &:first-child {
        font-size:12px;
        text-transform:uppercase;
        font-weight:$fw-bold;
        letter-spacing:$ls-buttons;
        @include small-only {
          position:absolute;
          left:0;
        }
      }
      &:first-child {
        margin-left:0;
      }
      &:last-child {
        margin-right:0;
      }
    }
  }
}
</style>
