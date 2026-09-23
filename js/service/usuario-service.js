import { API_BASE_URL } from '../config.js';

// Busca o usuário e o carro a combustão no backend
const buscarUsuarioCarroPorCpf = async (cpf) => {
    try {
        console.log("Carregando dados do usuário para o CPF:", cpf);
        const response = await fetch(`${API_BASE_URL}/usuario-carro?cpf=${encodeURIComponent(cpf)}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar dados do usuário.");
        }
        let dadosUsuarioGlobal = await response.json();
        console.log("Dados do usuário carregados:", dadosUsuarioGlobal);
        return dadosUsuarioGlobal;
    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar as informações do seu veículo.");
    }
};

export { buscarUsuarioCarroPorCpf };