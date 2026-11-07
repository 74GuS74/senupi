    function explotarCorazon(x, y) {
        for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'particula-roja';
        p.style.left = (x - 9 + Math.random()*12) + 'px';
        p.style.top = (y - 9 + Math.random()*12) + 'px';
        // Dirección aleatoria
        const ang = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random()*38;
        p.style.setProperty('--x', Math.cos(ang)*dist + 'px');
        p.style.setProperty('--y', Math.sin(ang)*dist + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 700);
    }
}
function explosionCorazonesFondo() {
    for (let i = 0; i < 32; i++) {
        const c = document.createElement('div');
        c.className = 'corazon-explosion';
        const x = Math.random() * (window.innerWidth - 48);
        const y = window.innerHeight - 60 - Math.random()*120;
        c.style.left = x + 'px';
        c.style.top = y + 'px';
        c.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/833/833472.png" alt="corazón">';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2800);
    }
}
// Frase romántica general de Snoopy
const FRASE = "Contigo la vida es tan suave y tierna… como un abrazo de Snoopy.";
function animarFrase(frase) {
    const fraseCont = document.getElementById('frase');
    fraseCont.innerHTML = '';
    const giftWrap = document.getElementById('gift-wrap');
    const gift = document.getElementById('gift');
    const giftCorazon = document.getElementById('gift-corazon');
    const imgFinal = document.getElementById('img-final');
    giftWrap.style.display = 'none';
    imgFinal.style.display = 'none';
    let letras = [];
    frase.split('').forEach((letra, i) => {
        const span = document.createElement('span');
        span.textContent = letra === ' ' ? '\u00A0' : letra;
        span.className = 'letra-animada';
        span.style.opacity = 0;
        fraseCont.appendChild(span);
        letras.push(span);
    });
    setTimeout(() => {
        let containerRect = fraseCont.getBoundingClientRect();
        letras.forEach((span, i) => {
            const rect = span.getBoundingClientRect();
            span.dataset.x = rect.left - containerRect.left;
            span.dataset.y = rect.top - containerRect.top;
            span.style.left = '';
            span.style.top = '';
            span.style.position = 'relative';
            span.style.opacity = 0;
        });
        let idx = 0;
        function traerLetra() {
            if (idx >= letras.length) {
                giftWrap.style.display = 'none';
                imgFinal.style.display = 'block';
                explosionCorazonesFondo();
                return;
            }
            const span = letras[idx];
            if (span.textContent === '\u00A0') {
                span.style.opacity = 1;
                idx++;
                setTimeout(traerLetra, 24); // MÁS RÁPIDO
                return;
            }
            const lado = idx % 2 === 0 ? 'izq' : 'der';
            const rect = span.getBoundingClientRect();
            let startX = lado === 'izq' ? -120 : window.innerWidth + 120;
            let endX = rect.left;
            let endY = rect.top;
            giftWrap.style.display = 'block';
            gift.style.top = endY + 'px';
            gift.style.left = startX + 'px';
            gift.style.transform = lado === 'izq' ? 'scaleX(1)' : 'scaleX(-1)';
            giftCorazon.style.top = endY + 'px';
            giftCorazon.style.left = startX + 'px';
            giftCorazon.style.transform = lado === 'izq' ? 'scaleX(1)' : 'scaleX(-1)';
            let dur = 540; // MÁS RÁPIDO
            let start = null;
            function anim(ts) {
                if (!start) start = ts;
                let progress = Math.min((ts - start) / dur, 1);
                let currX = startX + (endX - startX) * progress;
                gift.style.left = currX + 'px';
                giftCorazon.style.left = currX + 'px';
                if (progress < 1) {
                    requestAnimationFrame(anim);
                } else {
                    span.style.opacity = 1;
                    giftCorazon.style.display = 'none';
                    explotarCorazon(endX + 27, endY + 27);
                    gift.style.transform = lado === 'izq' ? 'scaleX(-1)' : 'scaleX(1)';
                    giftCorazon.style.transform = gift.style.transform;
                    setTimeout(() => {
                        let durBack = 210; // MÁS RÁPIDO
                        let startBack = null;
                        function animBack(tsb) {
                            if (!startBack) startBack = tsb;
                            let progressBack = Math.min((tsb - startBack) / durBack, 1);
                            let currXBack = endX + (startX - endX) * progressBack;
                            gift.style.left = currXBack + 'px';
                            giftCorazon.style.left = currXBack + 'px';
                            if (progressBack < 1) {
                                requestAnimationFrame(animBack);
                            } else {
                                giftCorazon.style.display = '';
                                idx++;
                                setTimeout(traerLetra, 24); // MÁS RÁPIDO
                            }
                        }
                        requestAnimationFrame(animBack);
                    }, 60); // MÁS RÁPIDO
                }
            }
            requestAnimationFrame(anim);
        }
        traerLetra();
    }, 80);
}
window.onload = function() {
    animarFrase(FRASE);
    var music = document.getElementById('bg-music');
    var activarMusica = document.getElementById('activar-musica');
    if (music) {
        music.volume = 0.7;
        function playMusic() {
            music.play().catch(()=>{});
            if (activarMusica) {
                // Explosión de corazones en toda la pantalla
                explosionCorazonesFondo();
                // Desvanecer el botón
                activarMusica.style.transition = 'opacity 0.7s';
                activarMusica.style.opacity = '0';
                setTimeout(() => {
                    activarMusica.style.display = 'none';
                }, 700);
            }
        }
        activarMusica.onclick = playMusic;
        document.addEventListener('click', playMusic, { once: true });
        document.addEventListener('touchstart', playMusic, { once: true });
    }
}