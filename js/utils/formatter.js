export const formatCurrency = (value, fractionDigits = 2) => {
    console.log("Formatting value:", value, "with fractionDigits:", fractionDigits);
    const formattedValue = value.toLocaleString('pt-BR',
        {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        });
    console.log("Formatted value:", formattedValue);
    return formattedValue;
};

export const getNumberFromFormattedString = (value) => {
    console.log("Parsing formatted string to number:", value);
    const numberValue = Number(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
    console.log("Parsed number:", numberValue);
    return numberValue;
};