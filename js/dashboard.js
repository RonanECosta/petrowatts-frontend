import { buscarUsuarioCarroPorCpf } from './service/usuario-service.js';
import { listarVeiculosEletricos } from './service/veiculo-service.js';
import { buscarTarifaEnergiaUf } from './service/tarifa-service.js';
import { getImagemSrcFrom } from './utils/image-helper.js';
import { calcularCustoTroca, calcularEconomiaMensal, calcularMesesPayback } from './service/calculos-service.js';


let dadosUsuarioGlobal = null;
let carroEletricoSelecionado = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Resgata o CPF da sessão (via URL ou localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf') || localStorage.getItem('cpfConsulta');

    if (!cpf) {
        alert("Nenhum usuário identificado. Retornando ao cadastro.");
        window.location.href = "index.html";
        return;
    }
    document.getElementById('dashCpf').innerText = cpf;
    await carregarDadosUsuario(cpf);
    await carregarCatalogoEletricos();
});

// Busca o usuário e o carro a combustão no backend
const carregarDadosUsuario = async (cpf) => {
    try {
        console.log("Carregando dados do usuário para o CPF:", cpf);
        dadosUsuarioGlobal = await buscarUsuarioCarroPorCpf(cpf);
        console.log("Dados do usuário carregados:", dadosUsuarioGlobal);
        // Popula a seção do carro a combustão na tela
        document.getElementById('combustaoFabricante').innerText = dadosUsuarioGlobal.veiculo.fabricante || '-';
        document.getElementById('combustaoModelo').innerText = dadosUsuarioGlobal.veiculo.modelo || '-';
        document.getElementById('combustaoAno').innerText = dadosUsuarioGlobal.veiculo.ano || '-';
        document.getElementById('combustaoKm').innerText = dadosUsuarioGlobal.veiculo.km_mensal || '-';

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar as informações do seu veículo.");
    }
};

const carregarCatalogoEletricos = async () => {
    const container = document.getElementById('listaMiniaturasEletricos');
    container.innerHTML = '<p>Carregando veículos elétricos...</p>';
    try {
        const eletricos = await listarVeiculosEletricos();
        container.innerHTML = '';

        if (eletricos.length === 0) {
            container.innerHTML = '<p>Nenhum veículo elétrico disponível.</p>';
            return;
        }

        eletricos.forEach(ev => {
            let imagemSrc = getImagemSrcFrom(ev);
            const card = document.createElement('div');
            card.className = 'miniatura-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <img src="${imagemSrc}" alt="${ev.modelo}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;">
                <h4 style="margin-top: 8px; font-size: 14px;">${ev.modelo}</h4>
                <p style="font-size: 12px; color: #666;">${ev.fabricante || ''}</p>
            `;
            card.addEventListener('click', () => selecionarCarroEletrico(ev));
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar elétricos:", error);
        container.innerHTML = '<p>Erro ao carregar o catálogo de elétricos.</p>';
    }
};

// Ação ao clicar em uma miniatura de elétrico
const selecionarCarroEletrico = (ev) => {
    carroEletricoSelecionado = ev;

    const imagemSrc = getImagemSrcFrom(ev);
    const preco = ev.valor_compra || ev.preco || 0;
    const potencia = ev.potencia_cv || ev.potencia || 0;
    const autonomia = ev.autonomia_km || ev.autonomia || 0;

    // Seção de destaque
    document.getElementById('elFoto').src = imagemSrc;
    document.getElementById('elPreco').innerText = preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    document.getElementById('elPotenciaNum').innerText = potencia;
    document.getElementById('elAutonomiaNum').innerText = autonomia;

    // Acessórios / Infraestrutura
    if (document.getElementById('elAcessorios')) {
        document.getElementById('elAcessorios').innerText = ev.necessario_infra
            ? "Requer infraestrutura de carregamento dedicada"
            : "Carregamento padrão compatível";
    }

    // Barras ilustrativas
    if (document.getElementById('elPotenciaBar')) {
        document.getElementById('elPotenciaBar').style.width = `${Math.min((potencia / 300) * 100, 100)}%`;
    }
    if (document.getElementById('elAutonomiaBar')) {
        document.getElementById('elAutonomiaBar').style.width = `${Math.min((autonomia / 600) * 100, 100)}%`;
    }

    // Dispara o cálculo financeiro comparativo
    calcularComparativoFinanceiro(ev);
};

// Realiza os cálculos ou chama o backend para obter o comparativo
const calcularComparativoFinanceiro = async (evEletrico) => {
    if (!dadosUsuarioGlobal) return;

    try {
        const ufUsuario = dadosUsuarioGlobal.estado;
        console.log("Calculando comparativo financeiro para o usuário:", dadosUsuarioGlobal.cpf);
        console.log("Estado do usuário:", ufUsuario);
        const tarifa = await buscarTarifaEnergiaUf(dadosUsuarioGlobal.estado);
        document.getElementById('resTarifaUf').innerText = tarifa.toFixed(3);
        const dadosTarifa = tarifa;

        const valorTarifa = dadosTarifa.tarifa || 0.95; // fallback caso dê erro
        document.getElementById('resTarifaUf').innerText = valorTarifa.toFixed(3);

        // Aqui você faria a chamada para o seu backend passando o id do carro a combustão, 
        // a rodagem mensal (`dadosUsuarioGlobal.veiculo.km_mensal`) e o preço/autonomia do elétrico escolhido.
        // Exemplo ilustrativo de lógica local provisória:

        let custoTrocaEstimado = calcularCustoTroca(evEletrico); // Supondo que exista uma função para calcular o custo de troca
        let economiaMensalEstimada = calcularEconomiaMensal(evEletrico); // Supondo que exista uma função para calcular a economia mensal
        let mesesPayback = calcularMesesPayback(custoTrocaEstimado, economiaMensalEstimada); // Supondo que exista uma função para calcular os meses de payback

        document.getElementById('resCustoTroca').innerText = custoTrocaEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        document.getElementById('resEconomiaMensal').innerText = economiaMensalEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        document.getElementById('resPayback').innerText = `${mesesPayback} meses`;

    } catch (error) {
        console.error("Erro ao calcular comparativo:", error);
    }
};

const voltarCadastro = () => {
    window.location.href = "index.html";
};