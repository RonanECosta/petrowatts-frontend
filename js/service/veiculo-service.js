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

    const modelos = await response.json();

    // Filtra e remove modelos duplicados baseando-se na propriedade 'modelo'
    return Array.from(
        new Map(modelos.map(m => [m.modelo, m])).values()
    );
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

export const obterAcessoriosEV = async (ev) => {

    try {
        const response = await fetch(`${API_BASE_URL}/veiculo-eletrico-acessorios?id_veiculo=${ev.id}`);
        console.log(`Buscando acessórios para o veículo ${ev.id}`);
        if (response.ok) {
            const data = await response.json();
            return data.acessorios || [];
        }
        console.warn(`Não foi possível obter acessórios para o veículo ${ev.id}`);
        return [];
    } catch (error) {
        console.error("Erro ao carregar acessórios para cálculo de conforto:", error);
    }
};