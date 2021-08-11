import Carousel from './../lib/external/react-multi-carousel';
import Image from 'next/image';

type Props = {
  deviceType: string;
};

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1,
    paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 1,
    paritialVisibilityGutter: 50
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1,
    paritialVisibilityGutter: 30
  }
};
const cardData = [
  {
    url: '/images/assets.jpg',
    logo: 'AS',
    logoClass: 'assets',
    heading: 'Assets',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/business-opportunities.jpg',
    logo: 'BO',
    logoClass: 'business-opportunities',
    heading: 'Business Opportunities',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/finance.jpg',
    logo: 'FI',
    logoClass: 'finance',
    heading: 'Finance',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/income-property.jpg',
    logo: 'IP',
    logoClass: 'income-property',
    heading: 'Income Property',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/international.jpg',
    logo: 'IN',
    logoClass: 'international',
    heading: 'International',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/land.jpg',
    logo: 'LA',
    logoClass: 'land',
    heading: 'Land',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/residences.jpg',
    logo: 'RE',
    logoClass: 'residences',
    heading: 'Residences',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  },
  {
    url: '/images/other.jpg',
    logo: 'CO',
    logoClass: 'other',
    heading: 'Crypto Opportunities',
    desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.'
  }
];

export default function CategorySwiper({ deviceType }: Props) {
  return (
    <Carousel
      ssr
      arrows={false}
      autoPlay
      autoPlaySpeed={2500}
      infinite
      itemClass="image-item"
      deviceType={deviceType}
      responsive={responsive}
      pauseOnHover={false}
    >
      {cardData.map((item, index) => {
        return (
          <div key={index}>
            <Image draggable={false} width={480} height={600} src={item.url} />
            <div className="caption">
              <div className={'logo ' + item.logoClass}>{item.logo}</div>
              <div className="heading mt-3">{item.heading}</div>
              {/* <div className="desc mt-3">{item.desc}</div> */}
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}
