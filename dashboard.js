const API_BASE_URL = 'http://127.0.0.1:5000';

// Variável para armazenar os dados do usuário/carro a combustão vindos do backend
let dadosUsuarioGlobal = null;
let carroEletricoSelecionado = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Resgata o CPF da sessão (via URL ou localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf') || localStorage.getItem('cpfConsulta');

    if (!cpf) {
        alert("Nenhum usuário identificado. Retornando ao cadastro.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById('dashCpf').innerText = cpf;

    // 2. Carrega os dados do usuário e do veículo a combustão do backend
    await carregarDadosUsuario(cpf);

    // 3. Carrega o catálogo de carros elétricos disponíveis para comparação
    await carregarCatalogoEletricos();
});

// Busca o usuário e o carro a combustão no backend
const carregarDadosUsuario = async (cpf) => {
    try {
        const response = await fetch(`${API_BASE_URL}/usuario-carro?cpf=${encodeURIComponent(cpf)}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
        }
        dadosUsuarioGlobal = await response.json();
        console.log("Dados do usuário carregados:", dadosUsuarioGlobal);

        // Popula a seção do carro a combustão na tela
        console.log("Populando seção do carro a combustão...");
        document.getElementById('combustaoFabricante').innerText = dadosUsuarioGlobal.veiculo.fabricante || '-';
        console.log("Fabricante carregado:", dadosUsuarioGlobal.veiculo.fabricante);
        document.getElementById('combustaoModelo').innerText = dadosUsuarioGlobal.veiculo.modelo || '-';
        console.log("Modelo:", dadosUsuarioGlobal.veiculo.modelo);
        document.getElementById('combustaoAno').innerText = dadosUsuarioGlobal.veiculo.ano || '-';
        console.log("Ano:", dadosUsuarioGlobal.veiculo.ano);
        document.getElementById('combustaoKm').innerText = dadosUsuarioGlobal.veiculo.km_mensal || '-';
        console.log("Rodagem Mensal:", dadosUsuarioGlobal.veiculo.km_mensal);

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar as informações do seu veículo.");
    }
};

const carregarCatalogoEletricos = async () => {
    const container = document.getElementById('listaMiniaturasEletricos');
    container.innerHTML = '<p>Carregando veículos elétricos...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/veiculos-eletricos`);
        let eletricos = [];

        if (response.ok) {
            const data = await response.json();
            eletricos = data.veiculos || data || [];
        } else {
            eletricos = [];
        }

        container.innerHTML = ''; // Limpa a mensagem de carregando

        if (eletricos.length === 0) {
            container.innerHTML = '<p>Nenhum veículo elétrico disponível.</p>';
            return;
        }

        eletricos.forEach(ev => {
            // Operação ternária aninhada extraída para instruções independentes
            let imagemSrc = getImagemSrcFrom(ev);

            const card = document.createElement('div');
            card.className = 'miniatura-card';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <img src="${imagemSrc}" alt="${ev.modelo}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 4px;">
                <h4 style="margin-top: 8px; font-size: 14px;">${ev.modelo}</h4>
                <p style="font-size: 12px; color: #666;">${ev.fabricante || ''}</p>
            `;

            // Ao clicar na miniatura, seleciona o carro para detalhamento
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

    // 1. Formata a imagem em Base64 para a área de destaque
    const imagemSrc = getImagemSrcFrom(ev);

    const preco = ev.valor_compra || ev.preco || 0;
    const potencia = ev.potencia_cv || ev.potencia || 0;
    const autonomia = ev.autonomia_km || ev.autonomia || 0;

    // 2. Preenche a seção de destaque
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

    // 3. Preenche as barrinhas ilustrativas
    if (document.getElementById('elPotenciaBar')) {
        document.getElementById('elPotenciaBar').style.width = `${Math.min((potencia / 300) * 100, 100)}%`;
    }
    if (document.getElementById('elAutonomiaBar')) {
        document.getElementById('elAutonomiaBar').style.width = `${Math.min((autonomia / 600) * 100, 100)}%`;
    }

    // 4. Dispara o cálculo financeiro comparativo
    calcularComparativoFinanceiro(ev);
};

const getImagemSrcFrom = (ev) => {
    let imagemSrc = './img/placeholder-ev.png';

    if (ev.thumbnail) {
        if (ev.thumbnail.startsWith('data:image')) {
            imagemSrc = ev.thumbnail;
        } else {
            imagemSrc = `data:image/jpeg;base64,${ev.thumbnail}`;
        }
    }

    return imagemSrc;
};

// Realiza os cálculos ou chama o backend para obter o comparativo
const calcularComparativoFinanceiro = async (evEletrico) => {
    if (!dadosUsuarioGlobal) return;

    const ufUsuario = dadosUsuarioGlobal.estado;

    try {
        // Exemplo de requisição para buscar a tarifa do Mockaroo que configuramos antes
        const responseTarifa = await fetch(`https://my.api.mockaroo.com/tarifas?uf=${ufUsuario}&key=d98ffdf0`);
        const dadosTarifa = await responseTarifa.json();

        const valorTarifa = dadosTarifa.tarifa || 0.95; // fallback caso dê erro
        document.getElementById('resTarifaUf').innerText = valorTarifa.toFixed(3);

        // Aqui você faria a chamada para o seu backend passando o id do carro a combustão, 
        // a rodagem mensal (`dadosUsuarioGlobal.veiculo.km_mensal`) e o preço/autonomia do elétrico escolhido.
        // Exemplo ilustrativo de lógica local provisória:

        let custoTrocaEstimado = evEletrico.preco; // Simplificado
        let economiaMensalEstimada = 450.00; // Valor simulado de economia de gasolina vs luz
        let mesesPayback = (custoTrocaEstimado / economiaMensalEstimada).toFixed(1);

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