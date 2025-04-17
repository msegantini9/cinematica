const apiKeyMovie = "dc3a431a";
const apiKeyPerson = "18994|9PqEHP98xbWgYslJRphz3V35TyRVdEE4" 
let movies = [];
let people = [];

async function getMovies(num) {

    let randomNumber, url;

    for (let i=0; i<num; i++) {
        
        randomNumber = Math.round((Math.random())*100); //Gera um número rndomico para bsca pelo ID do filme
        url = `https://www.omdbapi.com/?i=tt000000${randomNumber}&apikey=${apiKeyMovie}` // Realiza busca na API pelo ID

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();

            let movie = [data.Title, data.Genre, data.Plot, data.Poster];

            queue(movies, movie);

        } catch (error) {
            console.error(error.message);
        }

    }

    console.log(movies)
}

function queue(list, data) {
    list.push(data);
}

function unqueue(list) {
    list.pop();
}

async function getPeople(num) {

    let url;

    for (let i=0; i<num; i++) {
        
        url = `https://api.invertexto.com/v1/faker?token=${apiKeyPerson}&fields=name%2Cbirth_date&locale=pt_BR `

        try {

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await response.json();

            let now = new Date().getFullYear();
            let birth = new Date(data.birth_date).getFullYear();

            let name = data.name;
            let age = (now - birth);

            let person = [name, age]

            queue(people, person);

        } catch (error) {
            console.error(error.message);
        }

    }

    console.log(people)
}

document.addEventListener('DOMContentLoaded', () => {
    const sessoes = document.querySelectorAll('.sessao-item');
    const sessaoSelecionada = document.querySelector('.selecionada');
    
    sessoes.forEach(sessao => {
        sessao.addEventListener('click', () => {
            // Remove seleção anterior
            sessoes.forEach(s => s.style.backgroundColor = '');
            
            // Atualiza sessão selecionada
            sessao.style.backgroundColor = '#e0e0e0';
            sessaoSelecionada.querySelector('h2').textContent = sessao.textContent;
        });
    });

    // Simula dados iniciais
    sessoes[5].click(); // Seleciona a sessão 6 inicialmente
    getMovies(15); // Realiza busca na API e retorna os filmes
    getPeople(15); // Realiza busca na API e retorna as pessoas
});