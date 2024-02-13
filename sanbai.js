const SANBAI_DIFFICULTIES = [
    ["SP", "BEGINNER"],
    ["SP", "BASIC"],
    ["SP", "DIFFICULT"],
    ["SP", "EXPERT"],
    ["SP", "CHALLENGE"],
    ["DP", "BASIC"],
    ["DP", "DIFFICULT"],
    ["DP", "EXPERT"],
    ["DP", "CHALLENGE"],
];
const SANBAI_LAMPS = [null, null, "EXTRA CLEAR", "GOOD FULL COMBO", "GREAT FULL COMBO", "PERFECT FULL COMBO", "MARVELOUS FULL COMBO"];

// Must be called from any Sanbai page while logged in
async function getSanbaiScores() {
    let songMapping = {};
    ALL_SONG_DATA.forEach((song) => {
        songMapping[song["song_id"]] = song["song_name"];
    });
    let scores = {};
    SCORE_DATA.forEach((score) => {
        const song = songMapping[score["song_id"]];
        const [style, diff] = SANBAI_DIFFICULTIES[score["difficulty"]];
        const nameStripped = song.replace(/\s/g, '');
        scores[[nameStripped, style, diff]] = {song, style, diff, score: score["score"], lamp: SANBAI_LAMPS[score["lamp"]]};
    });
    return scores;
}

await getSanbaiScores();
