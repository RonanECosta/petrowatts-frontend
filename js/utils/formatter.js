export const formatCurrency = (value, fractionDigits = 2) => {
    const formattedValue = value.toLocaleString('pt-BR',
        {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    return formattedValue;
};

export const getNumberFromFormattedString = (value) => {
    const numberValue = Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
    return numberValue;
};