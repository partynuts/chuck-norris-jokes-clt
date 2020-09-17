const http = require('http');
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const chalk = require("chalk");


function spitJokes() {
  console.log("");
  let numberOfJokes = 1;
  rl.question(
    chalk.magenta(`Hi there, Would you like to read a joke? (Type yes or the amount of jokes you would like to receive.   `),
    answer => {
      if (answer === "yes") {
        console.log("");
        console.log(chalk.green("Here we go: "));
        getJoke(1);
        askForFurtherJokes();
      } else if (answer > 1 && answer <= 100) {
        getJoke(answer);
        askForFurtherJokes();
      } else {
        console.log(typeof answer)
        console.log(chalk.green("You don't know what you are missing out on! Maybe another time, then. Bundesgarte-Ciao"));
        rl.close();
      }
    }
  );
}

spitJokes();

function askForFurtherJokes() {
  setTimeout(() => {
    rl.question(
      chalk.magenta(`Would you like more? (Type yes or the amount of jokes you would like to receive.)   `),
      answer => {

        if (answer === "yes") {
          console.log(chalk.green("BAM! "));
          getJoke(1);
          askForFurtherJokes();
        } else if (answer > 1 && answer <= 100) {
          getJoke(answer);
          askForFurtherJokes();
        } else {
          console.log(chalk.green("OK, Sayonara Cabonara!"));
          rl.close();
        }
      }
    )
  }, 2000)
}


function getJoke(numberOfJokes) {
  const url = numberOfJokes==1 ? `http://api.icndb.com/jokes/random/` : `http://api.icndb.com/jokes/random/${numberOfJokes}`
  http.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      if (numberOfJokes === 1) {
        console.log(JSON.parse(data).value.joke);
      } else {
        console.log(JSON.parse(data).value.map(joke => joke.joke));
      }
      console.log("");
    });
    return;

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}
