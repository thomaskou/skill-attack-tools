const MAX_JOBS = 10;
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

/*
 * Sanbai functions
 */

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

/*
 * Kailua functions (Eagle/Flower)
 */

async function parseKailuaPage(baseurl, id, page) {
    console.log(`Loading page ${page}...`);
    const url = `${baseurl}/game/ddr/${id}?page=${page}`;
    const res = await fetch(url);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return Array.from(doc.getElementsByClassName("accordion-toggle"))
        .filter(tr => tr.children[0].children.length > 0)
        .map(tr => {
            const diff = tr.children[2].firstChild.wholeText.split(' ').filter(x => x);
            return {
                song: tr.children[1].children[0].children[0].innerText,
                style: diff[1],
                diff: diff[2],
                score: parseInt(tr.children[3].children[0].innerText.replace(/,/g, '')),
                lamp: tr.children[5].children[0]?.title,
            };
        });
}

// Must be called from the player's DDR score history page
async function getKailuaScores() {
    const baseurl = window.location.origin;
    const id = window.location.pathname.split('/')[3];
    const pageCount = parseInt(document.getElementsByName("summary")[0].children[0].innerText.split(' ')[3]);
    let scores = {};
    for (let batch = 1; batch <= pageCount; batch += MAX_JOBS) {
        let jobs = [];
        for (let page = batch; page < batch + MAX_JOBS && page <= pageCount; page++) {
            jobs.push(parseKailuaPage(baseurl, id, page));
        }
        const results = await Promise.all(jobs);
        results.flat(1).forEach(({ song, style, diff, score, lamp }) => {
            const nameStripped = song.replace(/\s/g, '');
            scores[[nameStripped, style, diff]] = { song, style, diff, score, lamp };
        });
    }
    console.log("Done!");
    return scores;
}

/*
 * Skill Attack functions
 */

// Must be called from the player's SA score matrix page
async function submitToSA(newScores, password, options = {}) {
    const id = (new URLSearchParams(window.location.search)).get("ddrcode");
    let totalPayload = `_=score_submit&ddrcode=${id}&password=${password}`;
    Array.from(document.getElementById("score").getElementsByTagName("tr")).slice(2).forEach((tr) => {
        const name = tr.children[1].innerText;
        const nameStripped = name.replace(/\s/g, '');
        let hasUpdate = false;
        let payload = `&index[]=${tr.children[0].innerText}`;
        [
            [2, "SP", "BEGINNER", "gsp"],
            [3, "SP", "BASIC", "bsp"],
            [4, "SP", "DIFFICULT", "dsp"],
            [5, "SP", "EXPERT", "esp"],
            [6, "SP", "CHALLENGE", "csp"],
            [7, "DP", "BASIC", "bdp"],
            [8, "DP", "DIFFICULT", "ddp"],
            [9, "DP", "EXPERT", "edp"],
            [10, "DP", "CHALLENGE", "cdp"],
        ].forEach(([column, style, diff, saFormKey]) => {
            payload += `&${saFormKey}[]=`;
            const existingScoreStr = tr.children[column].innerText.replace(/,/g, '');
            if ([nameStripped, style, diff] in newScores) {
                const newEntry = newScores[[nameStripped, style, diff]];
                const existingScore = existingScoreStr === "-" ? 0 : parseInt(existingScoreStr);
                if (existingScore < newEntry.score || (existingScore > newEntry.score && options["overwrite"])) {
                    let newScore = newEntry.score.toString();
                    const sign = newEntry.score > existingScore ? '+' : '';
                    console.log(`${name} [${style}-${diff}]  |  ${existingScore} -> ${newScore} (${sign}${newEntry.score - existingScore})`);
                    if (newEntry.lamp === "PERFECT FULL COMBO") {
                        newScore += "**";
                    } else if (newEntry.lamp === "GREAT FULL COMBO" || newEntry.lamp === "GOOD FULL COMBO") {
                        newScore += "*";
                    }
                    payload += newScore;
                    hasUpdate = true;
                }
            } else if (existingScoreStr && existingScoreStr !== "-" && options["overwrite"]) {
                console.log(`Deleting ${name} [${style}-${diff}]`);
                payload += "0";
                hasUpdate = true;
            }
        });
        if (hasUpdate) {
            totalPayload += payload;
        }
    });
    if (options["dryRun"]) {
        console.log(totalPayload);
    } else {
        console.log("Submitting scores...");
        await fetch("http://skillattack.com/sa4/dancer_input.php", {
            method: "POST", 
            body: totalPayload,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        });
        console.log("Your scores have been submitted!");
    }
}

/*
 * Other functions
 */

function mergeDicts(scoreDicts) {
    let scores = {};
    scoreDicts.forEach(scoreDict => {
        for (const key in scoreDict) {
            if (!(key in scores) || scores[key].score < scoreDict[key].score) {
                scores[key] = scoreDict[key];
            }
        }
    });
    return scores;
}
