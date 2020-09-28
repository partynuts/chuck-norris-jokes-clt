const { spitJokes, getJoke } = require('../index');
const askQuestion = require('../helper');
const chalk = require('chalk');

jest.mock('../helper');
jest.mock('chalk');

const singleJokeFixture = {
  type: "success",
  value: {
    id: 268,
    joke: "Time waits for no man. Unless that man is Chuck Norris."
  }
};

describe('api', function () {
  beforeEach(() => {
    chalk.yellow = jest.fn();
    chalk.magenta = jest.fn();
    chalk.red = jest.fn();
  });

  const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});


  describe('spitJokes', () => {

    it('should return one joke if answer is yes', async () => {
      askQuestion.mockResolvedValue('yes');

      await spitJokes();

      expect(chalk.yellow).toHaveBeenCalledWith(expect.stringContaining('Chuck Norris'))
    });

    it('should end if answer is no', async () => {
      askQuestion.mockResolvedValue('no');

      await spitJokes();
      console.log("No no no no nooo", chalk.magenta.mock.calls);

      expect(mockExit).toHaveBeenCalledWith(0);
      expect(chalk.yellow).toHaveBeenCalledTimes(0);
      expect(chalk.magenta).toHaveBeenCalledWith(expect.stringContaining("Ok, as you wish! Maybe another time, then. Sayonara-Cabonara"))
    });

    it('should return multiple joke if answer is a number', async () => {
      askQuestion.mockResolvedValue('3')

      await spitJokes();
      expect(chalk.yellow).toHaveBeenCalledTimes(3);
    });

    it('should end the program if number inserted is bigger than 100 or smaller than 1', async () => {
      askQuestion.mockResolvedValue('101')

      await spitJokes();
      console.log("UI ui ui", chalk.red.mock.calls);
      expect(chalk.yellow).toHaveBeenCalledTimes(0);
      expect(chalk.red).toHaveBeenCalledWith(expect.stringContaining('Your input is wrong.'))
    });


  })


});
