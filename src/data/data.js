const database = [
  {
    id: 0,
    type: 'watch',
    title: 'The New Diver',
    weight: 11,
    intro: {
      weight: 3,
      items: [
        {id: 0, text: 'A diving watch collection', weight: 1},
        {id: 1, text: 'crafted to withstand up to', weight: 1},
        {id: 2, text: 'three hundred meters of', weight: 1},
        {id: 3, text: 'potentially deadly water pressure', weight: 1}
      ]
    },
    watchModel: {
      weight: 1
    },
    features: {
      weight: 7,
      items: [
        {id: 'bluedial', text: 'Inverted, concave bezel\nwith domed sapphire glass', weight: 1},
        {id: 'diameter', text: '42 and 44 mm diameters\nSturdy, blue rubber guards protect the crown', weight: 1},
        {id: 'caliber', text: 'UN-118 movement - silicium technology\nVisible through the open back', weight: 1},
        {id: 'glowing', text: 'Superluminova makes the hours and minutes\nvisible at great depths', weight: 4},
        {id: 'waterproof', text: 'Waterproof\nup to 300m', weight: 1}
      ]
    },
    details: {
      weight: 1,
      title: 'Diver Blue Dial',
      sku: '1183-170-3/93',
      movementLabel: 'movement',
      movementText: 'UN-1180 manufacture w. power reserve, small second and date\nUN certificate, Silicium technology',
      caseLabel: 'case',
      caseDiameter: 'Diameter 44mm',
      caseHeight: 'Height 10.75 mm',
      caseWater: 'Water resistance 300 m',
      price: '5\'800 CHF',
      buyLink: 'www.google.com'
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
        title: 'Black dial',
        description: 'Rubber\n44 mm',
        price: '5\'800 CHF',
        buyLink: 'www.google.com'
      },
      {
        id: 'gold',
        title: 'Gold Black dial',
        description: 'Rubber\n44 mm',
        price: '7\'900 CHF',
        buyLink: 'www.google.com'
      },
      {
        id: 'white',
        title: 'Great White',
        description: 'Rubber\n44 mm',
        price: '8\'900 CHF',
        buyLink: 'www.google.com'
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
