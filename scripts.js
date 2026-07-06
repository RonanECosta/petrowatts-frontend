const API_BASE_URL = 'http://127.0.0.1:5000';

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    carregarUfs();
    carregarFabricantesCombustao();
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
        const response = await fetch(`${API_BASE_URL}/fabricantes_combustao`);
        const fabricantes = await response.json(); // Espera uma lista de [{id: 1, fabricante: 'Toyota'}, ...]

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
        const response = await fetch(`${API_BASE_URL}/modelos?id_fabricante=${idFabricante}`);
        const modelos = await response.json();

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


document.getElementById('modelo').addEventListener('change', async (e) => {
    const modeloSelecionado = e.target.value;
    const selectAno = document.getElementById('anoFabricacao');

    selectAno.innerHTML = '<option value="" disabled selected>Ano</option>';
    selectAno.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/anos?modelo=${encodeURIComponent(modeloSelecionado)}`);
        const anos = await response.json();

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

const novoCadastro = async () => {
    let cpf = document.getElementById("cpf").value;
    let nome = document.getElementById("nome").value;
    let uf = document.getElementById("uf").value;
    let rodagem = document.getElementById("rodagemMensal").value;
    let modelo = document.getElementById("modelo").value;
    let ano = document.getElementById("anoFabricacao").value;

    let comboFabricante = document.getElementById("fabricante");
    let idFabricante = comboFabricante.value; // Captura o ID numérico (ex: 2)
    let fabricante = comboFabricante.options[comboFabricante.selectedIndex]?.text || ''; // Captura o texto (ex: "Fiat")

    if (!cpf.trim() || !nome.trim() || !uf || !idFabricante || !modelo || !ano || !rodagem) {
        alert("Por favor, preencha todos os campos obrigatórios antes de continuar!");
        return;
    }

    const response = await postItem(cpf, nome, uf, idFabricante, modelo, ano, rodagem);

    console.info(`Resposta do servidor para o cadastro de CPF ${cpf}: Status ${response.status}`);
    if (response.status != 200) {
        alert("Erro no cadastro. Verifique os dados e tente novamente.");
        return;
    }

    alert("Cadastro e vínculo realizados com sucesso!");

    const data = await response.json();

    populaTela(data.id_usuario, nome, uf, fabricante, modelo, parseInt(ano, 10), parseInt(rodagem, 10));
};

const alterarCadastro = async () => {
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

    let comboFabricante = document.getElementById("fabricante");
    let idFabricante = comboFabricante.value; // Captura o ID numérico (ex: 2)
    let fabricante = comboFabricante.options[comboFabricante.selectedIndex]?.text || ''; // Captura o texto (ex: "Fiat")

    if (!cpf.trim() || !nome.trim() || !uf || !idFabricante || !modelo || !ano || !rodagem) {
        alert(`Por favor, preencha todos os campos obrigatórios antes de continuar! Campos obrigatórios: ${!cpf.trim() ? 'CPF, ' : ''}${!nome.trim() ? 'Nome, ' : ''}${!uf ? 'UF, ' : ''}${!idFabricante ? 'Fabricante, ' : ''}${!modelo ? 'Modelo, ' : ''}${!ano ? 'Ano, ' : ''}${!rodagem ? 'Rodagem Mensal' : ''}`);
        return;
    }

    const response = await patchItem(id_usuario, cpf, nome, uf, idFabricante, modelo, ano, rodagem);

    console.info(`Resposta do servidor para o cadastro de CPF ${cpf}: Status ${response.status}`);
    if (response.status != 200) {
        alert("Erro no cadastro. Verifique os dados e tente novamente.");
        return;
    }

    alert("Cadastro e vínculo realizados com sucesso!");

    const data = await response.json();

    populaTela(id_usuario, nome, uf, fabricante, modelo, parseInt(ano, 10), parseInt(rodagem, 10));
};

const novaConsulta = async () => {
    let cpf = document.getElementById("cpf").value;

    if (!cpf.trim()) {
        alert("Por favor, preencha o CPF para efetuar a consulta!");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/usuario-carro?cpf=${encodeURIComponent(cpf)}`);

    if (response.status === 404) {
        alert("Usuário não encontrado.");
        return;
    }
    const data = await response.json();

    // Atualiza campos com os dados que vieram do servidor
    populaFormulario(data);
    populaTela(data.id_usuario, data.nome, data.estado, data.veiculo.fabricante, data.veiculo.modelo, data.veiculo.ano, data.veiculo.km_mensal);
};

