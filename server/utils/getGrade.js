function getGrade(averageScore) {
    const score = Number(averageScore) || 0;
    if (score >= 9) return "A+";
    if (score >= 8) return "A";
    if (score >= 7) return "B";
    if (score >= 6) return "C";
    return "D";
}

module.exports = getGrade;