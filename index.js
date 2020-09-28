const askQuestion = require('./helper');
const http = require('http');
const chalk = require("chalk");

async function spitJokes() {
  const answer = await askQuestion(`Would you like to read a joke? (Type yes or the amount of jokes you would like to receive.)   `);

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
    console.log(chalk.magenta("You don't know what you are missing out on! Maybe another time, then. Bundesgarte-Ciao"));
    process.exit(0);
  }
}

function askForFurtherJokes() {
  setTimeout(async () => {
    const answer = await askQuestion(`Would you like more? (Type yes or the amount of jokes you would like to receive.)   `)


    if (answer === "yes") {
      console.log(chalk.magenta("BAM! "));
      await getJoke(1);
      askForFurtherJokes();
    } else if (answer > 1 && answer <= 100) {
      await getJoke(answer);
      askForFurtherJokes();
    } else if (answer < 1 || answer > 100) {
      console.log(typeof answer)
      console.log(chalk.red("Your input is wrong."));
      await askForFurtherJokes();
    } else {
      console.log(chalk.magenta("OK, Sayonara Cabonara!"));
      process.exit(0);
    }

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
