/**
 * © 2022 Guillaume Valmont pour sous licence libre AGPL
 */

// Fonction qui servira à remplacer les paramètres d'url
function remplace(tag, nouvelleValeur) {
  var index, debut, fin, separateurs;
  //Si le paramètre n'est pas présent, on le place avant la première virgule
  index = url.indexOf(tag);
  if (index < 0) {
    if (tag.charAt(0) === '&') { // Sauf si c'est un paramètre en '&', dans ce cas on le place à la fin
      index = url.length;
    } else {
      index = url.indexOf(',');
      // S'il n'y a pas de virgule, on le avant le &
      if (index < 0) {
        index = url.indexOf('&')
        // S'il n'y a pas non plus de &, on le place à la fin
        if (index < 0) {
          index = url.length;
        }
      }
    }
    debut = url.slice(0, index);
    index = index - 2;
  } else {
    debut = url.slice(0, index);
  }
  fin = url.slice(index + 1);
  separateurs = [',', '&', '?'];
  index = 999;
  separateurs.forEach(function (item) {
    if (fin.indexOf(item) > 0) {
      index = Math.min(index, fin.indexOf(item));
    }
  });
  fin = fin.slice(index);
  url = debut + nouvelleValeur + fin;
}

function retourner () {
  const boutonRetourner = document.getElementById('boutonRetourner')
  const flipCard = document.getElementById('flip-card')
  const flipCardInner = document.getElementById('flip-card-inner')
  const flipCardBack = document.getElementById('flip-card-back')
  if (flipCard.style.transform === 'rotateX(180deg)') {
    flipCard.style.transform = ''
    flipCardInner.style.transform = ''
    flipCardBack.style.transform = ''
    boutonRetourner.innerText = 'Voir la réponse'
  } else {
    flipCard.style.transform = 'rotateX(180deg)'
    flipCardInner.style.transform = 'rotateX(180deg)'
    boutonRetourner.innerText = 'Voir la question'
  }
}

// Ajoute un listener pour mettre à jour l'affichage lorsque l'exercice est chargé
var divListenerExistant = document.getElementById('postMessageListener')
if (divListenerExistant === null) {
  const divListener = document.createElement('div')
  divListener.id = 'postMessageListener'
  document.body.appendChild(divListener)
  window.addEventListener('message', () => {
    const valQuestion = document.getElementById('valQuestion')
    const valReponse = document.getElementById('valReponse')
    const chargements = document.getElementsByClassName('chargement')
    const boutonRetourner = document.getElementById('boutonRetourner')
    const flipCard = document.getElementById('flip-card')
    if (valQuestion !== null) valQuestion.style.display = 'block';
    if (valReponse !== null) valReponse.style.display = 'block';
    if (boutonRetourner !== null) boutonRetourner.style.display = 'block'
    if (flipCard !== null) {
      flipCard.style.width = largeur
      flipCard.style.height = hauteur
      flipCard.style.display = 'block'
    }
    for (const chargement of chargements) {
      chargement.style.display = 'none';
    }
  });
}

// Crée la graine
var graine = 'graine';
  graine = sessionStorage.getItem('graine');
  if (graine == null) {
    graine = Math.random().toString(16).substr(2, 4);
    sessionStorage.setItem('graine', graine);
  }

// Force le i=0, le cd=1, le v=recto et remplace la graine
remplace(',i=', ',i=0');
remplace(',cd=', ',cd=1');
remplace('&serie=', '&serie=' + graine);

// Injecte les iframes
var valQuestion = document.getElementById('valQuestion')
var valReponse = document.getElementById('valReponse')
if (valQuestion !== null) {
  remplace('&v=', '&v=recto');
  valQuestion.innerHTML = '<iframe scrolling="no" id="rectoFrame" width="' + largeur + '" frameborder="0" height="' + hauteur + '" src= "' + url + '"></iframe>';
}
if (valReponse !== null) {
  remplace('&v=', '&v=verso');
  valReponse.innerHTML = '<iframe scrolling="no" id="versoFrame" width="' + largeur + '" frameborder="0" height="' + hauteur + '" src= "' + url + '"></iframe>';
  sessionStorage.removeItem('graine'); 
}
