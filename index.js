const askQuestion = require('./helper');
const http = require('http');
const chalk = require("chalk");

const DEFAULT_QUESTION = `Would you like to read a joke? (Type yes or the amount of jokes you would like to receive.)   `
const MORE_QUESTION = `Would you like more? (Type yes or the amount of jokes you would like to receive.)   `

async function spitJokes(question = DEFAULT_QUESTION) {
  const answer = await askQuestion(question);

  if (answer === "yes") {
    console.log("");
    console.log(chalk.magenta("Here we go: "));
    await getJoke(1);
    await askForFurtherJokes();
  } else if (answer >= 1 && answer <= 100) {
    await getJoke(answer);
    await askForFurtherJokes();
  } else if (answer < 1 || answer > 100) {
    console.log(typeof answer)
    console.log(chalk.red("Your input is wrong."));
    await askForFurtherJokes();
  } else {
    console.log(typeof answer)
    console.log(chalk.magenta("Ok, as you wish! Maybe another time, then. Sayonara-Cabonara"));
    process.exit(0);
  }
}

function askForFurtherJokes() {
  setTimeout(async () => {
    spitJokes(MORE_QUESTION);
  }, 1000)
}

function getJoke(_numberOfJokes) {
  const numberOfJokes = Number(_numberOfJokes);
  const url = numberOfJokes === 1 ? 'http://api.icndb.com/jokes/random/?escape=javascript' : `http://api.icndb.com/jokes/random/${numberOfJokes}?escape=javascript`
  return new Promise((resolve, reject) => {
    http.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        if (numberOfJokes === 1) {
          console.log(chalk.yellow(JSON.parse(data).value.joke));
        } else {
          console.log(JSON.parse(data).value.map(joke => chalk.yellow(joke.joke)).join('\n'));
        }
        console.log("");
        resolve();
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject(err);
    });
  })
};


module.exports = {
  spitJokes,
  getJoke
};
