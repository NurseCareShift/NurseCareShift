export interface Article {
    id: number;
    title: string;
    slug: string;
    description: string;
    category: string;
    imageUrl: string;
    sections: Section[];
  }
  
  export interface Section {
    id: number;
    title: string;
    contentFile: string;
  }
  
  // 記事データ
  export const articles: Article[] = [
    {
      id: 1,
      title: 'バイタルサイン',
      slug: 'vital-signs',
      description: 'バイタルサインの測定と評価方法を学びます。',
      category: '基礎',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: 'バイタルサインとは',
          contentFile: '/data/vital-signs-section1.json',
        },
        {
          id: 2,
          title: '血圧の測定方法',
          contentFile: '/data/vital-signs-section2.json',
        },
      ],
    },
    {
      id: 2,
      title: '身体初見',
      slug: 'physical-examination',
      description: '看護の基本的な技術と知識を学びます。',
      category: '基礎',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '身体初見の概要',
          contentFile: '/data/physical-examination-section1.json',
        },
      ],
    },
    {
      id: 3,
      title: '輸液療法',
      slug: 'infusion-therapy',
      description: '感染予防と対策について学びます。',
      category: '基礎',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '輸液療法の基礎',
          contentFile: '/data/infusion-therapy-section1.json',
        },
      ],
    },
    {
      id: 4,
      title: '酸素療法1',
      slug: 'oxygen-therapy-1',
      description: '傷のケアと包帯の巻き方を習得します。',
      category: '基礎',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '酸素療法の概要',
          contentFile: '/data/oxygen-therapy-1-section1.json',
        },
      ],
    },
    {
      id: 5,
      title: '心電図１',
      slug: 'ecg-1',
      description: '急性期患者への対応方法を学びます。',
      category: '基礎',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '心電図の基礎',
          contentFile: '/data/ecg-1-section1.json',
        },
      ],
    },
    {
      id: 6,
      title: '皮膚異常',
      slug: 'skin-abnormalities',
      description: '集中治療室での看護技術を学びます。',
      category: '中級',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '皮膚異常の識別',
          contentFile: '/data/skin-abnormalities-section1.json',
        },
      ],
    },
    {
      id: 7,
      title: '心電図２',
      slug: 'ecg-2',
      description: '患者との効果的なコミュニケーション方法を学びます。',
      category: '中級',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '心電図の応用',
          contentFile: '/data/ecg-2-section1.json',
        },
      ],
    },
    {
      id: 8,
      title: '酸素療法２',
      slug: 'oxygen-therapy-2',
      description: '患者の家族を支援する方法を学びます。',
      category: '中級',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '酸素療法の応用',
          contentFile: '/data/oxygen-therapy-2-section1.json',
        },
      ],
    },
    {
      id: 9,
      title: '検査値',
      slug: 'laboratory-values',
      description: '他職種との連携方法を学びます。',
      category: '中級',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '検査値の理解',
          contentFile: '/data/laboratory-values-section1.json',
        },
      ],
    },
    {
      id: 10,
      title: '脳神経',
      slug: 'neurology',
      description: '脳神経の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '脳神経の基礎',
          contentFile: '/data/neurology-section1.json',
        },
      ],
    },
    {
      id: 11,
      title: '心臓血管',
      slug: 'cardiovascular',
      description: '心臓血管系の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '心臓血管の基礎',
          contentFile: '/data/cardiovascular-section1.json',
        },
      ],
    },
    {
      id: 12,
      title: '食道・胃・腸',
      slug: 'digestive-system',
      description: '消化器系の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '消化器系の基礎',
          contentFile: '/data/digestive-system-section1.json',
        },
      ],
    },
    {
      id: 13,
      title: '胆嚢・肝臓・膵臓',
      slug: 'hepatobiliary-system',
      description: '胆嚢、肝臓、膵臓の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '胆嚢・肝臓・膵臓の基礎',
          contentFile: '/data/hepatobiliary-system-section1.json',
        },
      ],
    },
    {
      id: 14,
      title: '肺',
      slug: 'pulmonary',
      description: '肺の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '肺の基礎',
          contentFile: '/data/pulmonary-section1.json',
        },
      ],
    },
    {
      id: 15,
      title: '腎臓',
      slug: 'renal',
      description: '腎臓の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '腎臓の基礎',
          contentFile: '/data/renal-section1.json',
        },
      ],
    },
    {
      id: 16,
      title: '筋・骨格',
      slug: 'musculoskeletal',
      description: '筋・骨格系の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '筋・骨格の基礎',
          contentFile: '/data/musculoskeletal-section1.json',
        },
      ],
    },
    {
      id: 17,
      title: '皮膚',
      slug: 'skin',
      description: '皮膚の理解を深めます。',
      category: '臓器別疾患',
      imageUrl: 'https://via.placeholder.com/600x400',
      sections: [
        {
          id: 1,
          title: '皮膚の基礎',
          contentFile: '/data/skin-section1.json',
        },
      ],
    },
  ];
  