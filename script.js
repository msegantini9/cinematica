const apiKey = "dc3a431a";
let movies = [];

async function getMovies(num) {

    let randomNumber, url;

    for (let i=0; i<num; i++) {
        
        randomNumber = Math.round((Math.random())*100);
        url = `https://www.omdbapi.com/?i=tt000000${randomNumber}&apikey=${apiKey}`

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const movie = await response.json();
            movies.push(movie);

        } catch (error) {
            console.error(error.message);
        }

    }

    console.log(movies)
}

