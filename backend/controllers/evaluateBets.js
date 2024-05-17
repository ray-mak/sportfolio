// Sample data
const sampleBets = [
    { user: 'user1', event: 'event1', matchup: 'matchup1', pick: 'pick1', odds: 2.5, betAmount: 100 },
    { user: 'user2', event: 'event2', matchup: 'matchup2', pick: 'pick2', odds: 1.8, betAmount: 50 }
];

async function evaluateBets(bets) {
    try {
        const evaluatedBets = [];
        for (const bet of bets) {
            evaluatedBets.push({
                ...bet
            });
        }
        return evaluatedBets;
    } catch (error) {
        console.error("Error evaluating bets, ", error);
        throw error;
    }
}

// Call the function with sample data and log the result
evaluateBets(sampleBets).then(result => console.log(result));