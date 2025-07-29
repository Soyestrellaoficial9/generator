let isSerie = document.getElementById('serie');
let isMovie = document.getElementById('movie');

let types = document.querySelectorAll('input[type=radio][name=type]');

types.forEach(type => {
    type.addEventListener('change', () =>{
        if (type.value == "movie") {
            document.getElementById('season-selector').style.display = "none";
        } else if (type.value == "serie"){
            document.getElementById('season-selector').style.display = "block";
        }
    })
})


function convertMinutes(minutess){
    let hours = Math.floor(minutess / 60) ,
    minutes = Math.floor(minutess % 60),
    total = '';

    if (minutess < 60){
        total = `${minutes}m`
        return total
    } else if (minutess > 60){
      total = `${hours}h ${minutes}m`
      return total
    } else if (minutess = 60){
        total = `${hours}h`
        return total
    }
}


function generar() {
    let serieKey = document.getElementById('numero').value;
    let languaje = "es-MX"
    let seasonNumber = document.getElementById('numeroTemporada').value;

    const cargarPeliculas = async() => {

        if (isSerie.checked) {
            try {

                const respuesta = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
                const respuesta3 = await fetch(`https://api.themoviedb.org/3/tv/${serieKey}/season/${seasonNumber}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);
    
                if (respuesta.status === 200) {
                    const datos = await respuesta.json();
                    const datosTemporada = await respuesta3.json();
                    console.log(datos)
                    let tags = '';
    
                    datos.genres.forEach((genre, index) => {
                        if (index > 2) {
                            return
                        }
                        tags += `${genre.name},`          

                    });

                       
                    let episodeList = '';
    
                    datosTemporada.episodes.forEach(episode => {
                        let runtime ;
                        if (episode.runtime != null) {
                            runtime = convertMinutes(episode.runtime);
                        } else {
                            runtime = ''
                        }
                        episodeList += `
 "${episode.episode_number}": "__URL__",          
`
                    })
    
                    let seasonsOption = '';
    
                    datos.seasons.forEach(season => {
                        
                        if(season.name != "Especiales"){
                            seasonsOption += `<option value="${season.season_number}">Temporada ${season.season_number}</option>
                            `
                        }
                    })
    
                    let genSeasonsCount;
    
                    if (datos.number_of_seasons == 1){
                        genSeasonsCount = " Temporada"
                    } else if (datos.number_of_seasons > 1){
                        genSeasonsCount = " Temporadas"
                    }
                    
                    let template = document.getElementById('html-final');
    
                    let justHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${datos.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" />
  <style>
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
    }
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('https://image.tmdb.org/t/p/w500/${datos.backdrop_path}');
      background-size: cover;
      background-position: center;
      z-index: -2;
    }
    body::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      z-index: -1;
    }
    #iframe-principal {
      width: 100%;
      height: 220px;
      border: none;
      background: black;
    }
    #contenedor-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
    }
    .capitulo-seleccionado {
      background-color: #FF0000 !important;
      color: #fff !important;
      font-weight: bold;
      border-bottom: none !important;
    }
  </style>

<script disable-devtool-auto src='https://cdn.jsdelivr.net/npm/disable-devtool@latest'></script>
</head>
<body class="text-white font-sans leading-relaxed">

  
<div id="contenedor-video" class="relative">

 <iframe id="iframe-principal" allow="fullscreen" allowfullscreen></iframe>
  
  <a href="https://soyestrellaoficial9.github.io/home/" aria-label="Volver" class="absolute top-3 left-3 text-white text-2xl z-20">
    <i class="fas fa-arrow-left"></i>
  </a>

  <!-- Bloqueador de clics -->
  <div class="absolute top-0 left-0 w-full h-full z-10" style="pointer-events: none;"></div>
</div>


 <!-- CONTENIDO -->
<div class="px-4 pt-60 pb-4 space-y-4">

<div class="flex items-center justify-between">
  <h1 class="text-xl sm:text-2xl font-bold">${datos.name} T<span id="temp-titulo">1</span></h1>
  <button aria-label="Favorito" class="bg-[#1f1f1f] px-3 py-1 rounded text-sm flex items-center gap-2">
  
  </button>
</div>

    <!-- Calificación y género -->
    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
      <span><strong class="text-[#FF7F00]">${datos.vote_average.toFixed(1)}</strong> / 10</span>
      <span class="text-white">•</span>
      <span>${tags}</span><span class="text-white">•</span><span>${datos.first_air_date.slice(0,4)}</span>
    </div>

    <!-- Selector de Temporadas -->
    <div class="flex items-center gap-3">
      <label for="temporada" class="text-sm text-gray-300">Temporada:</label>
      <select id="temporada" class="bg-[#1f1f1f] text-white px-3 py-1 rounded text-sm">
        <option value="1">Temporada 1</option>
      

      </select>
    </div>


    <div class="flex space-x-2 overflow-x-auto scrollbar-hide pb-1" id="lista-capitulos">
    
    </div>

    <!-- Sinopsis -->
    <div class="bg-[#1e1e1e] rounded-lg p-4 text-sm text-gray-300 leading-relaxed">
      <p><span class="font-semibold text-white">Sinopsis:</span>${datos.overview}</p>
    </div>

  </div>

<script>
  var serieId = "${datos.id}";
  var temporadaSelect = document.getElementById('temporada');
  var listaCapitulos = document.getElementById('lista-capitulos');
  var tempTitulo = document.getElementById('temp-titulo');
  var btnFavorito = document.querySelector('button[aria-label="Favorito"]');
  var iconoCorazon = btnFavorito.querySelector('i');
  var iframePrincipal = document.getElementById('iframe-principal');

  var serieActual = {
    id: serieId,
    titulo: "${datos.name}",
    temporada: temporadaSelect.value,
    poster: "https://image.tmdb.org/t/p/w500/${datos.poster_path}"
  };

  var videosPorCapitulo = {
    "${seasonNumber}": {
      ${episodeList}
    },
    
  };

  function cargarFavoritos() {
    var favs = localStorage.getItem('seriesFavoritas');
    return favs ? JSON.parse(favs) : [];
  }

  function guardarFavoritos(favoritos) {
    localStorage.setItem('seriesFavoritas', JSON.stringify(favoritos));
  }

  function esFavorito(serie, favoritos) {
    return favoritos.some(function(fav) {
      return fav.id === serie.id && fav.temporada === serie.temporada;
    });
  }

  function actualizarBotonFavorito() {
    var favoritos = cargarFavoritos();
    if (esFavorito(serieActual, favoritos)) {
      btnFavorito.classList.add('bg-[#FF7F00]');
      iconoCorazon.classList.add('fas');
      iconoCorazon.classList.remove('far');
    } else {
      btnFavorito.classList.remove('bg-[#FF7F00]');
      iconoCorazon.classList.remove('fas');
      iconoCorazon.classList.add('far');
    }
  }

  btnFavorito.addEventListener('click', function() {
    var favoritos = cargarFavoritos();
    if (esFavorito(serieActual, favoritos)) {
      favoritos = favoritos.filter(function(fav) {
        return !(fav.id === serieActual.id && fav.temporada === serieActual.temporada);
      });
    } else {
      favoritos.push(Object.assign({}, serieActual));
    }
    guardarFavoritos(favoritos);
    actualizarBotonFavorito();
  });

  function guardarTemporada(temporada) {
    localStorage.setItem("temporadaSeleccionada_" + serieId, temporada);
  }

  function cargarTemporadaGuardada() {
    var temp = localStorage.getItem("temporadaSeleccionada_" + serieId);
    return temp ? temp : "1";
  }

  function guardarCapitulo(capitulo) {
    var key = "ultimoCapituloVisto_" + serieId + "_T" + serieActual.temporada;
    localStorage.setItem(key, capitulo);
  }

  function cargarCapituloGuardado() {
    var key = "ultimoCapituloVisto_" + serieId + "_T" + serieActual.temporada;
    var capituloGuardado = localStorage.getItem(key);
    var botones = listaCapitulos.getElementsByClassName('capitulo-btn');
    var encontrado = false;

    for (var i = 0; i < botones.length; i++) {
      botones[i].className = botones[i].className.replace(' capitulo-seleccionado', '');
      if (botones[i].getAttribute('data-capitulo') === capituloGuardado) {
        botones[i].className += ' capitulo-seleccionado';
        botones[i].scrollIntoView({ behavior: 'smooth', inline: 'center' });
        cambiarVideo(capituloGuardado);
        encontrado = true;
      }
    }
    if (!encontrado) {
      cambiarVideo("1");
    }
  }

  function cambiarVideo(capitulo) {
    var temp = serieActual.temporada;
    var url = videosPorCapitulo[temp] && videosPorCapitulo[temp][capitulo];
    if (url) {
      iframePrincipal.src = url;
      guardarCapitulo(capitulo);
    }
  }

  function generarCapitulos(temporada) {
    listaCapitulos.innerHTML = '';
    var capitulosObj = videosPorCapitulo[temporada] || {};
    var total = Object.keys(capitulosObj).length;
    
    for (var i = 1; i <= total; i++) {
      var btn = document.createElement('button');
      btn.className = 'capitulo-btn px-4 py-2 rounded bg-[#2a2a2a] text-white';
      btn.setAttribute('data-capitulo', i.toString());
      btn.textContent = i;
      listaCapitulos.appendChild(btn);
    }
    agregarEventosCapitulos();
    cargarCapituloGuardado();
  }

  function agregarEventosCapitulos() {
    var botones = listaCapitulos.getElementsByClassName('capitulo-btn');
    for (var i = 0; i < botones.length; i++) {
      (function(index){
        botones[index].onclick = function() {
          for (var j = 0; j < botones.length; j++) {
            botones[j].className = botones[j].className.replace(' capitulo-seleccionado', '');
          }
          if (botones[index].className.indexOf('capitulo-seleccionado') === -1) {
            botones[index].className += ' capitulo-seleccionado';
          }
          botones[index].scrollIntoView({ behavior: 'smooth', inline: 'center' });
          cambiarVideo(botones[index].getAttribute('data-capitulo'));
        };
      })(i);
    }
  }

  temporadaSelect.onchange = function() {
    var temp = temporadaSelect.value;
    serieActual.temporada = temp;
    tempTitulo.textContent = temp;
    guardarTemporada(temp);
    generarCapitulos(temp);
    actualizarBotonFavorito();
  };

  window.onload = function() {
    var tempGuardada = cargarTemporadaGuardada();
    temporadaSelect.value = tempGuardada;
    serieActual.temporada = tempGuardada;
    tempTitulo.textContent = tempGuardada;
    generarCapitulos(tempGuardada);
    actualizarBotonFavorito();
  };
</script>
</body>
</html> `;
                    
                    let seasonOnly = `
                    <option value="${seasonNumber}">Temporada ${seasonNumber}</option>
    
    "${seasonNumber}": {
      ${episodeList}  
        },
    
                    `;
    
                    const btnCopiar = document.getElementById('copiar');
    
                    if (seasonNumber == 1) {
                        template.innerText = justHtml;
                    } else if (seasonNumber > 1){
                        template.innerText = seasonOnly;
                    }
    
                    let templateHTML = template.innerText;
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })

                    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.name;
                    genSeasons.innerText = datos.number_of_seasons + genSeasonsCount;
                    genYear.innerText = datos.first_air_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }
        } else
        if(isMovie.checked){
            try {

            const respuesta = await fetch(`https://api.themoviedb.org/3/movie/${serieKey}?api_key=1d79b0abc34e3411aed8ee793526693d&language=${languaje}`);

            if (respuesta.status === 200) {
                const datos = await respuesta.json();
                let tags = '';
                console.log(datos)


                datos.genres.forEach((genre, index) => {
                    if (index > 2) {
                        return
                    }
                    tags += `${genre.name},`          

                });


                    let template = document.getElementById('html-final');

                    let justHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${datos.title}</title>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #1c1c1c;
  color: #ffffff;
  padding-bottom: 70px; /* espacio para barra inferior */
}

.container {
  padding: 0;
}

.header {
  padding: 10px 0;
}

.header iframe {
  width: 100%;
  height: 200px;
  background-color: #808080;
  border: none;
}

.details {
  background-color: #2c2c2c;
  padding: 15px;
  border-radius: 10px;
  margin-top: -5px;
}

.details h1 {
  font-size: 1.6em;
  margin: 0 0 10px;
}

.details .rating {
  color: #f39c12;
  font-size: 1.1em;
  margin-bottom: 5px;
  display: inline-block;
}

.details .info {
  font-size: 0.95em;
  color: #b0b0b0;
  margin: 5px 0;
}

.details .description {
  font-size: 1em;
  margin: 10px 0;
  line-height: 1.5em;
}

.details .credits {
  font-size: 0.95em;
  color: #b0b0b0;
}

.related, .suggestions {
  margin: 20px 15px 0;
}

.related h2, .suggestions h2 {
  font-size: 1.1em;
  margin: 10px 0;
}

.related .related-items, .suggestions .suggestion-items {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 10px;
  padding-bottom: 10px;
}

.related .related-items img,
.suggestions .suggestion-items img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  scroll-snap-align: start;
  flex-shrink: 0;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #312e2e;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 999;
}

.bottom-nav a {
  color: #888;
  text-align: center;
  text-decoration: none;
  flex-grow: 1;
  font-size: 12px;
}

.bottom-nav a.active {
  color: #ff6600;
}

.bottom-nav a i {
  font-size: 22px;
}

.bottom-nav a span {
  display: block;
  font-size: 11px;
  margin-top: 3px;
}

/* TABLETS Y MÁS GRANDES */
@media (min-width: 768px) {
  .header iframe {
    height: 300px;
  }

  .details h1 {
    font-size: 2.2em;
  }

  .details .rating {
    font-size: 1.4em;
  }

  .details .info, .details .description {
    font-size: 1.1em;
  }

  .related .related-items img,
  .suggestions .suggestion-items img {
    width: 120px;
    height: 120px;
  }
}

/* ESCRITORIOS */
@media (min-width: 1024px) {
  .header iframe {
    height: 400px;
  }

  .details h1 {
    font-size: 2.6em;
  }

  .details .rating {
    font-size: 1.6em;
  }

  .details .info, .details .description {
    font-size: 1.2em;
  }

  .related .related-items img,
  .suggestions .suggestion-items img {
    width: 150px;
    height: 150px;
  }
}
</style>
<script>
document.addEventListener('DOMContentLoaded', function () {
  var episodes = document.querySelectorAll('.episode-number');
  var iframe = document.querySelector('.header iframe');
  var videoUrls = ['__AQUI_VAN_LAS_URLS__'];

  episodes.forEach((episode, index) => {
    episode.addEventListener('click', function () {
      episodes.forEach(ep => ep.classList.remove('active'));
      episode.classList.add('active');
      iframe.src = videoUrls[index];
    });
  });
});
</script>
</head>
<body>
<div class="container">
  <div class="header">
    <iframe src="__AQUI_VA_EL_URL__" title="Video player" allowfullscreen></iframe>
  </div>

  <div class="details">
    <h1>${datos.title}</h1>
    <span class="rating">
      <i class="fa fa-star"></i> ${datos.vote_average.toFixed(1)}
    </span>
    <div class="info">
      <p>${datos.release_date.slice(0,4)} | <span>${tags}</span></p>
    </div>
    <div class="description">${datos.overview}</div>
    <div class="credits"><!-- Créditos aquí --></div>
  </div>
</div>

<div class="bottom-nav">
  <a href="javascript:history.back()" class="active">
    <i class="fa fa-arrow-left"></i>
    <span>REGRESAR</span>
  </a>
  <a href="https://soyestrellaoficial9.github.io/movies/">
    <i class="fas fa-video"></i>
    <span>Movies</span>
  </a>
  <a href="https://soyestrellaoficial9.github.io/series/">
    <i class="fas fa-tv"></i>
    <span>Series</span>
  </a>
  <a href="https://soyestrellaoficial9.github.io/search/">
    <i class="fas fa-search"></i>
    <span>Buscar</span>
  </a>
</div>
</body>
</html>`;                  
                    template.innerText = justHtml;
                    let templateHTML = template.innerText;
                    
                    const btnCopiar = document.getElementById('copiar');
                    
                    btnCopiar.addEventListener('click', () => {
                        navigator.clipboard.writeText(templateHTML);
                    })
    
    
                    let genPoster = document.getElementById('info-poster');
                    let genTitle = document.getElementById('info-title');
                    let genSeasons = document.getElementById('info-seasons');
                    let genYear = document.getElementById('info-year');
    
                    genPoster.setAttribute('src', `https://image.tmdb.org/t/p/w300/${datos.poster_path}`)
                    genTitle.innerText = datos.title;
                    genSeasons.innerText = "";
                    genYear.innerText = datos.release_date.slice(0,4);
    
    
    
                } else if (respuesta.status === 401) {
                    console.log('Wrong key');
                } else if (respuesta.status === 404) {
                    console.log('No existe');
                }
    
            } catch (error) {
                console.log(error);
            }           
        }

    }

    cargarPeliculas();
}

generar();



