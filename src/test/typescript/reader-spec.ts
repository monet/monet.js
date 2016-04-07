import { Reader } from '../../../index';

interface Config {
  host: string;
  port: Number;
}

const config = Reader.ask<Config>();
const url: Reader<Config, string> = config.map(c => `http://${c.host}:${c.port}`);
function fmt(msg: string): Reader<Config, string> {
  return config.map(c => `${c.host}: ${msg}`);
}
const port: Reader<Config, Number> = config.map(c => c.port);
const status = url.bind(u => fmt(`Listening for connections on ${u}...`));
const port2: Reader<Config, Number> = url.takeRight(port);


interface BigConfig {
  config: Config;
  otherStuff: any
}

const liftedStatus: Reader<BigConfig, String> = status.local<BigConfig>(bs => bs.config);
const bigConfig: BigConfig = {
  config: { host: "example.com", port: 8081 },
  otherStuff: {}
}

console.log(liftedStatus.run(bigConfig));


