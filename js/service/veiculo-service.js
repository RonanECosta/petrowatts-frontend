import { API_BASE_URL } from '../config.js';

export const listarVeiculosEletricos = async () => {
    const response = await fetch(`${API_BASE_URL}/veiculos-eletricos`);
    if (!response.ok) {
        throw new Error("Erro ao buscar veículos elétricos");
    }
    const data = await response.json();
    return data.veiculos || data || [];
};

export const listarFabricantesCombustao = async () => {
    const response = await fetch(`${API_BASE_URL}/fabricantes_combustao`);
    if (!response.ok) {
        throw new Error("Erro ao buscar fabricantes");
    }
    return await response.json();
};

export const listarModelosPorFabricante = async (idFabricante) => {
    const response = await fetch(
        `${API_BASE_URL}/modelos?id_fabricante=${idFabricante}`
    );
    if (!response.ok) {
        throw new Error("Erro ao buscar modelos");
    }
    return await response.json();
};

export const listarAnosPorModelo = async (modelo) => {
    const response = await fetch(
        `${API_BASE_URL}/anos?modelo=${encodeURIComponent(modelo)}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar anos");
    }

    return await response.json();
};