import mealcity from "./utils/database";

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject()
                }
                else if(!mealcity.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    console.log(mealcity.isAlive());
    await waitConnection();
    console.log(mealcity.isAlive());
    console.log(await mealcity.getUsers());
    // console.log(await dbClient.nbFiles());
})();
