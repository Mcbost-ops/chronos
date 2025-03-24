let modo24h = true;
let temaAtual = 0;
const temas = ['padrao', 'escuro', 'roxo', 'laranja'];
let dataBase = new Date();
let ultimaSincronizacao = new Date();

// Função para mostrar/esconder o loading
function toggleLoading(show) {
    const loading = document.querySelector('.loading');
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Função para obter o horário de Brasília
async function obterHorarioServidor() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
        const data = await response.json();
        return new Date(data.utc_datetime);
    } catch (error) {
        console.error('Erro ao obter horário do servidor:', error);
        return new Date(); // Se falhar, usa a hora local
    }
}

async function sincronizarHorario() {
    const agora = await obterHorarioServidor();
    const diferenca = agora - ultimaSincronizacao;
    dataBase = new Date(dataBase.getTime() + diferenca);
    ultimaSincronizacao = agora;
    atualizarFusosHorarios(dataBase);
}

function atualizarRelogio() {
    dataBase.setSeconds(dataBase.getSeconds() + 1);
    
    let horas = dataBase.getHours();
    const minutos = dataBase.getMinutes().toString().padStart(2, '0');
    const segundos = dataBase.getSeconds().toString().padStart(2, '0');
    
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
    
    atualizarData(dataBase);
    atualizarFusosHorarios(dataBase); // Adicionando atualização dos fusos horários
}

function atualizarFusosHorarios(dataBase) {
    const fusos = [
        { id: 'ny-time', offset: -3 },    // Nova York (UTC-4)
        { id: 'london-time', offset: 4 },  // Londres (UTC+1)
        { id: 'tokyo-time', offset: 12 },  // Tóquio (UTC+9)
        { id: 'sydney-time', offset: 13 }  // Sydney (UTC+10)
    ];
    
    fusos.forEach(fuso => {
        const hora = new Date(dataBase.getTime() + (fuso.offset * 60 * 60 * 1000));
        const horaFormatada = hora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: !modo24h
        });
        document.getElementById(fuso.id).textContent = horaFormatada;
    });
}

function atualizarData(data) {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const dataFormatada = `${diasSemana[data.getDay()]}, ${data.getDate()} de ${meses[data.getMonth()]} de ${data.getFullYear()}`;
    document.getElementById('data-completa').textContent = dataFormatada;
}

function alternarModo() {
    modo24h = !modo24h;
    atualizarRelogio();
}

function alternarTema() {
    temaAtual = (temaAtual + 1) % temas.length;
    document.body.className = `tema-${temas[temaAtual]}`;
}

// Inicialização
window.addEventListener('DOMContentLoaded', async () => {
    toggleLoading(true); // Mostra o loading
    await sincronizarHorario();
    atualizarRelogio();
    toggleLoading(false); // Esconde o loading
    setInterval(atualizarRelogio, 1000);
    setInterval(sincronizarHorario, 60000); // Sincroniza com o servidor a cada minuto
});
