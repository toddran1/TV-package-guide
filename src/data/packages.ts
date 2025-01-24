interface IPackage {
    name: string;
    networks: string[];
    price: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const packages: IPackage[] = [{'name': 'Basic', 'networks': ['CBS', 'CW', 'ABC', 'NBC'], 'price': 9.9}, {
    'name': 'Gold',
    'networks': ['CBS', 'CW', 'ABC', 'NBC', 'BET', 'Freeform', 'Nickelodeon', 'Bravo', 'HBO', 'Showtime', 'STARZ'],
    'price': 37.9,
}, {
    'name': 'Select',
    'networks': ['CBS', 'CW', 'ABC', 'NBC', 'BET', 'Freeform', 'Nickelodeon', 'Bravo'],
    'price': 17.9,
}, {
    'name': 'Silver',
    'networks': ['CBS', 'CW', 'ABC', 'NBC', 'BET', 'Freeform', 'Nickelodeon', 'Bravo', 'HBO', 'Showtime'],
    'price': 27.9,
}];

export {IPackage, packages};