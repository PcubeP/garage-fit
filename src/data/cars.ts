export interface Car {
  id: string
  name: string
  lengthMm: number
  widthMm: number // excludes mirrors
  heightMm: number
}

// Approximate manufacturer dimensions (body width, mirrors folded), India market.
export const CARS: Car[] = [
  { id: 'alto-k10', name: 'Maruti Alto K10', lengthMm: 3530, widthMm: 1490, heightMm: 1520 },
  { id: 'wagonr', name: 'Maruti WagonR', lengthMm: 3655, widthMm: 1620, heightMm: 1675 },
  { id: 'swift', name: 'Maruti Swift', lengthMm: 3860, widthMm: 1735, heightMm: 1520 },
  { id: 'baleno', name: 'Maruti Baleno', lengthMm: 3990, widthMm: 1745, heightMm: 1500 },
  { id: 'dzire', name: 'Maruti Dzire', lengthMm: 3995, widthMm: 1735, heightMm: 1525 },
  { id: 'ertiga', name: 'Maruti Ertiga', lengthMm: 4395, widthMm: 1735, heightMm: 1690 },
  { id: 'i20', name: 'Hyundai i20', lengthMm: 3995, widthMm: 1775, heightMm: 1505 },
  { id: 'venue', name: 'Hyundai Venue', lengthMm: 3995, widthMm: 1770, heightMm: 1605 },
  { id: 'creta', name: 'Hyundai Creta', lengthMm: 4330, widthMm: 1790, heightMm: 1635 },
  { id: 'nexon', name: 'Tata Nexon', lengthMm: 3995, widthMm: 1804, heightMm: 1620 },
  { id: 'punch', name: 'Tata Punch', lengthMm: 3827, widthMm: 1742, heightMm: 1615 },
  { id: 'city', name: 'Honda City', lengthMm: 4550, widthMm: 1748, heightMm: 1489 },
  { id: 'seltos', name: 'Kia Seltos', lengthMm: 4315, widthMm: 1800, heightMm: 1645 },
  { id: 'innova', name: 'Toyota Innova Crysta', lengthMm: 4735, widthMm: 1830, heightMm: 1795 },
  { id: 'thar', name: 'Mahindra Thar', lengthMm: 3985, widthMm: 1855, heightMm: 1844 },
  { id: 'xuv700', name: 'Mahindra XUV700', lengthMm: 4695, widthMm: 1890, heightMm: 1755 },
  { id: 'scorpio-n', name: 'Mahindra Scorpio-N', lengthMm: 4662, widthMm: 1917, heightMm: 1857 },
  { id: 'fortuner', name: 'Toyota Fortuner', lengthMm: 4795, widthMm: 1855, heightMm: 1835 },
]
