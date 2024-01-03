# Text-Util

The package helps to generate random text with defined size from provided set of sentences.

### Examples:
```shell
npx text-util generate <outputFile> <fileSizeThreshold> <sentencesFile>

# like in following line
npx text-util generate ./output/text.txt 1048578 ./defaults/sentences.txt

# or with no parameters, then all parameters will be taken by default (like in line above) 
npx text-util generate
```

Analyzes text file and create report
```shell
npx text-util analyze <inputFile>

# like in following line
npx text-util analyze ./output/text.txt

# or with no parameters, then all parameters will be taken by default (like in line above) 
npx text-util analyze
```

Help is shown by command
```shell
npx text-util -h
```
