import { i18n } from '@/i18n'
import Utils from '@/utils/Utils'

const device = Utils.isMobile() ? 'mobile' : 'desktop'
const database = [
  {
    id: 0,
    type: 'watch',
    title: 'intro_title',
    weight: 11,
    intro: {
      weight: 3,
      items: [
        {
          id: 0,
          text: 'stage_1_text_1',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-intro-0.png`
        },
        {
          id: 1,
          text: 'stage_1_text_2',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-intro-1.png`
        },
        {
          id: 2,
          text: 'stage_1_text_3',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-intro-2.png`
        },
        {
          id: 3,
          text: 'stage_1_text_4',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-intro-3.png`
        }
      ]
    },
    watchModel: {
      weight: 1
    },
    features: {
      weight: 7,
      items: [
        {
          id: 'bluedial',
          text: 'stage_2_text',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-feature-bluedial.png`
        },
        {
          id: 'diameter',
          text: 'stage_3_text',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-feature-diameter.png`
        },
        {
          id: 'caliber',
          text: 'stage_4_text_1',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-feature-caliber.png`
        },
        {
          id: 'glowing',
          text: 'stage_5_text_1',
          weight: 4,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-feature-glowing.png`
        },
        {
          id: 'waterproof',
          text: 'stage_6_text',
          weight: 1,
          texture: `images/screenshots/${i18n.locale}/${device}/watch-section-feature-waterproof.png`
        }
      ]
    },
    details: {
      weight: 1,
      title: 'stage_7_watch_detail_title',
      sku: 'stage_7_watch_detail_sku',
      movementLabel: 'stage_7_watch_detail_movementlabel',
      movementText: 'stage_7_watch_detail_movementtext',
      caseLabel: 'stage_7_watch_detail_caselabel',
      caseDiameter: 'stage_7_watch_detail_casediameter',
      caseHeight: 'stage_7_watch_detail_caseheight',
      caseWater: 'stage_7_watch_detail_Water',
      price: 'stage_7_watch_detail_price',
      buyLink: 'stage_7_watch_detail_link',
      texture: `images/screenshots/${i18n.locale}/${device}/watch-section-details.png`
    }
  },
  {
    id: 1,
    type: 'other-models',
    title: 'stage_7_text_2',
    weight: 2,
    watches: [
      {
        id: 'black',
        title: 'stage_7_other_1_title',
        description: 'stage_7_other_1_description',
        price: 'stage_7_other_1_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-black.png`
      },
      {
        id: 'gold',
        title: 'stage_7_other_2_title',
        description: 'stage_7_other_2_description',
        price: 'stage_7_other_2_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-gold.png`
      },
      {
        id: 'white',
        title: 'stage_7_other_3_title',
        description: 'stage_7_other_3_description',
        price: 'stage_7_other_3_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-white.png`
      },
      {
        id: '8163-175_92',
        title: 'stage_7_other_4_title',
        description: 'stage_7_other_4_description',
        price: 'stage_7_other_4_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-8163-175_92.png`
      },
      {
        id: '8163-175-7MIL_93',
        title: 'stage_7_other_5_title',
        description: 'stage_7_other_5_description',
        price: 'stage_7_other_5_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-8163-175-7MIL_93.png`
      },
      {
        id: '8163-175LE_93-BLUESHARK',
        title: 'stage_7_other_6_title',
        description: 'stage_7_other_6_description',
        price: 'stage_7_other_6_price',
        buyLink: 'header_cta_2',
        texture: `images/screenshots/${i18n.locale}/${device}/other-models-section-8163-175LE_93-BLUESHARK.png`
      }
    ]
  },
  {
    id: 2,
    type: 'final',
    title: 'stage_final_2',
    text: 'stage_final_1',
    texture: `images/screenshots/${i18n.locale}/${device}/final-section-text.png`,
    weight: 0
  }
]

export default database
