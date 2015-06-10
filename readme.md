# Noise Modeler JS

A JavaScript implementation of the Noise Modeler library.

The editor and C++ implementation can be found at
http://github.com/noisemodeler/noisemodeler

In contrast to the C++ version, this implementation does not generate GLSL
functions but instead evaluates values directly, using the CPU. Once an
acceptable testing framework is in place this version may be expanded to
include GLSL generation as well.

## Development

Make sure you have npm installed. Clone the repository, and then:

    npm install
    npm run dev

## Author

Johan Klokkhammer Helsing <johanhelsing@gmail.com>
