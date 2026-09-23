import { API_BASE_URL } from '../config.js';

export async function buscarUsuarioComVeiculo(cpf) {
    return fetch(`${API_BASE_URL}/usuario-carro?cpf=${encodeURIComponent(cpf)}`);
}

export async function criarUsuario(formData) {
    return fetch(`${API_BASE_URL}/usuario-carro`, {
        method: "POST",
        body: formData
    });
}

export async function alterarUsuario(formData) {
    return fetch(`${API_BASE_URL}/usuario-carro`, {
        method: "PATCH",
        body: formData
    });
}

export async function excluirUsuario(idUsuario) {
    return fetch(
        `${API_BASE_URL}/usuario?id_usuario=${idUsuario}`,
        { method: "DELETE" }
    );
}

export const buscarUsuarioComVeiculoJson = async (cpf) => {
    try {
        console.log("Carregando dados do usuário para o CPF:", cpf);
        const response = await fetch(`${API_BASE_URL}/usuario-carro?cpf=${encodeURIComponent(cpf)}`);
        return await response.json();
    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar as informações do seu veículo.");
    }
};