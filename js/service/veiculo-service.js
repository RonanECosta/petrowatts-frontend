import { API_BASE_URL } from '../config.js';

export const listarVeiculosEletricos = async () => {
    const response = await fetch(`${API_BASE_URL}/veiculos-eletricos`);
    if (!response.ok) {
        throw new Error("Erro ao buscar veículos elétricos");
    }
    const data = await response.json();
    return data.veiculos || data || [];
};
