// Main script
// Input : config.lst
// Output: (1): distribution package that includes:
//          - installation script that install: docker man, docker images related to i2g
//         (2): Build all upto date docker images related to i2g

require("./build-docker-images");
