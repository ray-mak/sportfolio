export const convertAmericanOdds = (americanOdds) => {
    let decimalOdds, probability
    if (americanOdds.startsWith("-")) {
        const number = parseFloat(americanOdds.replace(/[^\d.]/g, ''))
        decimalOdds = (100 / number) + 1
        probability = 100 / (100 / number + 1)
    } else {
        const number = parseFloat(americanOdds.replace(/[^\d.]/g, ''))
        decimalOdds = (number / 100) + 1
        probability = 100 / (number / 100 + 1)
    }

    return {
        decimalOdds: decimalOdds.toFixed(2),
        probability: probability.toFixed(2)
    }
}

export const convertDecimalOdds = (decimalOdds) => {
    let americanOdds, probability
    if (decimalOdds >= 2) {
        americanOdds = (decimalOdds - 1) * 100
        probability = (1 - (1 / decimalOdds)) * 100
    } else {
        americanOdds = -100 / (decimalOdds - 1)
        probability = (1 / decimalOdds) * 100
    }
    return {
        americanOdds: americanOdds.toFixed(0),
        probability: probability.toFixed(2)
    }
}

export const convertProbability = (probability) => {
    let americanOdds, decimalOdds;

    if (probability >= 50) {
        americanOdds = -(probability / (100 - probability)) * 100;
        decimalOdds = 100 / probability;
    } else {
        americanOdds = ((100 - probability) / probability) * 100;
        decimalOdds = (100 - probability) / probability + 1;
    }

    return {
        americanOdds: americanOdds.toFixed(0),
        decimalOdds: decimalOdds.toFixed(2)
    }
}