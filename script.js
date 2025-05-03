const apiKeyMovie = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMjEzMGY0NDA3MTJkMjVlMWU0Y2VjOGMwNjkxNWJiZiIsIm5iZiI6MTc0NjIzMDU3OS4xMTgsInN1YiI6IjY4MTU1ZDMzMjZlNTQxZTEzOWJlOGViNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lH0YEqcHyoXq4SZAJxqJVtMkUs0tELFLWSl5P_I1KgI";
const apiKeyPerson = "19410|QUh39vtMfmQq0pxny02qmjzsWVMYSCDq";
let people = [];
let queueClientes = [];
let movies = [];

const sessoes = document.querySelectorAll('.sessao-item');
const sessaoSelecionada = document.querySelector('.selecionada');
const clientes = document.querySelector('.clientes');
const filaDisplay = document.querySelector('.fila'); // Exibição da fila

document.addEventListener('DOMContentLoaded', async () => {

    await getMovies(10); // Realiza busca na API e retorna os filmes
    await getPeople(20); // Realiza busca na API e retorna as pessoas
    
    atualizaSessao(); // Atualiza a sessão selecionada ao clicar
    sessoes[5].click(); // Seleciona a sessão 6 inicialmente

    filaDisplay.textContent = `Clientes na fila: ${queueClientes.length}`;
});

function updateMovieRank(movie) {
    const foundMovie = movies.find(m => m.title === movie.title);
    if (foundMovie) {
        foundMovie.views += 1;
    } else {
        movie.views = 1;
        movies.push(movie);
    }
    showRanking();
}

function showRanking() {
    const sortedMovies = movies.sort((a, b) => b.views - a.views);
    const rankingList = document.querySelector('.ranking ol');
    rankingList.innerHTML = '';
    sortedMovies.slice(0, 3).forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = `${movie.title} - ${movie.views} ingressos`;
        rankingList.appendChild(listItem);
    });
}



async function getMovies(num) {

    const generos = [
          {
            "id": 28,
            "name": "Action"
          },
          {
            "id": 12,
            "name": "Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 14,
            "name": "Fantasy"
          },
          {
            "id": 36,
            "name": "History"
          },
          {
            "id": 27,
            "name": "Horror"
          },
          {
            "id": 10402,
            "name": "Music"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10749,
            "name": "Romance"
          },
          {
            "id": 878,
            "name": "Science Fiction"
          },
          {
            "id": 10770,
            "name": "TV Movie"
          },
          {
            "id": 53,
            "name": "Thriller"
          },
          {
            "id": 10752,
            "name": "War"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ];

    try {

        const response = await fetch(
            "https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1&region=BR", 
            {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${apiKeyMovie}`
                }
            });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        let data = await response.json();

        for (let i = 0; i < num; i++) {
            let element = data.results[i];

            let g;

            generos.forEach(e => {
                if(element.genre_ids[0] = e.id){
                    g = e.name;
                }
            });

            let movie = {
                title: element.title,
                genre: g,
                plot: element.overview,
                poster: `https://media.themoviedb.org/t/p/w300${element.poster_path}`,
                views: 0
            };

            queue(movies, movie);
            atualizaCapa(movie, i)
        }

    } catch (error) {
        console.log(error)
    }
}

function atualizaCapa(movie, i){

    // Atualiza as imagens das outras sessões (1-10)
    const sessaoItem = document.querySelector(`.sessao-item:nth-child(${i + 1})`);
    let imagemSessao = sessaoItem.querySelector('img');

    // Se não houver uma imagem, cria uma nova
    if (!imagemSessao) {
        imagemSessao = document.createElement('img');
        sessaoItem.appendChild(imagemSessao);
    }

    imagemSessao = sessaoItem.querySelector('img')

    // Definir a imagem para o filme
    imagemSessao.src = movie.poster;
    imagemSessao.alt = movie.title; // Atribui o título como o texto alternativo da imagem

    // Se houver erro no carregamento da imagem, usa o placeholder
    imagemSessao.onerror = () => {
        imagemSessao.src = "img/theater.svg";
    };
}

// Adiciona na lista
function queue(list, data) {
    list.push(data);

    return list;
}

//Remove da lista
function unqueue(list) {
    return list.pop();
}

//Gera uma lista de pessoas
async function getPeople(num) {
    let url;

    for (let i = 0; i < num; i++) {
        url = `https://api.invertexto.com/v1/faker?token=${apiKeyPerson}&fields=name%2Cbirth_date&locale=pt_BR`;

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

            let person = { name, age };
            queue(queueClientes, person);  // Adiciona a pessoa à fila

        } catch (error) {
            console.error("Erro ao carregar pessoa:", error.message);
        }
    }

    aprovarEntrada(true)
}

function atualizaSessao() {
    sessoes.forEach(sessao => {
        sessao.addEventListener('click', () => {
            // Remove seleção anterior
            sessoes.forEach(s => {
                s.style.backgroundColor = ''
                s.style.transform = "scale(1)"
                s.style.filter = "grayscale(0)"
            });
            
            // Atualiza sessão selecionada
            sessao.style.filter = "grayscale(1)"
            sessao.style.transform = "scale(1.2)"
            sessaoSelecionada.querySelector('h2').textContent = sessao.textContent;
            sessaoSelecionada.querySelector('img').src = sessao.querySelector('img').src;
            sessaoSelecionada.querySelector('h3').innerHTML = movies[sessao.id].title;
            sessaoSelecionada.querySelector('p').innerHTML = movies[sessao.id].genre;
            sessaoSelecionada.querySelector('.sinopse').innerHTML = `Sinopse: ${movies[sessao.id].plot.split(0, 200)}`;
        });
    })
}

function aprovarEntrada(first){

    let p = clientes.querySelectorAll('p');

    if (queueClientes.length > 0) {

        const client = queueClientes.shift(); // Remove a pessoa da fila
        filaDisplay.textContent = `Clientes na fila: ${queueClientes.length}`; // Atualiza a lista de clientes na fila

        // Coloca a pessoa em uma sessão aleatória
        const sessaoAleatoria = sessoes[Math.floor(Math.random() * sessoes.length)];

        // Troca o filme na sessão 6
        if (movies.length > 0) {
            const randomMovie = movies[Math.floor(Math.random() * movies.length)]; // Escolhe um filme aleatório
            updateMovieRank(randomMovie);
            // Atualiza a sessão com o filme aleatório
            sessaoSelecionada.querySelector('h2').textContent = `Sessão ${Number(sessaoAleatoria.id)+1}`;
            sessaoSelecionada.querySelector('img').src = randomMovie.poster;
            sessaoSelecionada.querySelector('h3').innerHTML = randomMovie.title;
            sessaoSelecionada.querySelector('p').innerHTML = randomMovie.genre;
            sessaoSelecionada.querySelector('.sinopse').innerHTML = `Sinopse: ${randomMovie.plot.split(0, 200)}`;
        }

        p[0].innerHTML = `Nome: ${queueClientes[1].name}`;
        p[1].innerHTML = `Idade: ${queueClientes[1].age}`;
        p[2].innerHTML = `Filme: ${sessaoSelecionada.querySelector('h3').innerHTML}`;
    }
}