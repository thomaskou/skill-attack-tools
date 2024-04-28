const SA_SCORE_MATRIX_COLUMNS = [
    [2, "SP", "BEGINNER", "gsp"],
    [3, "SP", "BASIC", "bsp"],
    [4, "SP", "DIFFICULT", "dsp"],
    [5, "SP", "EXPERT", "esp"],
    [6, "SP", "CHALLENGE", "csp"],
    [7, "DP", "BASIC", "bdp"],
    [8, "DP", "DIFFICULT", "ddp"],
    [9, "DP", "EXPERT", "edp"],
    [10, "DP", "CHALLENGE", "cdp"],
];

function stripName(name) {
    return name.replace(/\s/g, '')
        .replace(/＋/g, '+')
        .replace(/！/g, '!')
        .replace(/\u200b/g, '');
}

// Must be called from the player's SA score matrix page
async function submitToSA(newScores, password, options = {}) {
    const id = (new URLSearchParams(window.location.search)).get("ddrcode");
    let totalPayload = `_=score_submit&ddrcode=${id}&password=${password}`;
    Array.from(document.getElementById("score").getElementsByTagName("tr")).slice(2).forEach((tr) => {
        const name = tr.children[1].innerText;
        const nameStripped = stripName(name);
        let hasUpdate = false;
        let payload = `&index[]=${tr.children[0].innerText}`;
        SA_SCORE_MATRIX_COLUMNS.forEach(([column, style, diff, saFormKey]) => {
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

await submitToSA(scores, password);