const postItem = async (cpf, nome, uf, idFabricante, modelo, ano, kmMensal) => {
    const formData = new FormData();
    formData.append('cpf', cpf);
    formData.append('nome', nome);
    formData.append('uf', uf);
    formData.append('id_fabricante', idFabricante);
    formData.append('modelo', modelo);
    formData.append('ano', ano);
    formData.append('km_mensal', kmMensal);

    try {
        const response = await fetch(`${API_BASE_URL}/usuario-carro`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const erroData = await response.json();
            alert(`Aviso do servidor: ${erroData.message}`);
        }

        return response; // Retorna o objeto response original para quem chamou
    } catch (error) {
        console.error('Erro ao enviar dados ao servidor:', error);
        return null;
    }
};

const patchItem = async (id_usuario, cpf, nome, uf, idFabricante, modelo, ano, kmMensal) => {
    const formData = new FormData();
    formData.append('id_usuario', id_usuario);
    formData.append('cpf', cpf);
    formData.append('nome', nome);
    formData.append('uf', uf);
    formData.append('id_fabricante', idFabricante);
    formData.append('modelo', modelo);
    formData.append('ano', ano);
    formData.append('km_mensal', kmMensal);

    try {
        const response = await fetch(`${API_BASE_URL}/usuario-carro`, {
            method: 'PATCH',
            body: formData
        });

        if (!response.ok) {
            const erroData = await response.json();
            alert(`Aviso do servidor: ${erroData.message}`);
        }

        return response; // Retorna o objeto response original para quem chamou
    } catch (error) {
        console.error('Erro ao enviar dados ao servidor:', error);
        return null;
    }
    alert(data.message);
}

// Função para deletar cadastro exibido na tela de consulta
const deleteCadastro = async () => {
    let id_usuario = document.getElementById("resId").innerText;

    if (!id_usuario || id_usuario === "-") {
        alert("Nenhum usuário selecionado para exclusão.");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/usuario?id_usuario=${encodeURIComponent(id_usuario)}`,
        { method: 'DELETE' });

    if (response.status === 404) {
        alert("Usuário não encontrado.");
        return;
    }
    const data = await response.json();

    alert(data.message);
    limpaTela();
    limpaFormulario();
    document.getElementById("deleteBtn").disabled = true;

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
        selectAno.value = parseInt(data.veiculo.ano, 10) || "";

    } catch (error) {
        console.error("Erro ao popular o formulário:", error);
    }
};

function populaTela(data) {
    populaTela(data.id_usuario, data.nome, data.estado, data.veiculo.fabricante, data.veiculo.modelo, data.veiculo.ano, data.veiculo.km_mensal);
}

function populaTela(id_usuario, nome, estado, fabricante, modelo, ano, km_mensal) {
    document.getElementById('resId').innerText = id_usuario;
    document.getElementById('resNome').innerText = nome;
    document.getElementById('resUf').innerText = estado;
    document.getElementById('resFabricante').innerText = fabricante;
    document.getElementById('resModelo').innerText = modelo;
    document.getElementById('resAno').innerText = parseInt(ano, 10);
    document.getElementById('resKm').innerText = parseInt(km_mensal, 10);

    document.getElementById("deleteBtn").disabled = false;
    document.getElementById("alterarBtn").disabled = false;
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

const limpaFormulario = () => {
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
};

