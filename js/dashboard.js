import { buscarUsuarioComVeiculoJson } from './service/usuario-service.js';
import { listarVeiculosEletricos, obterAcessoriosEV } from './service/veiculo-service.js';
import { buscarTarifaEnergiaUf } from './service/tarifa-service.js';
import { buscarPrecoCombustivelUf } from './service/combustivel-service.js';
import { getImagemSrcFrom } from './utils/image-helper.js';
import { calcularCustoMensalCombustao, calcularCustoMensalEletrico } from './utils/consumo-helper.js';
import { calcularCustoTroca, calcularMesesPayback } from './service/calculos-service.js';
import { calcularPontuacaoConforto, calcularPontuacaoAutonomia, calcularPontuacaoPotencia, calcularPontuacaoPreco, calcularPontuacaoCustoBeneficio } from './utils/pontuacao-helper.js';
import { formatCurrency } from './utils/formatter.js';

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
        dadosUsuarioGlobal = await buscarUsuarioComVeiculoJson(cpf);
        console.log("Dados do usuário carregados:", dadosUsuarioGlobal);
        // Popula a seção do carro a combustão na tela
        document.getElementById('combustaoFabricante').innerText = dadosUsuarioGlobal.veiculo.fabricante || '-';
        document.getElementById('combustaoModelo').innerText = dadosUsuarioGlobal.veiculo.modelo || '-';
        document.getElementById('combustaoAno').innerText = dadosUsuarioGlobal.veiculo.ano || '-';
        document.getElementById('combustaoKm').innerText = dadosUsuarioGlobal.veiculo.km_mensal || '-';
        document.getElementById('combustaoRevenda').innerText = formatCurrency(dadosUsuarioGlobal.veiculo.valor_revenda || 0);

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
const selecionarCarroEletrico = async (ev) => {
    carroEletricoSelecionado = ev;

    const imagemSrc = getImagemSrcFrom(ev);
    const preco = ev.valor_compra || 0;
    const potencia = ev.potencia_cv || 0;
    const autonomia = ev.autonomia_km || 0;

    // Seção de destaque
    document.getElementById('evFoto').src = imagemSrc;
    document.getElementById('evModeloSelecionado').innerText = ev.modelo;
    document.getElementById('evPreco').innerText = formatCurrency(preco);
    document.getElementById('evPotenciaNum').innerText = potencia;
    document.getElementById('evAutonomiaNum').innerText = autonomia;

    // Infraestrutura
    document.getElementById('evInfra').innerText = ev.necessario_infra
        ? "Requer rede dedicada *"
        : "Não requer adaptações";

    // Acessórios
    const acessorios = await obterAcessoriosEV(ev);
    console.log("Acessórios obtidos do EV:", acessorios);
    if (acessorios.length > 0) {
        document.getElementById('evAcessorios').innerText = "";
        for (const acessorio of acessorios) {
            const p = document.createElement('p');
            p.innerText = '- ' + acessorio.nome + `: ${acessorio.valor_tamanho}`;
            document.getElementById('evAcessorios').appendChild(p);
        }
    } else {
        document.getElementById('evAcessorios').innerText = "-";
    }

    // observação sobre infraestrutura
    document.getElementById('evObservacao').innerText = ev.necessario_infra ? "*Custo da infraestrutura varia conforme a potência, rede elétrica existente, entre outros fatores. Consideramos aprox. R$10mil" : "";

    // Barras ilustrativas
    const barPotencia = document.getElementById('evPotenciaBar');
    const barConforto = document.getElementById('evConfortoBar');
    const barAutonomia = document.getElementById('evAutonomiaBar');
    const barPreco = document.getElementById('evPrecoBar');
    const barCustoBeneficio = document.getElementById('evCustoBar');

    const pctPreco = calcularPontuacaoPreco(preco);
    barPreco.style.width = `${pctPreco}%`;


    const pctConforto = calcularPontuacaoConforto(acessorios);
    barConforto.style.width = `${pctConforto}%`;

    const pctAutonomia = calcularPontuacaoAutonomia(autonomia);
    barAutonomia.style.width = `${pctAutonomia}%`;

    const pctPotencia = calcularPontuacaoPotencia(potencia);
    barPotencia.style.width = `${pctPotencia}%`;

    const pctCustoBeneficio = calcularPontuacaoCustoBeneficio(pctPreco, pctConforto, pctAutonomia, pctPotencia);
    barCustoBeneficio.style.width = `${pctCustoBeneficio}%`;

    // Dispara o cálculo financeiro comparativo
    calcularComparativoFinanceiro(ev);
};

// Realiza os cálculos ou chama o backend para obter o comparativo
const calcularComparativoFinanceiro = async (evEletrico) => {
    if (!dadosUsuarioGlobal) return;

    try {
        const ufUsuario = dadosUsuarioGlobal.estado;

        console.log("Calculando comparativo financeiro para o usuário: ", dadosUsuarioGlobal.cpf,
            "- Estado do usuário: ", ufUsuario,
            "- Veículo ev: ", evEletrico);

        const valorKwh = await buscarTarifaEnergiaUf(dadosUsuarioGlobal.estado);
        document.getElementById('resTarifaKwh').innerText = valorKwh.toFixed(3);

        let carro = dadosUsuarioGlobal.veiculo;
        let rodagem = carro.km_mensal;
        let consumoCarroCombustao = carro.consumo;
        let valorCombustivel = await buscarPrecoCombustivelUf(ufUsuario);
        let valorRevenda = Number.parseFloat(carro.valor_revenda) || 0;

        let custoMensalCombustao = await calcularCustoMensalCombustao(rodagem, consumoCarroCombustao, valorCombustivel);
        let custoMensalEletrico = await calcularCustoMensalEletrico(rodagem, evEletrico.consumo_mj_km, valorKwh);

        let custoTrocaEstimado = calcularCustoTroca(evEletrico.valor_compra, valorRevenda, evEletrico.necessita_infra);
        let economiaMensalEstimada = custoMensalCombustao - custoMensalEletrico;

        document.getElementById('resCustoTroca').innerText = formatCurrency(custoTrocaEstimado);
        document.getElementById('resCustoMensalCombustao').innerText = formatCurrency(custoMensalCombustao);
        document.getElementById('resCustoMensalEletrico').innerText = formatCurrency(custoMensalEletrico);
        document.getElementById('resEconomiaMensal').innerText = formatCurrency(economiaMensalEstimada);
        document.getElementById('resTarifaCombustivel').innerText = formatCurrency(valorCombustivel, 3);
        document.getElementById('resTarifaKwh').innerText = formatCurrency(valorKwh, 3);
        document.getElementById('resPayback').innerText = calcularMesesPayback(custoTrocaEstimado, economiaMensalEstimada);

    } catch (error) {
        console.error("Erro ao calcular comparativo:", error);
    }
};

window.voltarCadastro = () => {
    window.location.href = "index.html";
};