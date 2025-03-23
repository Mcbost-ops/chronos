let modo24h = true;
let temaAtual = 0;
const temas = ['padrao', 'escuro', 'roxo', 'laranja'];

function atualizarRelogio() {
    const agora = new Date();
    let horas = agora.getHours();
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const segundos = agora.getSeconds().toString().padStart(2, '0');
    
    if (!modo24h) {
        const periodo = horas >= 12 ? 'PM' : 'AM';
        horas = horas % 12 || 12;
        document.getElementById('periodo').textContent = periodo;
    } else {
        document.getElementById('periodo').textContent = '';
    }
    
    document.getElementById('hora').textContent = horas.toString().padStart(2, '0');
    document.getElementById('minuto').textContent = minutos;
    document.getElementById('segundo').textContent = segundos;
    
    atualizarData(agora);
    atualizarFusosHorarios();
}

function atualizarData(data) {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dataFormatada = `${diasSemana[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
    document.getElementById('data-completa').textContent = dataFormatada;
}

function atualizarFusosHorarios() {
    const fusos = [
        { id: 'ny-time', zona: 'America/New_York' },
        { id: 'london-time', zona: 'Europe/London' },
        { id: 'tokyo-time', zona: 'Asia/Tokyo' },
        { id: 'sydney-time', zona: 'Australia/Sydney' }
    ];
    
    fusos.forEach(fuso => {
        const horaLocal = new Date().toLocaleString('pt-BR', {
            timeZone: fuso.zona,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !modo24h
        });
        document.getElementById(fuso.id).textContent = horaLocal;
    });
}

function alternarModo() {
    modo24h = !modo24h;
    const btn = document.querySelector('.btn-modo i');
    btn.className = modo24h ? 'fas fa-clock' : 'fas fa-clock';
    atualizarRelogio();
}

function alternarTema() {
    temaAtual = (temaAtual + 1) % temas.length;
    document.body.className = `tema-${temas[temaAtual]}`;
    
    const btn = document.querySelector('.btn-tema i');
    btn.classList.add('fa-spin');
    setTimeout(() => btn.classList.remove('fa-spin'), 500);
}

function toggleAlarme() {
    const btn = document.querySelector('.btn-alarme i');
    btn.classList.toggle('fa-shake');
}

// Animação inicial
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.container').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.container').style.opacity = '1';
        document.querySelector('.container').style.transition = 'opacity 1s ease';
    }, 100);
});

// Inicializar
setInterval(atualizarRelogio, 1000);
atualizarRelogio();
