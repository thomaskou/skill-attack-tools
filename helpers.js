function stripName(name) {
    return name.replace(/\s/g, '')
        .replace(/＋/g, '+')
        .replace(/！/g, '!')
        .replace(/\u200b/g, '');
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
