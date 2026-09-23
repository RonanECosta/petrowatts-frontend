import {
    buscarUsuarioComVeiculo,
    criarUsuario,
    alterarUsuario,
    excluirUsuario
} from './service/usuario-service.js';
import {
    listarFabricantesCombustao,
    listarModelosPorFabricante,
    listarAnosPorModelo
} from './service/veiculo-service.js';

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    carregarUfs();
    carregarFabricantesCombustao();
    carregarModelosPorFabricanteSelecionada();
    carregarAnosPorModeloSelecionado();
});

// Alimenta o combo de UFs dinamicamente
const carregarUfs = () => {
    const ufs = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
        'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
        'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];
    const selectEstado = document.getElementById('uf');
    if (!selectEstado) return;

    ufs.forEach(uf => {
        const option = document.createElement('option');
        option.value = uf;
        option.textContent = uf;
        selectEstado.appendChild(option);
    });
};

const carregarFabricantesCombustao = async () => {
    const selectFabricante = document.getElementById('fabricante');

    try {
        const fabricantes = await listarFabricantesCombustao();

        fabricantes.forEach(fabricante => {
            const option = document.createElement('option');
            option.value = fabricante.id;
            option.textContent = fabricante.fabricante;
            selectFabricante.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar fabricantes:', error);
    }
};

// carrega Modelos conforme a fabricante selecionada
const carregarModelosPorFabricanteSelecionada = () => {
    document.getElementById('fabricante').addEventListener('change', async (e) => {
        const idFabricante = e.target.value;
        const selectModelo = document.getElementById('modelo');
        const selectAno = document.getElementById('anoFabricacao');

        // Reseta os combos filhos
        selectModelo.innerHTML = '<option value="" disabled selected>Modelo</option>';
        selectModelo.disabled = true;
        selectAno.innerHTML = '<option value="" disabled selected>Ano</option>';
        selectAno.disabled = true;

        try {
            const modelos = await listarModelosPorFabricante(idFabricante);

            modelos.forEach(mod => {
                const option = document.createElement('option');
                option.value = mod.modelo;
                option.textContent = mod.modelo;
                selectModelo.appendChild(option);
            });
            selectModelo.disabled = false;
        } catch (error) {
            console.error('Erro ao carregar modelos:', error);
        }
    });
};

const carregarAnosPorModeloSelecionado = () => {
    document.getElementById('modelo').addEventListener('change', async (e) => {
        const modeloSelecionado = e.target.value;
        const selectAno = document.getElementById('anoFabricacao');

        selectAno.innerHTML = '<option value="" disabled selected>Ano</option>';
        selectAno.disabled = true;

        try {
            const anos = await listarAnosPorModelo(modeloSelecionado);

            anos.forEach(obj => {
                if (obj.ano >= 2014 && obj.ano <= 2026) {
                    const option = document.createElement('option');
                    option.value = obj.ano;
                    option.textContent = obj.ano;
                    selectAno.appendChild(option);
                }
            });
            selectAno.disabled = false;
        } catch (error) {
            console.error('Erro ao carregar anos:', error);
        }
    });
};

window.novoCadastro = async () => {
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let uf = document.getElementById("uf").value;
    let rodagem = document.getElementById("rodagemMensal").value;
    let modelo = document.getElementById("modelo").value;
    let ano = document.getElementById("anoFabricacao").value;

    let comboFabricante = document.getElementById("fabricante");
    let idFabricante = comboFabricante.value;

    if (!cpf.trim() || !nome.trim() || !uf || !idFabricante || !modelo || !ano || !rodagem) {
        alert("Por favor, preencha todos os campos obrigatórios antes de continuar!");
        return;
    }
    const formData = criarFormDataUsuario(cpf, nome, uf, idFabricante, modelo, ano, rodagem);
    const response = await criarUsuario(formData);

    console.info(`Resposta do servidor para o cadastro de CPF ${cpf}: Status ${response.status}`);
    if (response.status != 200) {
        alert("Erro no cadastro. Verifique os dados e tente novamente.");
        return;
    }

    alert("Cadastro e vínculo realizados com sucesso!");

    const data = await response.json();

    populaTelaWith(data);
    ativaBotaoResultado(cpf);
};

window.alterarCadastro = async () => {
    let id_usuario = document.getElementById("resId").innerText;
    if (!id_usuario || id_usuario === "-") {
        alert("Nenhum usuário selecionado para alteração.");
        return;
    }
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let uf = document.getElementById("uf").value;
    let rodagem = document.getElementById("rodagemMensal").value;
    let modelo = document.getElementById("modelo").value;
    let ano = document.getElementById("anoFabricacao").value;
    let valorRevenda = Number.parseFloat(document.getElementById('resValorRevenda').innerText) || 0;

    let comboFabricante = document.getElementById("fabricante");
    let idFabricante = comboFabricante.value; // Captura o ID numérico (ex: 2)

    if (!cpf.trim() || !nome.trim() || !uf || !idFabricante || !modelo || !ano || !rodagem) {
        alert(`Por favor, preencha todos os campos obrigatórios antes de continuar! Campos obrigatórios: ${!cpf.trim() ? 'CPF, ' : ''}${!nome.trim() ? 'Nome, ' : ''}${!uf ? 'UF, ' : ''}${!idFabricante ? 'Fabricante, ' : ''}${!modelo ? 'Modelo, ' : ''}${!ano ? 'Ano, ' : ''}${!rodagem ? 'Rodagem Mensal' : ''}`);
        return;
    }
    const formData = criarFormDataUsuario(cpf, nome, uf, idFabricante, modelo, ano, rodagem, valorRevenda, id_usuario);
    const response = await alterarUsuario(formData);
    console.info(`Resposta do servidor para o cadastro de CPF ${cpf}: Status ${response.status}`);
    if (response.status != 200) {
        alert("Erro no cadastro. Verifique os dados e tente novamente.");
        return;
    }
    const msg = await response.json();
    alert("mensagem: " + msg.message);
    
    await buscarUsuarioEPopularTela(cpf);
};

window.novaConsulta = async () => {
    let cpf = document.getElementById("cpf").value;
    if (!cpf.trim()) {
        alert("Por favor, preencha o CPF para efetuar a consulta!");
        return;
    }
    await buscarUsuarioEPopularTela(cpf);
};


const buscarUsuarioEPopularTela = async (cpf) => {
    const response = await buscarUsuarioComVeiculo(cpf);
    if (response.status === 404) {
        alert("Usuário não encontrado.");
        return;
    }
    const data = await response.json();

    console.log("Dados do usuário consultado:", data);

    populaFormulario(data);
    populaTelaWith(data);
    ativaBotaoResultado(cpf);
    console.log("População da tela concluída para o CPF:", cpf);
};

window.deleteCadastro = async () => {
    let id_usuario = document.getElementById("resId").innerText;
    if (!id_usuario || id_usuario === "-") {
        alert("Nenhum usuário selecionado para exclusão.");
        return;
    }
    const response = await excluirUsuario(id_usuario);
    if (response.status === 404) {
        alert("Usuário não encontrado.");
        return;
    }
    const data = await response.json();
    alert(data.message);
    limpaTela();
    limpaFormulario();
    document.getElementById("deleteBtn").disabled = true;
    desativaBotaoResultado();
};

const populaFormulario = async (data) => {
    try {
        document.getElementById("cpf").value = data.cpf || "";
        document.getElementById("nome").value = data.nome || "";
        document.getElementById("uf").value = data.estado || "";
        document.getElementById("rodagemMensal").value = data.veiculo.km_mensal || "";
        //seleciona o fabricante do veículo no combo de fabricantes
        const selectFabricante = document.getElementById("fabricante");
        selectFabricante.value = data.veiculo.id_fabricante || "";
        selectFabricante.dispatchEvent(new Event('change'));//Dispara o evento de mudança para carregar os modelos correspondentes
        await new Promise(resolve => setTimeout(resolve, 300)); //aguarda o retorno
        //seleciona o modelo do veículo no combo de modelos
        const selectModelo = document.getElementById("modelo");
        selectModelo.value = data.veiculo.modelo || "";
        selectModelo.dispatchEvent(new Event('change'));//Dispara o evento de mudança para carregar os anos do modelo correspondente
        await new Promise(resolve => setTimeout(resolve, 300)); //aguarda o retorno
        //seleciona o ano do veículo no combo de anos
        const selectAno = document.getElementById("anoFabricacao");
        selectAno.value = Number.parseInt(data.veiculo.ano, 10) || "";
    } catch (error) {
        console.error("Erro ao popular o formulário:", error);
    }
};

function populaTelaWith(data) {
    populaTela(data.id_usuario, data.nome, data.estado, data.veiculo.fabricante, data.veiculo.modelo, data.veiculo.ano, data.veiculo.km_mensal, data.veiculo.valor_revenda);
}

function populaTela(id_usuario, nome, estado, fabricante, modelo, ano, km_mensal, valorRevenda) {
    document.getElementById('resId').innerText = id_usuario;
    document.getElementById('resNome').innerText = nome;
    document.getElementById('resUf').innerText = estado;
    document.getElementById('resFabricante').innerText = fabricante;
    document.getElementById('resModelo').innerText = modelo;
    document.getElementById('resAno').innerText = Number.parseInt(ano, 10);
    document.getElementById('resKm').innerText = Number.parseInt(km_mensal, 10);
    document.getElementById('resValorRevenda').innerText = Number.parseFloat(valorRevenda || 0);

    document.getElementById("deleteBtn").disabled = false;
    document.getElementById("alterarBtn").disabled = false;
}

function ativaBotaoResultado(cpf) {
    setBotaoResultado(cpf, true);
}

function desativaBotaoResultado() {
    setBotaoResultado(null, false);
}

function setBotaoResultado(cpf, ativar) {
    if (ativar) {
        localStorage.setItem('cpfConsulta', cpf);
    } else {
        localStorage.removeItem('cpfConsulta');
    }
    document.getElementById('irParaResultadoBtn').disabled = !ativar;
}

const limpaTela = () => {
    document.getElementById('resId').innerText = "-";
    document.getElementById('resNome').innerText = "-";
    document.getElementById('resUf').innerText = "-";
    document.getElementById('resFabricante').innerText = "-";
    document.getElementById('resModelo').innerText = "-";
    document.getElementById('resAno').innerText = "-";
    document.getElementById('resKm').innerText = "-";

    document.getElementById("deleteBtn").disabled = true;
    document.getElementById("alterarBtn").disabled = true;
};

window.limpaFormulario = () => {
    document.getElementById("cpf").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("uf").selectedIndex = 0;
    document.getElementById("fabricante").selectedIndex = 0;
    document.getElementById("modelo").innerHTML = '<option value="" disabled selected>Modelo</option>';
    document.getElementById("modelo").disabled = true;
    document.getElementById("anoFabricacao").innerHTML = '<option value="" disabled selected>Ano</option>';
    document.getElementById("anoFabricacao").disabled = true;
    document.getElementById("rodagemMensal").value = "";

    document.getElementById("deleteBtn").disabled = true;
    document.getElementById("alterarBtn").disabled = true;
    desativaBotaoResultado();
};

window.irParaResultados = async () => {
    const cpf = localStorage.getItem('cpfConsulta');
    if (!cpf) {
        alert("Nenhum CPF ativo para consulta.");
        return;
    }
    // Redireciona passando o CPF na URL (ou a nova página lê direto do localStorage)
    window.location.href = `dashboard.html?cpf=${encodeURIComponent(cpf)}`;
};

function criarFormDataUsuario(cpf, nome, uf, idFabricante, modelo, ano, kmMensal, valorRevenda, idUsuario = null) {
    const formData = new FormData();
    if (idUsuario) {
        formData.append('id_usuario', idUsuario);
    }
    formData.append('cpf', cpf);
    formData.append('nome', nome);
    formData.append('uf', uf);
    formData.append('id_fabricante', idFabricante);
    formData.append('modelo', modelo);
    formData.append('ano', ano);
    formData.append('km_mensal', kmMensal);
    formData.append('valor_revenda', valorRevenda || 0);
    return formData;
}
