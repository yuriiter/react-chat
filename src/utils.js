export const onlineString = ago => {
    const dateTable = {
        dateStrings: ["min", "hour", "day", "week", "month", "year"],
        containsSeconds: [60, 3600, 86400, 597800, 17934000, 215208000]
    }
    if(ago < 60) {
        return "less than a minute"
    }
    else if(ago > 215208000) {
        return "more than a year"
    }
    else {
        for(let i = 0; i < dateTable.containsSeconds.length - 1; i++) {
            const low = dateTable.containsSeconds[i]
            const high = dateTable.containsSeconds[i + 1]
            if(ago < high) {
                const rounded = Math.floor(ago / low)
                if(rounded === 1) {
                    return `1 ${dateTable.dateStrings[i]}`
                }
                else {
                    return `${rounded} ${dateTable.dateStrings[i]}s`
                }
            }
        }
    }
}