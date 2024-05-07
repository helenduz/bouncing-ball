const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    var res = 0;
    // exclude 0
    while (res == 0) {
        res = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return res;
};

export { getRandomInt };
