export default function calcTotal(hand) {
    if (!hand) return 0

    let total = 0
    let aces = 0

    for (const card of hand) {
        const v = card.value

        if (v === 'K' || v === 'Q' || v === 'J') {
            total += 10
        } 
        else if (v === 'A') {
            total += 11
            aces++
        } 
        else {
            total += parseInt(v, 10)
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10
        aces--
    }

    return total
}
