async function parseKailuaPage(baseurl, id, page) {
    const url = `${baseurl}/game/ddr/${id}?page=${page}`;
    const res = await fetch(url);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const pageCount = doc.getElementsByName("summary")[0].children[0].innerText.split(' ');
    return {
        pageScores: Array.from(doc.getElementsByClassName("accordion-toggle"))
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
            }),
        hasNext: parseInt(pageCount[1]) < parseInt(pageCount[3]),
    };
}

async function parseKailua(baseurl, id) {
    let scores = {};
    let page = 1;
    while (true) {
        console.log(`Loading page ${page}...`);
        const { pageScores, hasNext } = await parseKailuaPage(baseurl, id, page);
        pageScores.forEach(({ song, style, diff, score, lamp }) => {
            const nameStripped = song.replace(/\s/g, '');
            scores[[nameStripped, style, diff]] = { song, style, diff, score, lamp };
        });
        if (!hasNext) break;
        page += 1;
    }
    console.log("Done!");
    return scores;
}

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

function inputIntoSA(scores) {
    Array.from(document.getElementById("score").getElementsByTagName("tr")).slice(2)
        .forEach(tr => {
            const song = tr.children[1].innerText;
            [
                [2, "SP", "BEGINNER"],
                [3, "SP", "BASIC"],
                [4, "SP", "DIFFICULT"],
                [5, "SP", "EXPERT"],
                [6, "SP", "CHALLENGE"],
                [7, "DP", "BASIC"],
                [8, "DP", "DIFFICULT"],
                [9, "DP", "EXPERT"],
                [10, "DP", "CHALLENGE"],
            ].forEach(([i, style, diff]) => {
                const nameStripped = song.replace(/\s/g, '');
                if ([nameStripped, style, diff] in scores) {
                    const entry = scores[[nameStripped, style, diff]];
                    const existing = tr.children[i].innerText;
                    if (existing === "-\n" || parseInt(existing) < entry.score) {
                        console.log(`Overwriting ${song}, ${style}, ${diff}...`);
                        tr.children[i].children[1].value = entry.score;
                        if (entry.lamp === "PERFECT FULL COMBO") {
                            tr.children[i].children[1].value += "**";
                        } else if (entry.lamp === "GREAT FULL COMBO" || entry.lamp === "GOOD FULL COMBO") {
                            tr.children[i].children[1].value += "*";
                        }
                    }
                }
            });
        });
}
