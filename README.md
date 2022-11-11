
# Limelight Cards

This repository obtains and reformats cards for the Limelight application.

To test changes to code, you'll need nodejs.

Most of the work in this repository is related to the card classifier, which can be found [here](https://github.com/LimeLightCards/cards/blob/main/scripts/helpers/card-classifier.ts) and [here](https://github.com/LimeLightCards/cards/blob/main/scripts/helpers/classifications.json).

For complicated / nested classifications (ie, a main type that implies subtypes), you should edit the ts file. For simpler classifications (ie, standalone classifications), you should edit the json file.