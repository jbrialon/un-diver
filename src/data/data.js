const database = [
  {
    id: 0,
    type: 'watch',
    title: 'intro_title',
    weight: 11,
    intro: {
      weight: 3,
      items: [
        {id: 0, text: 'stage_1_text_1', weight: 1},
        {id: 1, text: 'stage_1_text_2', weight: 1},
        {id: 2, text: 'stage_1_text_3', weight: 1},
        {id: 3, text: 'stage_1_text_4', weight: 1}
      ]
    },
    watchModel: {
      weight: 1
    },
    features: {
      weight: 7,
      items: [
        {id: 'bluedial', text: 'stage_2_text', weight: 1},
        {id: 'diameter', text: 'stage_3_text', weight: 1},
        {id: 'caliber', text: 'stage_4_text_1', weight: 1},
        {id: 'glowing', text: 'stage_5_text_1', weight: 4},
        {id: 'waterproof', text: 'stage_6_text', weight: 1}
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
      buyLink: 'stage_7_watch_detail_link'
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
        buyLink: 'stage_7_other_1_price'
      },
      {
        id: 'gold',
        title: 'stage_7_other_2_title',
        description: 'stage_7_other_2_description',
        price: 'stage_7_other_2_price',
        buyLink: 'stage_7_other_2_price'
      },
      {
        id: 'white',
        title: 'stage_7_other_3_title',
        description: 'stage_7_other_3_description',
        price: 'stage_7_other_3_price',
        buyLink: 'stage_7_other_3_price'
      }
    ]
  },
  {
    id: 2,
    type: 'final',
    title: 'stage_final_2',
    text: 'stage_final_1',
    weight: 0
  }
]

export default database
