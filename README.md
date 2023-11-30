# Advent of Code 2023

This is using JavaScript in a `node.js` project.

If you only want to see the code for each day, open the **scripts** folder and read the relevant **dayXX.js** file.

### In the project

- **run.js** - runs the code for the specified day.

- **scripts** - folder with JavaScript files with the code for each day.

- **data** - folder with text files for the puzzle data for each day.

- **test** - folder with text files for the test data for each day.

- **template.js** - blank version of dayXX.js.

- **utils.js** - file handling and parsing routines.

- **createFiles.js** - set up the blank data files and templated code files. This will over-write any existing files.

### To use

- In `run.js`, set the day number and the expected results for part 1 of that day.
- In the terminal, run `node ./run.js` to execute the scripts.
- The results will be printed to the console.
- If the test result for part 1 is as expected, part 1 will run with live data.
- Once part 1 is complete, part 2 will run in the same way with tests first, then live data.
- Edit `runPart1()` and `runpart2()` in `scripts/dayXX.js` to solve the puzzle.
- If you find yourself using the same code frequently, add it to `utils.js` and import it into the `dayXX.js` file.
