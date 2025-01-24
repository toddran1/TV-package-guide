interface IShow {
  title: string;
  network: string;
  imdbRating: number;
}

const shows: IShow[] = [
  {"title":"A Little Late With Lilly Singh","network":"NBC","imdbRating":1.5},
  {"title":"American Gods","network":"STARZ","imdbRating":7.7},
  {"title":"American Idol","network":"ABC","imdbRating":4.1},
  {"title":"Below Deck","network":"Bravo","imdbRating":7.3},
  {"title":"Big Little Lies","network":"HBO","imdbRating":8.5},
  {"title":"black-ish","network":"ABC","imdbRating":7.1},
  {"title":"Bunheads","network":"Freeform","imdbRating":7.6},
  {"title":"Dexter","network":"Showtime","imdbRating":8.6},
  {"title":"Everything's Gonna Be Okay","network":"Freeform","imdbRating":7.3},
  {"title":"Mom","network":"CBS","imdbRating":7.2},
  {"title":"Outlander","network":"STARZ","imdbRating":8.4},
  {"title":"Rebel","network":"BET","imdbRating":5.4},
  {"title":"Riverdale","network":"CW","imdbRating":6.8},
  {"title":"Silicon Valley","network":"HBO","imdbRating":8.5},
  {"title":"Southern Charm","network":"Bravo","imdbRating":6.2},
  {"title":"SpongeBob SquarePants","network":"Nickelodeon","imdbRating":8.2},
  {"title":"Rocket Power","network":"Nickelodeon","imdbRating":6.2},
  {"title":"The Amazing Race","network":"CBS","imdbRating":7.6},
  {"title":"The Fosters","network":"Freeform","imdbRating":7.9},
  {"title":"Top Chef","network":"Bravo","imdbRating":7.6},
  {"title":"Tyler Perry's The Oval","network":"BET","imdbRating":4},
  {"title":"Zoey's Extraordinary Playlist","network":"NBC","imdbRating":8.1}
];

export { IShow, shows };