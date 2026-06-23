const API_BASE_URL = 'http://127.0.0.1:5000';

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    carregarUfs();
    carregarMarcas();
    getList();
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

// Busca todas as marcas (fabricantes) do banco de dados
const carregarMarcas = async () => {
    const selectMarca = document.getElementById('marca');

    try {
        const response = await fetch(`${API_BASE_URL}/fabricantes`);
        const marcas = await response.json(); // Espera uma lista de [{id: 1, fabricante: 'Toyota'}, ...]

        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.id;
            option.textContent = marca.fabricante;
            selectMarca.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
    }
};

// carrega Modelos conforme a marca selecioanda
document.getElementById('marca').addEventListener('change', async (e) => {
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


// Obtém a lista de veículos já cadastrados para renderizar na tabela
const getList = async () => {
    let url = `${API_BASE_URL}/veiculo-combustao`;
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then((data) => {
            // Remove dados residuais e mapeia as propriedades vindas do banco
            if (data && data.veiculos) {
                data.veiculos.forEach(item => insertList(item.nome, item.quantidade, item.valor));
            }
        })
        .catch((error) => console.error('Error:', error));
};

// Deleta um item da lista do servidor via requisição DELETE
const deleteItem = (nomeItem) => {
    let url = `${API_BASE_URL}/veiculo-combustao?nome=${encodeURIComponent(nomeItem)}`;
    fetch(url, { method: 'delete' })
        .then((response) => response.json())
        .catch((error) => console.error('Error:', error));
};

// Função chamada pelo clique do botão "Adicionar" (mapeado como newCar no HTML)
const newCar = () => {
    let nome = document.getElementById("nome").value;
    let uf = document.getElementById("uf").value;
    let rodagem = document.getElementById("rodagemMensal").value;
    let modelo = document.getElementById("modelo").value;
    let ano = document.getElementById("anoFabricacao").value;

    let comboMarca = document.getElementById("marca");
    let idFabricante = comboMarca.value; // Captura o ID numérico (ex: 2)
    let nomeMarca = comboMarca.options[comboMarca.selectedIndex]?.text || ''; // Captura o texto (ex: "Fiat")

    // Validação robusta de todos os campos obrigatórios na tela
    if (!nome.trim() || !uf || !idFabricante || !modelo || !ano || !rodagem) {
        alert("Por favor, preencha todos os campos obrigatórios antes de continuar!");
        return;
    }

    // Na tabela visual do HTML, exibiremos o Nome do Usuário, o Modelo do Carro e a Rodagem
    insertList(nome, `${nomeMarca} ${modelo} (${ano})`, `${rodagem} Km`);

    // Dispara o envio completo para o relacionamento das tabelas no backend
    postItem(nome, uf, idFabricante, modelo, ano, rodagem);

    alert("Cadastro e vínculo realizados com sucesso!");
    resetaFormulario();
};

const postItem = async (nome, estado, idFabricante, modelo, ano, kmMensal) => {
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('estado', estado);
    formData.append('id_fabricante', idFabricante);
    formData.append('modelo', modelo);
    formData.append('ano', ano);
    formData.append('km_mensal', kmMensal);

    try {
        const response = await fetch(`${API_BASE_URL}/usuario-veiculo`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const erroData = await response.json();
            alert(`Aviso do servidor: ${erroData.message}`);
        }
    } catch (error) {
        console.error('Erro ao enviar dados ao servidor:', error);
    }
};

// Insere uma nova linha com colunas e botão de remoção na tabela
const insertList = (nome, quantidade, valor) => {
    var item = [nome, quantity = quantidade, price = valor];
    var table = document.getElementById('myTable');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
        var cel = row.insertCell(i);
        cel.textContent = item[i];
    }

    // Insere a célula da lixeira utilizando a imagem nativa do cabeçalho
    let celAcao = row.insertCell(-1);
    let imgLixeira = document.createElement("img");
    imgLixeira.src = "https://flaticon.com";
    imgLixeira.width = 15;
    imgLixeira.height = 15;
    imgLixeira.style.cursor = "pointer";

    // Vincula o evento de clique de exclusão diretamente ao ícone
    imgLixeira.onclick = function () {
        let linhaTr = this.parentElement.parentElement;
        const nomeItem = linhaTr.getElementsByTagName('td')[0].innerHTML;

        if (confirm(`Deseja remover o registro de "${nomeItem}"?`)) {
            linhaTr.remove();
            deleteItem(nomeItem);
            alert("Removido com sucesso!");
        }
    };
    celAcao.appendChild(imgLixeira);
};

// Limpa os campos após inserção bem sucedida
const resetaFormulario = () => {
    document.getElementById("nome").value = "";
    document.getElementById("rodagemMensal").value = "";
    document.getElementById("uf").selectedIndex = 0;
    document.getElementById("marca").selectedIndex = 0;
    document.getElementById("modelo").innerHTML = '<option value="" disabled selected>Modelo</option>';
    document.getElementById("modelo").disabled = true;
    document.getElementById("anoFabricacao").innerHTML = '<option value="" disabled selected>Ano</option>';
    document.getElementById("anoFabricacao").disabled = true;
};
