import React from 'react';
import { Bio } from './Bio';

const previousBio = () => {
  return (
    <div className=''>
      <Bio
        type={'Before'}
        image={'/img/page/admin/Image-80.png'}
        title={'Albert Flores'}
        email={'albertflores@gmail.com'}
        number={'(319) 555-0115'}
        age={'56'}
        height={'5’7'}
        bodyType={'Curvy'}
        deal={'Smokers'}
        paragraph1={
          'Hi, I’m Cheryl Ann — 56 years young, standing tall at 5’7” with a naturally curvy figure. I’m a warm, down-to-earth woman who values kindness, honesty, and meaningful connections over superficial small talk. I love spending my time with people who can make me laugh, share their passions, and hold deep, genuine conversations that go beyond the surface.'
        }
        paragraph2={
          'I enjoy cozy coffee dates, spontaneous weekend getaways, and evenings filled with good food and even better company. I’m looking to meet someone authentic and emotionally mature — someone who’s ready to build something real, not just swipe endlessly.'
        }
        paragraph3={
          'Smoking is a no-go for me. If you’re open-minded, kind-hearted, and know what you want, we might just get along beautifully.'
        }
      />
    </div>
  );
};

export default previousBio;
