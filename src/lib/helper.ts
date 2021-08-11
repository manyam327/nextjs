const getDateInMMYYYYFormat = (d: string) => {
  let month: any = new Date(d).getMonth() + 1;
  const year = new Date(d).getFullYear();
  if (month < 10) {
    month = '0' + month;
  }
  return month + year;
};

const categories = [
  {
    value: 'AS',
    name: 'Assets'
  },
  {
    value: 'BO',
    name: 'Business Op/Investment'
  },
  {
    value: 'FI',
    name: 'Finance'
  },
  {
    value: 'IP',
    name: 'Income Property'
  },
  {
    value: 'IN',
    name: 'International'
  },
  {
    value: 'LA',
    name: 'Land'
  },
  {
    value: 'RE',
    name: 'Residences'
  },
  {
    value: 'CO',
    name: 'Crypto Opportunities'
  },
  {
    value: 'OT',
    name: 'Other'
  }
];

const offerTypes = ["Purchase", "Sale", "Exchange", "Lease", "Option", "Other"];

export { getDateInMMYYYYFormat, categories, offerTypes };