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
});